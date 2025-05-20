import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { UserInfoForm, type UserInfo } from '@/app/components/checkout/UserInfo';

describe('UserInfoForm', () => {
  const mockOnSubmit = jest.fn();
  let component: RenderResult;

  const testData: UserInfo = {
    fullName: 'John Doe',
    email: 'john@example.com',
    address: '123 Street',
    city: 'Paris',
    postalCode: '75000',
    country: 'France',
    phone: '0123456789'
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
    component = render(<UserInfoForm onSubmit={mockOnSubmit} />);
  });

  it('renders all required fields', () => {
    const requiredFields = ['Nom complet*', 'Email*', 'Adresse*', 'Ville*', 'Code postal*', 'Pays*'];
    requiredFields.forEach((field: string) => {
      expect(screen.getByPlaceholderText(field)).toBeInTheDocument();
    });
  });

  it('shows error when submitting empty form', async () => {
    fireEvent.click(screen.getByText('Procéder au paiement'));
    
    await waitFor(() => {
      expect(screen.getByText('Merci de remplir tous les champs obligatoires.')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const placeholders = [
      'Nom complet*',
      'Email*',
      'Adresse*',
      'Ville*',
      'Code postal*',
      'Pays*',
      'Téléphone',
    ];
    const values = [
      testData.fullName,
      testData.email,
      testData.address,
      testData.city,
      testData.postalCode,
      testData.country,
      testData.phone,
    ];
    placeholders.forEach((ph, idx) => {
      const input = screen.getByPlaceholderText(ph);
      fireEvent.change(input, { target: { value: values[idx] } });
    });

    fireEvent.click(screen.getByText('Procéder au paiement'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(testData);
    });
  });

  it('validates email format', async () => {
    const emailInput = screen.getByPlaceholderText('Email*');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByText('Procéder au paiement'));

    await waitFor(() => {
      expect(screen.getByText('Email invalide')).toBeInTheDocument();
    });
  });
}); 