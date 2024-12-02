import * as React from 'react';
import styles from './input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = '', error, ...props }, ref) => {
  return (
    <input className={`${styles.input} ${error ? styles['input--error'] : ''} ${className}`} ref={ref} {...props} />
  );
});

Input.displayName = 'Input';

export { Input };
