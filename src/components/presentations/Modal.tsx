import { FC } from 'react'

interface ModalProps {
  isOpen: boolean
  title?: string
  body?: string
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
  return isOpen ? (
    <div>
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
  ) : null
}
