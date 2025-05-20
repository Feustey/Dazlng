import { render, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { OrderSummary, type OrderData } from '@/app/components/checkout/Summary';
import '@testing-library/jest-dom';

describe('OrderSummary', () => {
  const mockData: OrderData = {
    fullName: 'John Doe',
    email: 'john@example.com'
  };

  let component: RenderResult;

  beforeEach(() => {
    component = render(<OrderSummary data={mockData} />);
  });

  it('renders product details correctly', () => {
    expect(screen.getByText('Dazbox')).toBeInTheDocument();
    expect(screen.getByText('Prix unitaire : 399 €')).toBeInTheDocument();
    expect(screen.getByText('Quantité : 1')).toBeInTheDocument();
    expect(screen.getByText('Total : 399 €')).toBeInTheDocument();
  });

  it('shows customer details when provided', () => {
    (Object.values(mockData) as string[]).forEach((value: string) => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it('calculates total correctly', () => {
    const total = screen.getByText('399 €');
    expect(total).toBeInTheDocument();
  });
}); 