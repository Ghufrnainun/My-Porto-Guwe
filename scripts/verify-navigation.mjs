import assert from 'node:assert/strict';
import { isPathActive } from '../src/lib/navigation.ts';

assert.equal(isPathActive('/', '/'), true, 'overview should be active at root');
assert.equal(isPathActive('/about', '/'), false, 'root should not stay active on another route');
assert.equal(isPathActive('/about', '/about'), true, 'a route should be active at its exact path');
assert.equal(isPathActive('/projects/tempe-mail', '/projects'), true, 'parent app should stay active for a case study');
assert.equal(isPathActive('/blog/post-1', '/blog'), true, 'writing app should stay active for a post');
assert.equal(isPathActive('/projects-old', '/projects'), false, 'prefix lookalikes should not activate an app');

console.log('Navigation matching verified for root, exact routes, nested routes, and prefix boundaries.');
