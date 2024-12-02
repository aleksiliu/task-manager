import * as React from 'react';
import styles from './input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ error, className = '', ...props }, ref) => (
  <input ref={ref} className={`${styles.field} ${error ? styles.error : ''} ${className}`} {...props} />
));

Input.displayName = 'Input';

export { Input };
