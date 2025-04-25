import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ui/use-toast";

// Mock des hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}));

// Mock de fetch
global.fetch = jest.fn();

// Composant de test pour accéder au contexte
function TestComponent() {
  const { loginWithAlby, isLoading } = useAuth();

  return (
    <div>
      <button onClick={() => loginWithAlby()}>Se connecter avec Alby</button>
      <div data-testid="loading-state">
        {isLoading ? "Chargement..." : "Non chargé"}
      </div>
    </div>
  );
}

describe("AuthContext - Alby", () => {
  // Réinitialiser les mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock des variables d'environnement
    process.env.NEXT_PUBLIC_ALBY_PUBLIC_KEY = "test_public_key";

    // Mock de useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    // Mock de useToast
    (useToast as jest.Mock).mockReturnValue({
      addToast: jest.fn(),
    });

    // Mock de window.location
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
  });

  it("devrait rediriger vers Alby lors de la connexion", async () => {
    // Rendre le composant avec le provider
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Cliquer sur le bouton de connexion
    fireEvent.click(screen.getByText("Se connecter avec Alby"));

    // Vérifier que window.location.href a été mis à jour
    expect(window.location.href).toContain("lightning:test_public_key");
    expect(window.location.href).toContain("action=signMessage");
    expect(window.location.href).toContain("message=Connexion à Daznode");
  });

  it("devrait gérer les erreurs lors de la connexion", async () => {
    // Mock de window.location pour simuler une erreur
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
      configurable: true,
    });

    // Rendre le composant avec le provider
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simuler une erreur lors de la redirection
    const mockAddToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({
      addToast: mockAddToast,
    });

    // Cliquer sur le bouton de connexion
    fireEvent.click(screen.getByText("Se connecter avec Alby"));

    // Vérifier que le toast d'erreur a été affiché
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        title: "Erreur de connexion",
        description: expect.any(String),
        type: "error",
      });
    });
  });

  it("devrait afficher l'état de chargement pendant la connexion", async () => {
    // Rendre le composant avec le provider
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Vérifier l'état initial
    expect(screen.getByTestId("loading-state")).toHaveTextContent("Non chargé");

    // Cliquer sur le bouton de connexion
    fireEvent.click(screen.getByText("Se connecter avec Alby"));

    // Vérifier que l'état de chargement est affiché
    expect(screen.getByTestId("loading-state")).toHaveTextContent(
      "Chargement..."
    );
  });
});
