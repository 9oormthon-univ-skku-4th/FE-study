import React, { CSSProperties, FC, useCallback } from 'react';
import { CloseModalButton, CreateModal } from '@components/Modal/styles';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  closeModalButton?: boolean;
}

const Modal: FC<Props> = ({ children, show, onCloseModal, closeModalButton: closeButton }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }
  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateModal>
  );
};
Modal.defaultProps = {
  closeModalButton: true,
};

export default Modal;
