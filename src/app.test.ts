import { greet } from './app';

test('greet function', () => {
  expect(greet('World')).toBe('Hello, World!');
});
