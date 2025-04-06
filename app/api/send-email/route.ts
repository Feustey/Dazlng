import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const { to, subject, text, formData } = await request.json();

    // Sauvegarde en base de données
    const contact = await prisma.contact.create({
      data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        companyPhone: formData.companyPhone,
        companyWebsite: formData.companyWebsite,
        interest: formData.interest,
        message: formData.message,
      },
    });

    // Configuration et envoi de l'email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"DazNode" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    return NextResponse.json({
      success: true,
      contactId: contact.id,
    });
  } catch (error: any) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
