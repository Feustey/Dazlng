"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useAlert } from "../contexts/AlertContext";
import { motion } from "framer-motion";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  jobTitle: string;
  companyPhone: string;
  companyWebsite: string;
  interest: string;
  message: string;
}

interface ApiError extends Error {
  message: string;
}

export default function ContactForm() {
  const t = useTranslations("Contact.form");
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    jobTitle: "",
    companyPhone: "",
    companyWebsite: "",
    interest: "General Inquiry",
    message: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (value: string) => {
    setFormData((prev) => ({ ...prev, interest: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showAlert("error", t("error.requiredFields"));
      return;
    }

    if (!validateEmail(formData.email)) {
      showAlert("error", t("error.invalidEmail"));
      return;
    }

    if (!formData.message.trim()) {
      showAlert("error", t("error.requiredMessage"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("error.default"));
      }

      showAlert("success", t("success"));
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        companyName: "",
        jobTitle: "",
        companyPhone: "",
        companyWebsite: "",
        interest: "General Inquiry",
        message: "",
      });
    } catch (err) {
      const error = err as ApiError;
      showAlert("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t("firstName")}</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t("lastName")}</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="john.doe@example.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">{t("companyName")}</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Lightning Inc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">{t("jobTitle")}</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Lightning Node Operator"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyPhone">{t("companyPhone")}</Label>
            <Input
              id="companyPhone"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="+33 1 23 45 67 89"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyWebsite">{t("companyWebsite")}</Label>
            <Input
              id="companyWebsite"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interest">{t("interest")}</Label>
          <Select
            value={formData.interest}
            onValueChange={handleInterestChange}
          >
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
              <SelectValue placeholder={t("selectSubject")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General Inquiry">
                {t("interests.general")}
              </SelectItem>
              <SelectItem value="Technical Support">
                {t("interests.support")}
              </SelectItem>
              <SelectItem value="Partnership">
                {t("interests.partnership")}
              </SelectItem>
              <SelectItem value="Business">
                {t("interests.business")}
              </SelectItem>
              <SelectItem value="Other">{t("interests.other")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">{t("message")}</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder={t("messagePlaceholder")}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200 dark:from-purple-700 dark:to-purple-800 dark:hover:from-purple-800 dark:hover:to-purple-900"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            t("submit")
          )}
        </Button>
      </form>
    </motion.div>
  );
}
