import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({children, className = '' }) => {
  return (</CardProps>
    <div>
      {children}</div>
    </div>);;

export const CardHeader: React.FC<CardHeaderProps> = ({children, className = '' }) => {
  return (`</CardHeaderProps>
    <div>
      {children}</div>
    </div>);;

export const CardContent: React.FC<CardContentProps> = ({children, className = '' }) => {
  return (`</CardContentProps>
    <div>
      {children}</div>
    </div>);;

export const CardTitle: React.FC<CardTitleProps> = ({children, className = '' }) => {
  return (`</CardTitleProps>
    <h3>
      {children}</h3>
    </h3>);;
export const dynamic  = "force-dynamic";
`