// Modal.tsx
import type { FC, MouseEvent } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;

  children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleContentClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
