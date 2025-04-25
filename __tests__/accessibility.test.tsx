import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { UserProfile } from "../UserProfile";
import { SettingsForm } from "../SettingsForm";
import { OrdersList } from "../OrdersList";

describe("Accessibilité", () => {
  describe("UserProfile", () => {
    it("devrait être accessible", async () => {
      const { container } = render(<UserProfile />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("devrait avoir des labels appropriés", () => {
      render(<UserProfile />);
      expect(screen.getByLabelText("Nom complet")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Téléphone")).toBeInTheDocument();
      expect(screen.getByLabelText("Adresse")).toBeInTheDocument();
    });

    it("devrait avoir des rôles ARIA appropriés", () => {
      render(<UserProfile />);
      expect(screen.getByRole("form")).toBeInTheDocument();
      expect(screen.getAllByRole("textbox")).toHaveLength(4);
    });
  });

  describe("SettingsForm", () => {
    it("devrait être accessible", async () => {
      const { container } = render(<SettingsForm />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("devrait avoir des labels appropriés", () => {
      render(<SettingsForm />);
      expect(
        screen.getByLabelText("Notifications par email")
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Notifications SMS")).toBeInTheDocument();
      expect(screen.getByLabelText("Mode sombre")).toBeInTheDocument();
    });

    it("devrait avoir des rôles ARIA appropriés", () => {
      render(<SettingsForm />);
      expect(screen.getByRole("form")).toBeInTheDocument();
      expect(screen.getAllByRole("switch")).toHaveLength(3);
    });
  });

  describe("OrdersList", () => {
    it("devrait être accessible", async () => {
      const { container } = render(<OrdersList />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("devrait avoir des rôles ARIA appropriés", () => {
      render(<OrdersList />);
      expect(screen.getByRole("tablist")).toBeInTheDocument();
      expect(screen.getAllByRole("tab")).toHaveLength(3);
      expect(screen.getByRole("tabpanel")).toBeInTheDocument();
    });

    it("devrait avoir des attributs aria-selected appropriés", () => {
      render(<OrdersList />);
      const tabs = screen.getAllByRole("tab");
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      expect(tabs[1]).toHaveAttribute("aria-selected", "false");
      expect(tabs[2]).toHaveAttribute("aria-selected", "false");
    });
  });
});
