import { describe, it, expect, vi, beforeEach } from "vitest";
import { EmailService } from "../../app/lib/emailService";
import { Resend } from "resend";

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn(),
    },
  })),
}));

describe("EmailService", () => {
  let emailService: EmailService;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "test_key";
    emailService = EmailService.getInstance();
  });

  describe("getInstance", () => {
    it("devrait retourner la même instance", () => {
      const instance1 = EmailService.getInstance();
      const instance2 = EmailService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe("sendEmail", () => {
    const mockEmailData = {
      to: "test@example.com",
      firstName: "John",
      subject: "Test Email",
      message: "Test message",
    };

    it("devrait envoyer un email avec succès", async () => {
      const mockResponse = { id: "email_123" };
      const mockResend = new Resend();
      mockResend.emails.send = vi.fn().mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const result = await emailService.sendEmail(mockEmailData);

      expect(result).toEqual(mockResponse);
      expect(mockResend.emails.send).toHaveBeenCalledWith({
        from: expect.stringContaining("Daznode"),
        to: [mockEmailData.to],
        subject: mockEmailData.subject,
        react: expect.any(Object),
      });
    });

    it("devrait gérer les erreurs d'envoi", async () => {
      const mockError = new Error("Failed to send email");
      const mockResend = new Resend();
      mockResend.emails.send = vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(emailService.sendEmail(mockEmailData)).rejects.toThrow();
    });

    it("devrait gérer les erreurs de réseau", async () => {
      const mockResend = new Resend();
      mockResend.emails.send = vi
        .fn()
        .mockRejectedValue(new Error("Network error"));

      await expect(emailService.sendEmail(mockEmailData)).rejects.toThrow();
    });
  });
});
