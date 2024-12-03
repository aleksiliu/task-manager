import * as React from 'react';
import styles from './button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'destructive' | 'outline';
  size?: 'default' | 'icon';
}

export function Button({ children, className = '', variant = 'default', size = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.root} ${styles[variant]} ${styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${className}`}
      {...props}>
      <span className={styles.content}>{children}</span>
    </button>
  );
}
