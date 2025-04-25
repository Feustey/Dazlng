"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle,
  Circle,
  Package,
  CreditCard,
  ClipboardCheck,
} from "lucide-react";

export default function ProgressBar() {
  const pathname = usePathname();
  const t = useTranslations("Checkout");
  const params = useParams();
  const locale = params?.locale as string;

  const steps = [
    {
      name: t("steps.delivery"),
      href: `/${locale}/checkout/delivery`,
      icon: Package,
      current: pathname.includes("/checkout/delivery"),
      completed:
        pathname.includes("/checkout/payment") ||
        pathname.includes("/checkout/confirmation"),
    },
    {
      name: t("steps.payment"),
      href: `/${locale}/checkout/payment`,
      icon: CreditCard,
      current: pathname.includes("/checkout/payment"),
      completed: pathname.includes("/checkout/confirmation"),
    },
    {
      name: t("steps.confirmation"),
      href: `/${locale}/checkout/confirmation`,
      icon: ClipboardCheck,
      current: pathname.includes("/checkout/confirmation"),
      completed: false,
    },
  ];

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`${
              stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""
            } relative`}
          >
            <Link href={step.href}>
              <div className="flex items-center">
                <div
                  className={`${
                    step.completed
                      ? "bg-primary"
                      : step.current
                        ? "border-2 border-primary"
                        : "border-2 border-gray-300"
                  } rounded-full p-1`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <Circle
                      className={`h-5 w-5 ${
                        step.current ? "text-primary" : "text-gray-300"
                      }`}
                    />
                  )}
                </div>
                <div
                  className={`ml-4 min-w-0 flex flex-col ${
                    step.completed
                      ? "text-primary"
                      : step.current
                        ? "text-primary font-medium"
                        : "text-gray-500"
                  }`}
                >
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              </div>
            </Link>
            {stepIdx !== steps.length - 1 && (
              <div
                className={`absolute top-5 left-8 -ml-px h-0.5 w-full ${
                  step.completed ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
