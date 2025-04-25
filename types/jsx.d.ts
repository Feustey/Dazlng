import { ReactNode } from "react";

declare global {
  namespace JSX {
    interface Element extends ReactNode {}
    interface ElementClass {
      render(): ReactNode;
    }
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
    interface IntrinsicAttributes {
      key?: string | number | bigint | null;
    }
    interface IntrinsicClassAttributes<T> {
      ref?: any;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
