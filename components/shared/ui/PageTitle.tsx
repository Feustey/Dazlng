import React from "react";
import GradientTitle from "./GradientTitle";

export interface PageTitleProps {
  children: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ children }) => {</PageTitleProps>
  return <GradientTitle>{children}</GradientTitle>;
};

export default PageTitle; 