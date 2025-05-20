import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import CheckoutPage from '@/app/checkout/page';
import type { UserInfo } from '@/app/components/checkout/UserInfo';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('CheckoutPage', () => {
  let component: RenderResult;
  const testData: UserInfo = {
    fullName: 'John Doe',
    email: 'john@example.com',
    address: '123 Street',
    city: 'Paris',
    postalCode: '75000',
    country: 'France'
  };

  beforeEach(() => {
    component = render(<CheckoutPage />);
  });

  const fillUserInfoForm = (): void => {
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
      '0123456789',
    ];
    placeholders.forEach((ph, idx) => {
      const input = screen.getByPlaceholderText(ph);
      fireEvent.change(input, { target: { value: values[idx] } });
    });
  };

  it('renders initial step correctly', () => {
    expect(screen.getByText('Informations')).toBeInTheDocument();
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('progresses through checkout steps', async () => {
    fillUserInfoForm();
    fireEvent.click(screen.getByText('Procéder au paiement'));

    await waitFor(() => {
      expect(screen.getByText('Paiement sécurisé')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Payer 399 €'));

    await waitFor(() => {
      expect(screen.getByText('Commande Confirmée !')).toBeInTheDocument();
    });
  });

  it('handles back navigation correctly', async () => {
    fillUserInfoForm();
    fireEvent.click(screen.getByText('Procéder au paiement'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Retour'));
    });

    expect(screen.getByPlaceholderText('Nom complet*')).toBeInTheDocument();
  });
}); 