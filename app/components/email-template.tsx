import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  message: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  firstName,
  message,
}) => (
  <div>
    <h1>Bonjour {firstName},</h1>
    <p>{message}</p>
    <footer>
      <p>Cordialement,</p>
      <p>L'équipe Daznode</p>
    </footer>
  </div>
);
