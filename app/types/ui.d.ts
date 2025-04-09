import * as React from "react";
import { VariantProps } from "class-variance-authority";

declare module "react" {
  interface ButtonHTMLAttributes<T> extends React.HTMLAttributes<T> {
    // Attributs spécifiques aux boutons
    autoFocus?: boolean;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    type?: "submit" | "reset" | "button";
    value?: string | string[] | number;
  }

  interface InputHTMLAttributes<T> extends React.HTMLAttributes<T> {
    // Attributs spécifiques aux inputs
    accept?: string;
    alt?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    checked?: boolean;
    dirName?: string;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    height?: number | string;
    list?: string;
    max?: number | string;
    maxLength?: number;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    name?: string;
    pattern?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: number;
    src?: string;
    step?: number | string;
    type?: string;
    value?: string | string[] | number;
    width?: number | string;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
