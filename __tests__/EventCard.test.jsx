// __tests__/AuthForm.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import axios from 'axios';
import { AuthForm } from '../components/auth/Auth';
import { loginUtil } from '../library/authUtils/loginUtil';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('axios');
jest.mock('../library/authUtils/loginUtil');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../library/schemas/auth', () => {
  const { z } = require('zod');
  return jest.fn((mode) => {
    const baseSchema = {
      email: z.string().email({ message: "Please enter a valid email address" }),
      password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    };
    
    if (mode === 'signUp') {
      return z.object({
        ...baseSchema,
        username: z.string().min(3, { message: "Username must be at least 3 characters" }),
      });
    }
    
    return z.object(baseSchema);
  });
});

jest.mock('./../../photos/image.png', () => ({
  src: '/mock-image.png'
}));

// Mock window.location

const mockedAxios = axios;
const mockedLoginUtil = loginUtil;

describe('AuthForm Component - Login Mode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';
  });

  test('renders login form correctly', () => {
    render(<AuthForm mode="login" />);
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Login to your Acme Inc account')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument();
  });

  test('displays sign up link in login mode', () => {
    render(<AuthForm mode="login" />);
    
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/auth/signup');
  });

  test('validates email format', async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  test('validates password length', async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await user.clear(passwordInput);
    await user.type(passwordInput, '123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  test('handles successful login', async () => {
    const user = userEvent.setup();
    mockedLoginUtil.mockResolvedValue({ message: 'Login successful' });
    
    render(<AuthForm mode="login" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await user.clear(emailInput);
    await user.type(emailInput, 'test@example.com');
    await user.clear(passwordInput);
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockedLoginUtil).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(window.location.href).toBe('/');
    });
  });

  test('handles failed login', async () => {
    const user = userEvent.setup();
    mockedLoginUtil.mockResolvedValue({ message: 'Invalid credentials' });

    render(<AuthForm mode="login" />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Caută primul buton din DOM, indiferent de text
    const submitButton = screen.getByRole('button');

    await user.clear(emailInput);
    await user.type(emailInput, 'test@example.com');
    await user.clear(passwordInput);
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Try to login again!')).toBeInTheDocument();
    });
  });

});

// describe('AuthForm Component - Sign Up Mode', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     window.location.href = '';
//   });

//   test('renders signup form correctly', () => {
//     render(<AuthForm mode="signUp" />);
    
//     expect(screen.getByText('Welcome back')).toBeInTheDocument();
//     expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
//   });

//   test('displays login link in signup mode', () => {
//     render(<AuthForm mode="signUp" />);
    
//     expect(screen.getByText('Already have an account?')).toBeInTheDocument();
//     expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/auth/login');
//   });

//   test('handles successful signup and auto-login', async () => {
//     const user = userEvent.setup();
    
//     mockedAxios.post.mockResolvedValue({
//       data: { success: true, userId: 123 }
//     });
//     mockedLoginUtil.mockResolvedValue({ message: 'Login successful' });
    
//     render(<AuthForm mode="signUp" />);
    
//     const usernameInput = screen.getByLabelText(/username/i);
//     const emailInput = screen.getByLabelText(/email/i);
//     const passwordInput = screen.getByLabelText(/password/i);
//     const submitButton = screen.getByRole('button', { name: /sign up/i });
    
//     await user.clear(usernameInput);
//     await user.type(usernameInput, 'testuser');
//     await user.clear(emailInput);
//     await user.type(emailInput, 'test@example.com');
//     await user.clear(passwordInput);
//     await user.type(passwordInput, 'password123');
//     await user.click(submitButton);
    
//     await waitFor(() => {
//       expect(mockedAxios.post).toHaveBeenCalledWith(
//         'http://localhost:3000/api/createUserCS',
//         {
//           username: 'testuser',
//           email: 'test@example.com',
//           password: 'password123'
//         }
//       );
//       expect(mockedLoginUtil).toHaveBeenCalledWith('test@example.com', 'password123');
//       expect(window.location.href).toBe('/tags');
//     });
//   });

//   test('handles signup error from API', async () => {
//     const user = userEvent.setup();
    
//     mockedAxios.post.mockResolvedValue({
//       data: { error: 'User already exists' }
//     });
    
//     render(<AuthForm mode="signUp" />);
    
//     const usernameInput = screen.getByLabelText(/username/i);
//     const emailInput = screen.getByLabelText(/email/i);
//     const passwordInput = screen.getByLabelText(/password/i);
//     const submitButton = screen.getByRole('button', { name: /sign up/i });
    
//     await user.clear(usernameInput);
//     await user.type(usernameInput, 'existinguser');
//     await user.clear(emailInput);
//     await user.type(emailInput, 'existing@example.com');
//     await user.clear(passwordInput);
//     await user.type(passwordInput, 'password123');
//     await user.click(submitButton);
    
