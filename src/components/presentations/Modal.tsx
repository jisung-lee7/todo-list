import { FC } from 'react'
import './Modal.css'

interface ModalProps {
  isOpen: boolean
  title?: string
  body?: JSX.Element
  confirmModalCallback?: () => void
  cancelModalCallback?: () => void
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  title,
  body,
  confirmModalCallback,
  cancelModalCallback
}) => {
  const closeModal = () => {
    if (typeof cancelModalCallback === 'function') {
      cancelModalCallback()
    }
  }
  const stopPropagation = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }
  return isOpen ? (
    <div className="modal" onClick={closeModal}>
      <div className="modal-content" onClick={stopPropagation}>
        <div className="modal-header">
          <h1 className="modal-title">{title ?? ''}</h1>
        </div>
        <div className="modal-body">{body ?? ''}</div>
        <div className="moda-footer">
          <button
            onClick={() => {
              if (typeof confirmModalCallback === 'function') {
                confirmModalCallback()
              }
            }}
          >
            CONFIRM
          </button>
          <button
            onClick={() => {
              if (typeof cancelModalCallback === 'function') {
                cancelModalCallback()
              }
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  ) : null
}
