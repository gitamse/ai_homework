import React, { useState } from 'react'
import './FileUpload.css'
import uploadIcon from '../data/upload-photo-svgrepo-com.svg'
import loadingGif from '../data/loading.gif'
import modal_audio_upload from '../data/upload-file-svgrepo-com.svg'
import Modal from './Modal'

const FileUpload = ({
  updateResponse,
  coins,
  setCoins,
  email,
  fetchRemainingRequests,
}) => {
  const [file, setFile] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setIsModalOpen(true)
      event.target.value = null
    }
  }
  const handleSubmit = async () => {
    if (!file) {
      alert('Please select a file')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('image', file)
    if (email != '') {
      formData.append('email', email)
    }

    try {
      const response = await fetch(
        'http://173.249.56.139:8000/api/v1/chats/upload_image',
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()
      const fullResponse = {
        response: data.text,
      }
      const errorResponse = {
        response: 'Error',
      }
      updateResponse(fullResponse || errorResponse)
      setCoins(data.remaining)
      console.log(email)
    } catch (error) {
      updateResponse({ error: `File upload error: ${error.message}` })
    } finally {
      setIsLoading(false)
      setIsModalOpen(false)
      setFile(null)
      setTimeout(1000)
      fetchRemainingRequests(email)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div>
      <label htmlFor='file-input' className='uploadIcon'>
        <img src={uploadIcon} alt='Upload file' />
      </label>
      <input
        id='file-input'
        type='file'
        accept='image/*'
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        {isLoading ? (
          <img
            src={loadingGif}
            alt='Loading...'
            className='fileUploadLoadingGif'
          />
        ) : (
          <>
            <h4>{file && file.name}</h4>
            <div onClick={handleSubmit} className='modalUploadFile'>
              <img src={modal_audio_upload} alt='Upload' />
              Upload
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

export default FileUpload
