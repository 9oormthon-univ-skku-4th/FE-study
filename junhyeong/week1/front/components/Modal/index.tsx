import { FC, useCallback } from "react";
import { CloseModalButton, CreateModal } from "./styles";
import React from "react";


interface Props {
    show: boolean;
    onCloseModal: (e: any) => void;
}

const Modal: FC<Props> = ({show, children, onCloseModal}) => {
    const stopPropagation = useCallback((e) => {
        e.stopPropagation();
    }, []);

    if (!show) {
        return null;
    }
    return (
        <CreateModal onClick={onCloseModal}>
            <div onClick={stopPropagation}>
                <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
                {children}
            </div>
        </CreateModal>

    );

};

export default Modal;