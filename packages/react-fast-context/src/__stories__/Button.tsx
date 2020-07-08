import React, {FC, ReactNode} from 'react';

const styles = {
  border: '1px solid #eee',
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: 15,
  padding: '3px 10px',
  margin: 10,
};

export interface ButtonProps {
  /**
   * Super partia
   */
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export const Button: FC<ButtonProps> = ({ children, onClick }) => (
  <button onClick={onClick} style={styles} type="button">
    {children}
  </button>
);

export default Button;
