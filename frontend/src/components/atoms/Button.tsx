import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

export function Button({
  children,
  variant = 'secondary',
  size = 'medium',
  type = 'button',
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`ui-button ui-button-${variant} ui-button-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
