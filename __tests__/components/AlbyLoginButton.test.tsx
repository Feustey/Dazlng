import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AlbyLoginButton from "@/app/components/AlbyLoginButton";

// Mock de fetch
global.fetch = jest.fn();

describe("AlbyLoginButton", () => {
  // Réinitialiser les mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock de window.location
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
  });

  it("devrait afficher un état de chargement initial", () => {
    // Mock de fetch pour simuler un chargement
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Promesse qui ne se résout jamais
    );

    // Rendre le composant
    render(<AlbyLoginButton />);

    // Vérifier que l'état de chargement est affiché
    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("devrait être désactivé pendant le chargement", () => {
    // Mock de fetch pour simuler un chargement
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Promesse qui ne se résout jamais
    );

    // Rendre le composant
    render(<AlbyLoginButton />);

    // Vérifier que le bouton est désactivé
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("devrait être désactivé si le LNURL n'est pas disponible", async () => {
    // Mock de fetch pour simuler une réponse sans LNURL
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({}),
    });

    // Rendre le composant
    render(<AlbyLoginButton />);

    // Attendre que le chargement soit terminé
    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    // Vérifier que le bouton est désactivé
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("devrait rediriger vers Alby lors du clic", async () => {
    // Mock de fetch pour simuler une réponse avec LNURL
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ lnurl: "test_lnurl" }),
    });

    // Rendre le composant
    render(<AlbyLoginButton />);

    // Attendre que le chargement soit terminé
    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    // Cliquer sur le bouton
    fireEvent.click(screen.getByRole("button"));

    // Vérifier que window.location.href a été mis à jour
    expect(window.location.href).toBe("lightning:test_lnurl");
  });

  it("devrait appeler la fonction onClick si fournie", async () => {
    // Mock de fetch pour simuler une réponse avec LNURL
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ lnurl: "test_lnurl" }),
    });

    // Mock de la fonction onClick
    const onClickMock = jest.fn();

    // Rendre le composant avec la fonction onClick
    render(<AlbyLoginButton onClick={onClickMock} />);

    // Attendre que le chargement soit terminé
    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    // Cliquer sur le bouton
    fireEvent.click(screen.getByRole("button"));

    // Vérifier que la fonction onClick a été appelée
    expect(onClickMock).toHaveBeenCalled();

    // Vérifier que window.location.href n'a pas été mis à jour
    expect(window.location.href).toBe("");
  });

  it("devrait gérer les erreurs de fetch", async () => {
    // Mock de fetch pour simuler une erreur
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Erreur de fetch"));

    // Mock de console.error
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    // Rendre le composant
    render(<AlbyLoginButton />);

    // Attendre que le chargement soit terminé
    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    // Vérifier que l'erreur a été loguée
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Erreur lors de la génération du LNURL:",
      expect.any(Error)
    );

    // Restaurer console.error
    consoleErrorSpy.mockRestore();
  });
});
