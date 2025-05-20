import { render, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { CheckoutProgress, type Step } from '@/app/components/checkout/Progress';

describe('CheckoutProgress', () => {
  const mockSteps: Step[] = [
    { id: 1, name: 'Informations' },
    { id: 2, name: 'Paiement' },
    { id: 3, name: 'Confirmation' }
  ];

  let component: RenderResult;

  beforeEach(() => {
    component = render(<CheckoutProgress steps={mockSteps} currentStep={1} />);
  });

  it('renders all steps', () => {
    mockSteps.forEach((step: Step) => {
      expect(screen.getByText(step.id.toString())).toBeInTheDocument();
    });
  });

  it('highlights current step correctly', () => {
    const currentStep = screen.getByText('1').closest('div');
    expect(currentStep).toHaveClass('bg-primary-600');
  });

  it('shows completed steps differently', () => {
    component.rerender(<CheckoutProgress steps={mockSteps} currentStep={3} />);
    const firstStep = screen.getByText('1').closest('div');
    expect(firstStep).toHaveClass('bg-gray-200');
  });
}); 