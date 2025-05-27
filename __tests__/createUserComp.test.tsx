import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import axios from 'axios';
import CreateUserComp from '../components/createUserComp.tsx/createUserComp';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('axios');
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  getCsrfToken: jest.fn(() => Promise.resolve('mock-csrf-token')),
  useSession: jest.fn(() => ({
    data: {
      user: { name: 'Test User' },
      token: { id: 'user123' }
    }
  }))
}));

jest.mock('../library/converters/getTimeZone', () => jest.fn(() => Promise.resolve('Europe/Bucharest')));
jest.mock('../library/map/getLocation', () => jest.fn(() => Promise.resolve({ country: 'Romania', city: 'Bucharest' })));
jest.mock('../components/testFolder/tagsSelector', () => (
  ({
    selectedTags,
    tags,
    onChange,
    maxSelection,
  }: {
    selectedTags: string[];
    tags: string[];
    onChange: (tags: string[]) => void;
    maxSelection: number;
  }) => (
    <div data-testid="tag-selector">
      {tags.map(tag => (
        <button
          key={tag}
          data-testid={`tag-${tag}`}
          onClick={() => {
            const newTags = selectedTags.includes(tag) 
              ? selectedTags.filter(t => t !== tag)
              : selectedTags.length < maxSelection ? [...selectedTags, tag] : selectedTags;
            onChange(newTags);
          }}
          className={selectedTags.includes(tag) ? 'selected' : ''}
        >
          {tag}
        </button>
      ))}
    </div>
  )
));

jest.mock('../components/event/Map', () => ({ lat, lng, shouldRender, settings }) => (
  shouldRender ? (
    <div data-testid="map-component">
      <button 
        data-testid="map-click"
        onClick={() => settings.passData('Bucharest', 'Romania', '44.4268', '26.1025')}
      >
        Click Map Location
      </button>
    </div>
  ) : null
));

const mockedAxios = axios as jest.Mocked<typeof axios>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={null}>
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
};

describe('CreateUserComp Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [{
          components: { country: 'Romania', city: 'Bucharest' },
          geometry: { lat: 44.4268, lng: 26.1025 }
        }]
      }
    });
  });
  test('1. Form validation errors for required fields', async () => {
    const user = userEvent.setup();
    
    render(<CreateUserComp />, { wrapper: createWrapper() });

    // Try to submit form without filling required fields
    const submitButton = screen.getByRole('button', { name: /create event/i });
    await user.click(submitButton);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Title must be at least 2 characters./i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Description must be at least 10 characters./i)).toBeInTheDocument();
    expect(screen.getByText(/A date is required./i)).toBeInTheDocument();
  });

  test('2. Country and city validation with API calls', async () => {
    const user = userEvent.setup();
    
    // Mock API response for invalid country
    mockedAxios.get.mockRejectedValueOnce(new Error('Not found'));

    render(<CreateUserComp />, { wrapper: createWrapper() });

    // Test invalid country
    const countryInput = screen.getByLabelText(/country/i);
    await user.type(countryInput, 'InvalidCountry');

    await waitFor(() => {
      expect(screen.getByText(/this country does not exist/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Test valid country
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        results: [{
          components: { country: 'Romania' },
          geometry: { lat: 44.4268, lng: 26.1025 }
        }]
      }
    });

    await user.clear(countryInput);
    await user.type(countryInput, 'Romania');

    await waitFor(() => {
      expect(screen.queryByText(/this country does not exist/i)).not.toBeInTheDocument();
    });

    // City field should appear after valid country
    await waitFor(() => {
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    });
  });

  test('3. Map interaction and location update workflow', async () => {
    const user = userEvent.setup();
    
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [{
          components: { country: 'Romania', city: 'Bucharest' },
          geometry: { lat: 44.4268, lng: 26.1025 }
        }]
      }
    });

    render(<CreateUserComp />, { wrapper: createWrapper() });

    // Fill country to make city field appear
    const countryInput = screen.getByLabelText(/country/i);
    await user.type(countryInput, 'Romania');

    await waitFor(() => {
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    });

    // Fill city to make map appear
    const cityInput = screen.getByLabelText(/city/i);
    await user.type(cityInput, 'Bucharest');

    await waitFor(() => {
      expect(screen.getByTestId('map-component')).toBeInTheDocument();
    });

    // Verify map instruction text
    expect(screen.getByText(/click on the meetup location on the map/i)).toBeInTheDocument();

    // Click on map to update location
    const mapClickButton = screen.getByTestId('map-click');
    await user.click(mapClickButton);

    // Verify that clicking the map updates the form values
    // The map component should call updateUIonClick which updates the form
    await waitFor(() => {
      expect(cityInput).toHaveValue('Bucharest');
      expect(countryInput).toHaveValue('Romania');
    });
  });

});