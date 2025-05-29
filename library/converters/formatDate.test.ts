import formatData from './formatData';

describe('formatData', () => {
  it('returns correct time for AM hour', () => {
    const result = formatData('2025-05-28', '09:30 AM');
    const date = new Date(result);
    expect(date.getUTCHours()).toBe(6);
    expect(date.getUTCMinutes()).toBe(30);
  });

  it('returns correct time for PM hour (non-12)', () => {
    const result = formatData('2025-05-28', '03:45 PM');
    const date = new Date(result);
    expect(date.getUTCHours()).toBe(0);
    expect(date.getUTCMinutes()).toBe(45);
  });
});
