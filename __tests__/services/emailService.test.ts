import EmailService from "@lib/emailService";
import { Resend } from "resend";

// Mock Resend
jest.mock("resend", () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn(),
      },
    })),
  };
});

describe("EmailService", () => {
  let mockResend: jest.Mocked<Resend>;

  beforeEach(() => {
    mockResend = new Resend() as jest.Mocked<Resend>;
    (mockResend.emails.send as jest.Mock).mockClear();
  });

  it("sends an email successfully", async () => {
    const mockEmailData = {
      to: "recipient@example.com",
      firstName: "John",
      subject: "Test Email",
      message: "Test content",
    };

    (mockResend.emails.send as jest.Mock).mockResolvedValueOnce({
      data: { id: "test-id" },
      error: null,
    });

    const result = await EmailService.sendEmail(mockEmailData);

    expect(result).toEqual({ id: "test-id" });
    expect(mockResend.emails.send).toHaveBeenCalledWith({
      from: "Daznode <contact@dazno.de>",
      to: [mockEmailData.to],
      subject: mockEmailData.subject,
      react: expect.any(Object),
    });
  });

  it("handles email sending error", async () => {
    const mockError = new Error("Failed to send email");
    (mockResend.emails.send as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: mockError,
    });

    await expect(
      EmailService.sendEmail({
        to: "recipient@example.com",
        firstName: "John",
        subject: "Test Email",
        message: "Test content",
      })
    ).rejects.toThrow("Failed to send email");
  });

  it("handles network error", async () => {
    (mockResend.emails.send as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    await expect(
      EmailService.sendEmail({
        to: "recipient@example.com",
        firstName: "John",
        subject: "Test Email",
        message: "Test content",
      })
    ).rejects.toThrow("Network error");
  });
});
