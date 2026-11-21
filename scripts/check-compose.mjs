import assert from 'node:assert/strict';

const [address, mode] = process.argv.slice(2);
assert.ok(address, 'Pass a local address such as 127.0.0.1:8080 or the HTTPS staging origin.');
assert.ok(mode === undefined || mode === '--identity-probe', 'Unknown smoke test option.');
const origin = new URL(address.includes('://') ? address : `http://${address}`);
assert.ok(mode !== '--identity-probe' || origin.protocol === 'https:', 'The identity probe requires HTTPS.');
const fetchPath = (path, options) => fetch(new URL(path, origin), {
  signal: AbortSignal.timeout(10_000),
  ...options,
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

const navigation = { headers: { Accept: 'text/html' } };
const home = await fetchPath('/', navigation);
assert.equal(home.status, 200);
const shell = await home.text();
assert.match(shell, /<html lang="pt-BR"/);

for (let reload = 0; reload < 2; reload += 1) {
  const preview = await fetchPath('/preview/fase.1', navigation);
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

if (mode === '--identity-probe') {
  const probe = '/api/v1/identity-probe/web';
  const session = await fetchPath(`${probe}/session`);
  assert.equal(session.status, 401, 'An unauthenticated request must not gain a session.');
  assert.match(session.headers.get('cache-control') ?? '', /\bno-store\b/i);
  await session.body?.cancel();

  const callback = await fetchPath(`${probe}/callback`, { redirect: 'manual' });
  assert.equal(callback.status, 303, 'An incomplete callback must return to the web app.');
  assert.match(callback.headers.get('cache-control') ?? '', /\bno-store\b/i);
  assert.equal(callback.headers.get('location'), '/identity-probe?status=sign-in-failed');
  await callback.body?.cancel();
}

console.log('Web routes, API routing and static assets passed.');
