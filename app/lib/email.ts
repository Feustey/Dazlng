// Fonction pour envoyer un email de vérification
export async function sendVerificationEmail(email: string, code: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined");
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "noreply@dazlng.com",
        to: email,
        subject: "Code de vérification DazLng",
        html: `
          <h1>Code de vérification DazLng</h1>
          <p>Voici votre code de vérification : <strong>${code}</strong></p>
          <p>Ce code expirera dans 15 minutes.</p>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
