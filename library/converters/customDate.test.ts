import formatEventDate from './customDate';
import Cookies from 'js-cookie';

jest.mock('js-cookie', () => ({
  get: jest.fn(),
}));

// Hardcoded ISO datetime in UTC
const time = {
  startHour: '2025-05-28T12:00:00.000Z',
  endHour: '2025-05-28T14:00:00.000Z',
};

describe('formatEventDate', () => {
  it('returns correct date and time when timezones are the same', () => {
    const result = formatEventDate(
      time,
      'Romania',
      'Bucharest',
      'Europe/Bucharest',
      'Europe/Bucharest'
    );

    expect(result.startHour).toMatch(/\d{2}:\d{2} [AP]M/);
    expect(result.endHour).toMatch(/\d{2}:\d{2} [AP]M/);
    expect(result.date).toContain('(the event is in the same timezone as you)');
  });

  it('returns correct formatting when user and event are in different timezones', () => {
    const result = formatEventDate(
      time,
      'USA',
      'New York',
      'America/New_York',
      'Europe/Bucharest'
    );

    expect(result.startHour).toMatch(/in USA, New York/);
    expect(result.endHour).toMatch(/in USA, New York/);
  });
});
