import saveTimezone from './saveTimezone';
import axios from 'axios';
import getTimeZone from '../converters/getTimeZone';

jest.mock('axios');
jest.mock('../converters/getTimeZone');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetTimeZone = getTimeZone as jest.MockedFunction<typeof getTimeZone>;

describe('saveTimezone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns location and timezone data correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        country_name: 'Romania',
        city_name: 'Bucharest',
        latitude: 44.4268,
        longitude: 26.1025,
      },
    });

    mockedGetTimeZone.mockResolvedValueOnce('Europe/Bucharest');

    const result = await saveTimezone();

    expect(result).toEqual({
      country: 'Romania',
      city: 'Bucharest',
      timezone: 'Europe/Bucharest',
      latitude: 44.4268,
      longitude: 26.1025,
    });
  });

  it('logs error if axios fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAxios.get.mockRejectedValueOnce(new Error('API failed'));

    const result = await saveTimezone();

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching location data:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('calls getTimeZone with correct coordinates', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        country_name: 'France',
        city_name: 'Paris',
        latitude: 48.8566,
        longitude: 2.3522,
      },
    });

    mockedGetTimeZone.mockResolvedValueOnce('Europe/Paris');

    await saveTimezone();

    expect(getTimeZone).toHaveBeenCalledWith(48.8566, 2.3522);
  });
});
