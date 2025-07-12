import React from 'react'
import './Modal.css'

const Modal = ({ isOpen, closeModal, children, className }) => {
  return (
    <div className={`modal ${isOpen ? 'modalOpen' : ''}`} onClick={closeModal}>
      <div
        className={`modalContent ${isOpen ? 'modalOpen' : ''} ${
          className || ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button onClick={closeModal} className='modalClose'>
          &#10006;
        </button>
      </div>
    </div>
  )
}

export default Modal
