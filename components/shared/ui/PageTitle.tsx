import React from 'react';
import GradientTitle from "./GradientTitle";

export interface PageTitleProps {
  children: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ children }) => {
  return <GradientTitle>{children}</GradientTitle>;
  );

export default PageTitle; 