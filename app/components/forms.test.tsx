import { render, fireEvent, waitFor } from "@testing-library/react";
import { ContactForm } from "@app/components/forms/ContactForm";
import { LoginForm } from "@app/components/forms/LoginForm";
import { PaymentForm } from "@app/components/forms/PaymentForm";

describe("Form Tests", () => {
  describe("ContactForm", () => {
    it("devrait valider et soumettre le formulaire de contact", async () => {
      const mockSubmit = jest.fn();
      const { getByLabelText, getByText } = render(
        <ContactForm onSubmit={mockSubmit} />
      );

      fireEvent.change(getByLabelText(/prénom/i), {
        target: { value: "John" },
      });
      fireEvent.change(getByLabelText(/nom/i), { target: { value: "Doe" } });
      fireEvent.change(getByLabelText(/email/i), {
        target: { value: "john@example.com" },
      });
      fireEvent.change(getByLabelText(/message/i), {
        target: { value: "Test message" },
      });

      fireEvent.click(getByText(/envoyer/i));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          message: "Test message",
        });
      });
    });
  });

  describe("LoginForm", () => {
    it("devrait valider et soumettre le formulaire de connexion", async () => {
      const mockSubmit = jest.fn();
      const { getByLabelText, getByText } = render(
        <LoginForm onSubmit={mockSubmit} />
      );

      fireEvent.change(getByLabelText(/email/i), {
        target: { value: "user@example.com" },
      });
      fireEvent.change(getByLabelText(/mot de passe/i), {
        target: { value: "password123" },
      });

      fireEvent.click(getByText(/se connecter/i));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          email: "user@example.com",
          password: "password123",
        });
      });
    });
  });

  describe("PaymentForm", () => {
    it("devrait valider et soumettre le formulaire de paiement", async () => {
      const mockSubmit = jest.fn();
      const { getByLabelText, getByText } = render(
        <PaymentForm onSubmit={mockSubmit} />
      );

      fireEvent.change(getByLabelText(/numéro de carte/i), {
        target: { value: "4242424242424242" },
      });
      fireEvent.change(getByLabelText(/date d'expiration/i), {
        target: { value: "12/25" },
      });
      fireEvent.change(getByLabelText(/cvv/i), { target: { value: "123" } });

      fireEvent.click(getByText(/payer/i));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          cardNumber: "4242424242424242",
          expiryDate: "12/25",
          cvv: "123",
        });
      });
    });
  });
});
