import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from './login';

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

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
      expect(require('../src/utils/storage').storage.setUser).toHaveBeenCalled();
      expect(require('../src/utils/storage').storage.setAuth).toHaveBeenCalled();
      expect(require('expo-router').router.replace).toHaveBeenCalledWith('/');
    });
  });
}); 