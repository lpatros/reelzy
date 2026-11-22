import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';

const [address, ...options] = process.argv.slice(2);
assert.ok(address, 'Pass the local Expo address or the HTTPS staging origin.');
assert.ok(options.every((option) => ['--account', '--dev'].includes(option)), 'Unknown smoke test option.');
const origin = new URL(address.includes('://') ? address : `http://${address}`);
const fetchPath = (path, options, timeoutMs = 10_000) => fetch(new URL(path, origin), {
  ...options,
  signal: AbortSignal.timeout(timeoutMs),
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
const asset = await fetchPath(script, undefined, options.includes('--dev') ? 60_000 : 10_000);
assert.equal(asset.status, 200);
assert.match(asset.headers.get('content-type') ?? '', /javascript/);
await asset.body?.cancel();

for (const route of options.includes('--dev') ? [] : ['/_expo/missing.js', '/assets/missing.png']) {
  const missingAsset = await fetchPath(route);
  assert.equal(missingAsset.status, 404, route);
  await missingAsset.body?.cancel();
}

if (options.includes('--account')) {
  const accountPage = await fetchPath('/account', navigation);
  assert.equal(accountPage.status, 200);
  assert.equal(await accountPage.text(), shell);

  const manifestResponse = await fetchPath('/manifest.webmanifest');
  assert.equal(manifestResponse.status, 200);
  const manifest = await manifestResponse.json();
  assert.equal(manifest.display, 'standalone');
  for (const icon of manifest.icons) {
    const response = await fetchPath(icon.src);
    assert.equal(response.status, 200, icon.src);
    assert.match(response.headers.get('content-type') ?? '', /image\/png/);
    await response.body?.cancel();
  }

  const password = randomBytes(24).toString('hex');
  const email = `staging-check-${randomBytes(12).toString('hex')}@example.test`;
  const writeHeaders = { Origin: origin.origin, 'Content-Type': 'application/json' };
  const register = await fetchPath('/api/v1/auth/web/register', {
    method: 'POST',
    headers: writeHeaders,
    body: JSON.stringify({ email, password }),
  });
  assert.equal(register.status, 201, 'Synthetic account must be created.');
  assert.match(register.headers.get('cache-control') ?? '', /\bno-store\b/i);
  const setCookie = register.headers.get('set-cookie');
  assert.match(setCookie ?? '', /\bHttpOnly\b/i);
  if (origin.protocol === 'https:') assert.match(setCookie, /\bSecure\b/i);
  const cookie = setCookie.split(';')[0];
  const account = await register.json();
  const current = await fetchPath('/api/v1/me', { headers: { Cookie: cookie } });
  assert.equal(current.status, 200);
  assert.deepEqual(await current.json(), account);
  const deletion = await fetchPath('/api/v1/me', {
    method: 'DELETE',
    headers: { ...writeHeaders, Cookie: cookie, 'X-CSRF-Token': account.csrfToken },
    body: JSON.stringify({ password }),
  });
  assert.equal(deletion.status, 204, 'The synthetic account must be deleted.');
  assert.match(deletion.headers.get('cache-control') ?? '', /\bno-store\b/i);
  const revoked = await fetchPath('/api/v1/me', { headers: { Cookie: cookie } });
  assert.equal(revoked.status, 401, 'The deleted account session must be revoked.');
  await revoked.body?.cancel();
}

console.log('Web routes, API routing and static assets passed.');
if (options.includes('--account')) console.log('Account creation, session restoration, deletion and PWA assets passed.');
