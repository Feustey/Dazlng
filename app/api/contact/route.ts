import { NextResponse } from "next/server";
import { Resend } from "resend";
import ContactEmailTemplate from "../../components/emails/ContactEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, interest, message } =
      await request.json();

    // Envoyer l'email de contact à l'admin
    await resend.emails.send({
      from: "DazNode <contact@daznode.com>",
      to: "contact@dazno.de",
      subject: `[Contact DazNode] ${interest} - ${firstName} ${lastName}`,
      react: ContactEmailTemplate({
        type: "admin",
        firstName,
        lastName,
        email,
        interest,
        message,
      }),
    });

    // Envoyer un email de confirmation à l'utilisateur
    await resend.emails.send({
      from: "DazNode <contact@daznode.com>",
      to: email,
      subject: "Confirmation de votre message - DazNode",
      react: ContactEmailTemplate({
        type: "user",
        firstName,
        lastName,
        email,
        interest,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { error: "Failed to send contact email" },
      { status: 500 }
    );
  }
}
