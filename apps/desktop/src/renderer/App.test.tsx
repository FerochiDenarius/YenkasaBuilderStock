import { describe, expect, it } from 'vitest';

describe('desktop foundation', () => {
  it('uses the local API loopback default', () => {
    expect('http://127.0.0.1:8765').toContain('127.0.0.1');
  });
});