//     await waitFor(() => {
//       expect(screen.getByText('User already exists')).toBeInTheDocument();
//     });
//   });

//   test('handles network error during signup', async () => {
//     const user = userEvent.setup();
    
//     mockedAxios.post.mockRejectedValue({
//       response: { data: { message: 'Network error' } }
//     });
    
//     render(<AuthForm mode="signUp" />);
    
//     const usernameInput = screen.getByLabelText(/username/i);
//     const emailInput = screen.getByLabelText(/email/i);
//     const passwordInput = screen.getByLabelText(/password/i);
//     const submitButton = screen.getByRole('button', { name: /sign up/i });
    
//     await user.clear(usernameInput);
//     await user.type(usernameInput, 'testuser');
//     await user.clear(emailInput);
//     await user.type(emailInput, 'test@example.com');
//     await user.clear(passwordInput);
//     await user.type(passwordInput, 'password123');
//     await user.click(submitButton);
    
//     await waitFor(() => {
//       expect(screen.getByText('Network error')).toBeInTheDocument();
//     });
//   });
// });

// describe('AuthForm Component - UI Elements', () => {
//   test('renders Google login button', () => {
//     render(<AuthForm mode="login" />);
    
//     const googleButton = screen.getByRole('button', { name: /login with google/i });
//     expect(googleButton).toBeInTheDocument();
//     expect(googleButton).toHaveAttribute('type', 'button');
//   });

//   test('renders forgot password link', () => {
//     render(<AuthForm mode="login" />);
    
//     expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
//     expect(screen.getByRole('link', { name: /forgot your password/i })).toHaveAttribute('href', '#');
//   });

//   test('renders terms and privacy links', () => {
//     render(<AuthForm mode="login" />);
    
//     expect(screen.getByText(/By clicking continue, you agree to our/)).toBeInTheDocument();
//     expect(screen.getByRole('link', { name: /terms of service/i })).toHaveAttribute('href', '#');
//     expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '#');
//   });

//   test('renders background image', () => {
//     render(<AuthForm mode="login" />);
    
//     const image = screen.getByRole('img', { name: /image/i });
//     expect(image).toBeInTheDocument();
//     expect(image).toHaveAttribute('src', '/mock-image.png');
//   });

//   test('applies correct CSS classes', () => {
//     render(<AuthForm mode="login" className="custom-class" />);
    
//     const container = screen.getByRole('main') || document.querySelector('.custom-class') || 
//                      document.querySelector('[class*="flex flex-col gap-6"]');
    
//     expect(container).toBeInTheDocument();
//   });
// });

// describe('AuthForm Component - Error Handling', () => {
//   test('clears feedback message when form is resubmitted', async () => {
//     const user = userEvent.setup();
    
//     // First, simulate a failed login
//     mockedLoginUtil.mockResolvedValueOnce({ message: 'Invalid credentials' });
    
//     render(<AuthForm mode="login" />);
    
//     const emailInput = screen.getByLabelText(/email/i);
//     const passwordInput = screen.getByLabelText(/password/i);
//     const submitButton = screen.getByRole('button', { name: /login/i });
    
//     await user.clear(emailInput);
//     await user.type(emailInput, 'test@example.com');
//     await user.clear(passwordInput);
//     await user.type(passwordInput, 'wrongpassword');
//     await user.click(submitButton);
    
//     await waitFor(() => {
//       expect(screen.getByText('Something went wrong. Try to login again!')).toBeInTheDocument();
//     });
    
//     // Now simulate a successful login
//     mockedLoginUtil.mockResolvedValueOnce({ message: 'Login successful' });
    
//     await user.clear(passwordInput);
//     await user.type(passwordInput, 'correctpassword');
//     await user.click(submitButton);
    
//     await waitFor(() => {
//       expect(window.location.href).toBe('/');
//     });
//   });

//   test('handles login utility throwing an error', async () => {
//     const user = userEvent.setup();
    
//     mockedLoginUtil.mockRejectedValue(new Error('Network failure'));
    
//     render(<AuthForm mode="login" />);
    
//     const emailInput = screen.getByLabelText(/email/i);
//     const passwordInput = screen.getByLabelText(/password/i);
//     const submitButton = screen.getByRole('button', { name: /login/i });
    
//     await user.clear(emailInput);
//     await user.type(emailInput, 'test@example.com');
//     await user.clear(passwordInput);
//     await user.type(passwordInput, 'password123');
//     await user.click(submitButton);
    
//     await waitFor(() => {
//       expect(screen.getByText('Something went wrong. Try to login again!')).toBeInTheDocument();
//     });
//   });

//   test('handles signup success but login failure', async () => {
//     const user = userEvent.setup();
    
