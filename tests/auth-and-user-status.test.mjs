import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const loginRoute = readFileSync('app/api/auth/login/route.ts', 'utf8');
const usersRoute = readFileSync('app/api/users/route.ts', 'utf8');
const middleware = readFileSync('middleware.ts', 'utf8');

test('login query and validation do not depend on user status', () => {
  assert.match(loginRoute, /SELECT userId, username, role, password FROM users WHERE username=\? OR email=\? LIMIT 1/);
  assert.doesNotMatch(loginRoute, /status FROM users|user\.status|status\s*!==\s*'active'|is_active|inactive/);
  assert.match(loginRoute, /if \(!user\) return NextResponse\.json\(\{ message: 'Invalid credentials' \}, \{ status: 401 \}\)/);
});

test('fetching users does not include status filters or status payload fields', () => {
  assert.match(usersRoute, /SELECT userId, username, email, role, createdOn FROM users/);
  assert.doesNotMatch(usersRoute, /status FROM users|INSERT INTO users\([^\)]*status|WHERE[^\n]*status|is_active|inactive/);
});

test('RBAC redirect and guard behavior is role-based', () => {
  assert.match(middleware, /admin_gudang: '\/admin\/stok-barang'/);
  assert.match(middleware, /kepala_gudang: '\/kepala-gudang\/dashboard-analisis'/);
  assert.match(middleware, /pathname\.startsWith\('\/admin'\) && role !== 'admin_gudang'/);
  assert.match(middleware, /pathname\.startsWith\('\/kepala-gudang'\) && role !== 'kepala_gudang'/);
  assert.doesNotMatch(middleware, /status|active|inactive/);
});
