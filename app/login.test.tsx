import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { storage } from '../src/utils/storage';
import LoginScreen from './login';



jest.mock('../src/utils/storage', () => ({
  storage: {
    setUser: jest.fn(),
    setAuth: jest.fn(),
  },
}));

describe('LoginScreen', () => {
  it('should handle login form submission', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('votre@email.com');
    const passwordInput = getByPlaceholderText('Votre mot de passe');
    const loginButton = getByText('Se connecter');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(storage.setUser).toHaveBeenCalled();
      expect(storage.setAuth).toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalledWith('/');
    });
  });
}); 