import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserProfile } from "../UserProfile";
import { SettingsForm } from "../SettingsForm";
import { OrdersList } from "../OrdersList";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

// Mock des hooks
jest.mock("next-auth/react");
jest.mock("@/hooks/use-toast");
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    data: jest.fn().mockResolvedValue({ data: null, error: null }),
  },
}));

describe("UserProfile", () => {
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+33612345678",
    company: "Test Company",
    settings: {
      notifications: true,
      language: "fr",
    },
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: mockUser },
      status: "authenticated",
    });
    (useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    });
  });

  it("affiche les informations de l'utilisateur", () => {
    render(<UserProfile />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("+33612345678")).toBeInTheDocument();
    expect(screen.getByText("Test Company")).toBeInTheDocument();
  });

  it("permet l'édition des informations", async () => {
    render(<UserProfile />);
    const editButton = screen.getByRole("button", { name: /modifier/i });
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText(/nom/i);
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const saveButton = screen.getByRole("button", { name: /enregistrer/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  });

  it("valide les champs requis", async () => {
    render(<UserProfile />);
    const editButton = screen.getByRole("button", { name: /modifier/i });
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText(/nom/i);
    fireEvent.change(nameInput, { target: { value: "" } });

    const saveButton = screen.getByRole("button", { name: /enregistrer/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/le nom est requis/i)).toBeInTheDocument();
    });
  });
});

describe("SettingsForm", () => {
  const mockUser = {
    id: "1",
    settings: {
      notifications: true,
      language: "fr",
    },
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: mockUser },
      status: "authenticated",
    });
    (useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    });
  });

  it("affiche les paramètres actuels", () => {
    render(<SettingsForm />);
    expect(screen.getByLabelText(/notifications/i)).toBeChecked();
    expect(screen.getByLabelText(/langue/i)).toHaveValue("fr");
  });

  it("permet de modifier les paramètres", async () => {
    render(<SettingsForm />);
    const notificationsToggle = screen.getByLabelText(/notifications/i);
    fireEvent.click(notificationsToggle);

    const saveButton = screen.getByRole("button", { name: /enregistrer/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith({
        title: "Paramètres mis à jour",
        description: "Vos préférences ont été enregistrées avec succès.",
      });
    });
  });
});

describe("OrdersList", () => {
  const mockOrders = [
    {
      id: "1",
      product_type: "dazenode",
      plan: "pro",
      billing_cycle: "monthly",
      amount: 1000,
      payment_status: "paid",
      metadata: {
        node_type: "raspberry_pi",
        features: ["vpn", "backup"],
      },
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      product_type: "daz-ia",
      plan: "basic",
      billing_cycle: "yearly",
      amount: 500,
      payment_status: "pending",
      metadata: {
        subscription_id: "sub_123",
      },
      created_at: "2024-01-02T00:00:00Z",
    },
  ];

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: "1" } },
      status: "authenticated",
    });
    (useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    });
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: mockOrders, error: null }),
      }),
    });
  });

  it("affiche la liste des commandes", async () => {
    render(<OrdersList />);
    await waitFor(() => {
      expect(screen.getByText("Dazenode Pro")).toBeInTheDocument();
      expect(screen.getByText("Daz-IA Basic")).toBeInTheDocument();
    });
  });

  it("filtre les commandes par type de produit", async () => {
    render(<OrdersList />);
    const filterButton = screen.getByRole("button", { name: /dazenode/i });
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByText("Dazenode Pro")).toBeInTheDocument();
      expect(screen.queryByText("Daz-IA Basic")).not.toBeInTheDocument();
    });
  });

  it("affiche les détails d'une commande", async () => {
    render(<OrdersList />);
    const viewButton = screen.getByRole("button", {
      name: /voir les détails/i,
    });
    fireEvent.click(viewButton);

    await waitFor(() => {
      expect(screen.getByText(/raspberry pi/i)).toBeInTheDocument();
      expect(screen.getByText(/vpn/i)).toBeInTheDocument();
      expect(screen.getByText(/backup/i)).toBeInTheDocument();
    });
  });
});