//     mockedAxios.post.mockResolvedValue({
//       data: { success: true, userId: 123 }
//     });
//     mockedLoginUtil.mockResolvedValue({ message: 'Login failed' });
    
//     render(<AuthForm mode="signUp" />);
    
//     const usernameInput = screen.getByLabelText(/username/i);
//     const emailInput = screen.getByLabelText(/email/i);
//     const passwordInput = screen.getByLabelText(/password/i);
//     const submitButton = screen.getByRole('button', { name: /sign up/i });
    
//     await user.clear(usernameInput);
//     await user.type(usernameInput, 'testuser');
//     await user.clear(emailInput);
//     await user.type(emailInput, 'test@example.com');
//     await user.clear(passwordInput);
//     await user.type(passwordInput, 'password123');
//     await user.click(submitButton);
    
//     await waitFor(() => {
//       expect(screen.getByText('Something went wrong. Try to again!')).toBeInTheDocument();
//     });
//   });
// });

// describe('AuthForm Component - Integration Tests', () => {
//   test('complete login flow with form validation', async () => {
//     const user = userEvent.setup();
//     mockedLoginUtil.mockResolvedValue({ message: 'Login successful' });
    
//     render(<AuthForm mode="login" />);
    
//     // Test form validation first
//     const submitButton = screen.getByRole('button', { name: /login/i });
//     await user.click(submitButton);
    
//     await waitFor(() => {
//       expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
//       expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
//     });
    
//     // Fill form with valid data
//     const emailInput = screen.getByLabelText(/email/i);
//     const passwordInput = screen.getByLabelText(/password/i);
    
//     await user.clear(emailInput);
//     await user.type(emailInput, 'valid@example.com');
//     await user.clear(passwordInput);
//     await user.type(passwordInput, 'validpassword');
    
//     // Submit again
//     await user.click(submitButton);
    
//     await waitFor(() => {
//       expect(mockedLoginUtil).toHaveBeenCalledWith('valid@example.com', 'validpassword');
//       expect(window.location.href).toBe('/');
//     });
//   });

//   test('complete signup flow with all validations', async () => {
//     const user = userEvent.setup();
    
//     mockedAxios.post.mockResolvedValue({
//       data: { success: true, userId: 123 }
//     });
//     mockedLoginUtil.mockResolvedValue({ message: 'Login successful' });
    
//     render(<AuthForm mode="signUp" />);
    
//     // Test empty form submission
//     const submitButton = screen.getByRole('button', { name: /sign up/i });
//     await user.click(submitButton);
    
//     await waitFor(() => {
//       expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
//       expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
//     });
    
//     // Fill all fields
//     const usernameInput = screen.getByLabelText(/username/i);
//     const emailInput = screen.getByLabelText(/email/i);
//     const passwordInput = screen.getByLabelText(/password/i);
    
//     await user.type(usernameInput, 'newuser');
//     await user.clear(emailInput);
//     await user.type(emailInput, 'newuser@example.com');
//     await user.clear(passwordInput);
//     await user.type(passwordInput, 'newpassword123');
    
//     await user.click(submitButton);
    
//     await waitFor(() => {
//       expect(mockedAxios.post).toHaveBeenCalledWith(
//         'http://localhost:3000/api/createUserCS',
//         {
//           username: 'newuser',
//           email: 'newuser@example.com',
//           password: 'newpassword123'
//         }
//       );
//       expect(mockedLoginUtil).toHaveBeenCalledWith('newuser@example.com', 'newpassword123');
//       expect(window.location.href).toBe('/tags');
//     });
//   });

//   test('form switching between modes maintains state correctly', () => {
//     const { rerender } = render(<AuthForm mode="login" />);
    
//     expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
//     expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument();
    
//     rerender(<AuthForm mode="signUp" />);
    
//     expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
//     expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
//   });

//   test('handles rapid form submissions gracefully', async () => {
//     const user = userEvent.setup();
//     mockedLoginUtil.mockImplementation(() => new Promise(resolve => 
//       setTimeout(() => resolve({ message: 'Login successful' }), 100)
//     ));
    
//     render(<AuthForm mode="login" />);
    
//     const emailInput = screen.getByLabelText(/email/i);
//     const passwordInput = screen.getByLabelText(/password/i);
//     const submitButton = screen.getByRole('button', { name: /login/i });
    
//     await user.clear(emailInput);
//     await user.type(emailInput, 'test@example.com');
//     await user.clear(passwordInput);
//     await user.type(passwordInput, 'password123');
    
//     // Submit multiple times rapidly
//     await user.click(submitButton);
//     await user.click(submitButton);
//     await user.click(submitButton);
    
//     await waitFor(() => {
//       expect(window.location.href).toBe('/');
//     }, { timeout: 2000 });
    
//     expect(mockedLoginUtil).toHaveBeenCalledTimes(3);
//   });
// });