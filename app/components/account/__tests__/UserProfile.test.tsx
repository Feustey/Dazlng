import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserProfile } from "../UserProfile";
import { useSession } from "next-auth/react";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

describe("UserProfile", () => {
  const mockSession = {
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ data: mockSession });
  });

  it("affiche les informations de l'utilisateur", () => {
    render(<UserProfile />);

    expect(screen.getByLabelText("Nom complet")).toHaveValue("John Doe");
    expect(screen.getByLabelText("Email")).toHaveValue("john@example.com");
  });

  it("permet d'activer le mode édition", () => {
    render(<UserProfile />);

    const editButton = screen.getByText("Modifier");
    fireEvent.click(editButton);

    expect(screen.getByLabelText("Nom complet")).not.toBeDisabled();
    expect(screen.getByLabelText("Téléphone")).not.toBeDisabled();
    expect(screen.getByLabelText("Adresse")).not.toBeDisabled();
  });

  it("permet d'annuler les modifications", () => {
    render(<UserProfile />);

    // Activer l'édition
    fireEvent.click(screen.getByText("Modifier"));

    // Modifier un champ
    fireEvent.change(screen.getByLabelText("Nom complet"), {
      target: { value: "Jane Doe" },
    });

    // Annuler les modifications
    fireEvent.click(screen.getByText("Annuler"));

    // Vérifier que le mode édition est désactivé
    expect(screen.getByLabelText("Nom complet")).toBeDisabled();
    expect(screen.queryByText("Annuler")).not.toBeInTheDocument();
    expect(screen.getByText("Modifier")).toBeInTheDocument();
  });

  it("soumet le formulaire avec les nouvelles données", async () => {
    render(<UserProfile />);

    // Activer l'édition
    fireEvent.click(screen.getByText("Modifier"));

    // Modifier les champs
    fireEvent.change(screen.getByLabelText("Nom complet"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Téléphone"), {
      target: { value: "0123456789" },
    });
    fireEvent.change(screen.getByLabelText("Adresse"), {
      target: { value: "123 rue Example" },
    });

    // Soumettre le formulaire
    fireEvent.click(screen.getByText("Enregistrer"));

    await waitFor(() => {
      expect(screen.getByLabelText("Nom complet")).toBeDisabled();
    });
  });

  it("n'affiche rien si l'utilisateur n'est pas connecté", () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });

    const { container } = render(<UserProfile />);
    expect(container).toBeEmptyDOMElement();
  });
});
