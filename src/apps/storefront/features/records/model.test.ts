import { describe, it, expect } from 'vitest';
import { messageInput, pageNumber } from './model';
describe('customer records boundaries', () => {
  it.each(['0', '-1', 'NaN', '1.5', '1001'])(
    'normalizes invalid page %s',
    (value) => expect(pageNumber(value)).toBe(1),
  );
  it('keeps a bounded page', () => expect(pageNumber('1000')).toBe(1000));
  it('rejects empty, oversized and control-character messages', () => {
    for (const text of ['', ' '.repeat(3), 'x'.repeat(2001), 'hello\0world'])
      expect(messageInput.safeParse({ text }).success).toBe(false);
  });
  it('retains plain-text markup and line breaks without HTML interpretation', () =>
    expect(
      messageInput.parse({ text: ' <script>hello</script>\nworld ' }).text,
    ).toBe('<script>hello</script>\nworld'));
});
