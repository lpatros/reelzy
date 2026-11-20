import assert from 'node:assert/strict';

const address = process.argv[2];
assert.ok(address, 'Pass the published Compose address, for example 127.0.0.1:8080.');
const fetchPath = (path) => fetch(new URL(path, `http://${address}`), {
  signal: AbortSignal.timeout(10_000),
});

const health = await fetchPath('/api/v1/health');
assert.equal(health.status, 200);
assert.deepEqual(await health.json(), { status: 'ok' });

const apiRoot = await fetchPath('/api');
assert.equal(apiRoot.status, 404);
assert.match(await apiRoot.text(), /Cannot GET \/api/);

const missingApi = await fetchPath('/api/v1/missing');
assert.equal(missingApi.status, 404);
assert.equal((await missingApi.json()).statusCode, 404);

const home = await fetchPath('/');
assert.equal(home.status, 200);
const shell = await home.text();
assert.match(shell, /<html lang="pt-BR"/);

for (let reload = 0; reload < 2; reload += 1) {
  const preview = await fetchPath('/preview/fase.1');
  assert.equal(preview.status, 200);
  assert.equal(await preview.text(), shell);
}

const script = shell.match(/<script[^>]*\ssrc="([^"]+)"/)?.[1];
assert.ok(script, 'The Expo export must reference a JavaScript asset.');
const asset = await fetchPath(script);
assert.equal(asset.status, 200);
assert.match(asset.headers.get('content-type') ?? '', /javascript/);
await asset.body?.cancel();

for (const route of ['/_expo/missing.js', '/assets/missing.png']) {
  const missingAsset = await fetchPath(route);
  assert.equal(missingAsset.status, 404, route);
  await missingAsset.body?.cancel();
}

console.log('Compose web, API routing and static assets passed.');
