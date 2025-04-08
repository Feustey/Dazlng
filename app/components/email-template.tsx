import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  message: string;
  subject?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  message,
  subject,
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto",
    }}
  >
    <h1
      style={{
        color: "#333",
        marginBottom: "20px",
      }}
    >
      Bonjour {firstName},
    </h1>
    {subject && (
      <h2
        style={{
          color: "#666",
          marginBottom: "15px",
        }}
      >
        {subject}
      </h2>
    )}
    <div
      style={{
        color: "#444",
        lineHeight: "1.6",
        marginBottom: "30px",
      }}
    >
      {message}
    </div>
    <div
      style={{
        borderTop: "1px solid #eee",
        paddingTop: "20px",
        color: "#666",
        fontSize: "14px",
      }}
    >
      Cordialement,
      <br />
      L'équipe Daznode
    </div>
  </div>
);
