import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsForm } from "../SettingsForm";

describe("SettingsForm", () => {
  it("affiche les paramètres par défaut", () => {
    render(<SettingsForm />);

    expect(screen.getByLabelText("Notifications par email")).toBeChecked();
    expect(screen.getByLabelText("Notifications SMS")).not.toBeChecked();
    expect(screen.getByLabelText("Mode sombre")).not.toBeChecked();
  });

  it("permet de modifier les paramètres de notification", () => {
    render(<SettingsForm />);

    const emailSwitch = screen.getByLabelText("Notifications par email");
    const smsSwitch = screen.getByLabelText("Notifications SMS");

    fireEvent.click(emailSwitch);
    fireEvent.click(smsSwitch);

    expect(emailSwitch).not.toBeChecked();
    expect(smsSwitch).toBeChecked();
  });

  it("permet d'activer le mode sombre", () => {
    render(<SettingsForm />);

    const darkModeSwitch = screen.getByLabelText("Mode sombre");
    fireEvent.click(darkModeSwitch);

    expect(darkModeSwitch).toBeChecked();
  });

  it("soumet le formulaire avec les nouveaux paramètres", () => {
    const handleSubmit = jest.fn();
    render(<SettingsForm />);

    // Modifier les paramètres
    fireEvent.click(screen.getByLabelText("Notifications SMS"));
    fireEvent.click(screen.getByLabelText("Mode sombre"));

    // Soumettre le formulaire
    fireEvent.click(screen.getByText("Enregistrer les modifications"));

    // Vérifier que les nouveaux paramètres sont appliqués
    expect(screen.getByLabelText("Notifications SMS")).toBeChecked();
    expect(screen.getByLabelText("Mode sombre")).toBeChecked();
  });

  it("affiche les descriptions des paramètres", () => {
    render(<SettingsForm />);

    expect(
      screen.getByText("Recevoir des mises à jour par email")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Recevoir des notifications sur votre téléphone")
    ).toBeInTheDocument();
    expect(screen.getByText("Activer le thème sombre")).toBeInTheDocument();
  });
});
