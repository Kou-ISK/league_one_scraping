import React from 'react';
import { Button as AtomicButton } from '../components/atoms/Button';

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = 'medium',
  label,
  ...props
}: ButtonProps) => {
  return (
    <AtomicButton
      variant={primary ? 'primary' : 'secondary'}
      size={size}
      onClick={props.onClick}
    >
      {label}
    </AtomicButton>
  );
};
