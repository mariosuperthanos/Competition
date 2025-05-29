import axios from 'axios';
import getTimeZone from './getTimeZone';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getTimeZone', () => {
  it('returns timezone name when request succeeds', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            annotations: {
              timezone: {
                name: 'Europe/Bucharest',
              },
            },
          },
        ],
      },
    });

    const tz = await getTimeZone(44.43, 26.10); // București
    expect(tz).toBe('Europe/Bucharest');
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it('logs error when request fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    const tz = await getTimeZone(0, 0);
    expect(tz).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
