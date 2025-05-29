import axios from 'axios';
import getLocation from './getLocation';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getLocation', () => {
  it('should return correct city and country when county is available', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [
          {
            components: {
              county: 'Cluj',
              country: 'Romania'
            }
          }
        ]
      }
    });

    const result = await getLocation(46.77, 23.59);
    expect(result).toEqual({ city: 'Cluj', country: 'Romania' });
  });

  it('should fallback to city when county is missing', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [
          {
            components: {
              city: 'Bucharest',
              country: 'Romania'
            }
          }
        ]
      }
    });

    const result = await getLocation(44.43, 26.10);
    expect(result).toEqual({ city: 'Bucharest', country: 'Romania' });
  });

  it('should return "Unknown" city if no known location fields are present', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [
          {
            components: {
              country: 'Unknownland'
            }
          }
        ]
      }
    });

    const result = await getLocation(0, 0);
    expect(result).toEqual({ city: 'Unknown', country: 'Unknownland' });
  });
});
