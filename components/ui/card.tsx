import * as React from 'react';
import styles from './card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, ...props }, ref) => (
  <div ref={ref} className={styles.root} {...props}>
    {children}
  </div>
));
Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({ children, ...props }, ref) => (
  <div ref={ref} className={styles.header} {...props}>
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(({ children, ...props }, ref) => (
  <h2 ref={ref} className={styles.title} {...props}>
    {children}
  </h2>
));
CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>(({ children, ...props }, ref) => (
  <div ref={ref} className={styles.description} {...props}>
    {children}
  </div>
));
CardDescription.displayName = 'CardDescription';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({ children, ...props }, ref) => (
  <div ref={ref} className={styles.content} {...props}>
    {children}
  </div>
));
CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({ children, ...props }, ref) => (
  <div ref={ref} className={styles.footer} {...props}>
    {children}
  </div>
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
