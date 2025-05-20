import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { PaymentForm } from '@/app/components/checkout/Payment';

describe('PaymentForm', () => {
  const mockOnBack = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOrderData = {
    fullName: 'John Doe',
    email: 'john@example.com'
  };

  let component: RenderResult;

  beforeEach(() => {
    mockOnBack.mockClear();
    mockOnSuccess.mockClear();
    component = render(
      <PaymentForm 
        orderData={mockOrderData}
        onBack={mockOnBack}
        onSuccess={mockOnSuccess}
      />
    );
  });

  it('renders payment form correctly', () => {
    const elements = ['Paiement sécurisé', 'Payer 399 €', 'Retour'];
    elements.forEach((text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('handles back button click', () => {
    fireEvent.click(screen.getByText('Retour'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('shows loading state during payment', async () => {
    const payButton = screen.getByText('Payer 399 €');
    fireEvent.click(payButton);

    expect(screen.getByText('Paiement en cours...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /paiement/i })).toBeDisabled();

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    }, { timeout: 1500 });
  });
}); 