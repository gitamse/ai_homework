import React, { useState, useRef, useEffect } from 'react'
import './Camera.css'
import SelectionArea from './SelectionArea'
import loading from '../data/amalie-steiness.gif'

const predefinedAreas = [
  {
    label: <div className='customFrames' style={{ height: '10%' }}></div>,
    y: 30,
    width: 300,
    height: 50,
  },
  {
    label: <div className='customFrames' style={{ height: '25%' }}></div>,
    y: 30,
    width: 300,
    height: 150,
  },
  {
    label: <div className='customFrames' style={{ height: '40%' }}></div>,
    y: 30,
    width: 300,
    height: 300,
  },
]

const Camera = ({ updateResponse, email, fetchRemainingRequests }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [videoStream, setVideoStream] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFlashOn, setIsFlashOn] = useState(false)
  const [isSelectingArea, setIsSelectingArea] = useState(false)
  const [selectionArea, setSelectionArea] = useState(predefinedAreas[0])
  const videoElement = useRef(null)
  // const [imagePreview, setImagePreview] = useState(null)

  const openCamera = () => {
    const constraints = { video: { facingMode: 'environment' } }
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoElement.current) {
          videoElement.current.srcObject = stream
        }
        setIsCameraOpen(true)
        setVideoStream(stream)
      })
      .catch((error) => {
        console.error('Error accessing camera:', error)
        alert('Failed to open camera: ' + error.message)
      })
  }

  const closeCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop())
    }
    if (videoElement.current) {
      videoElement.current.srcObject = null
    }
    setIsCameraOpen(false)
    setIsLoading(false)
    setIsSelectingArea(false)
  }

  const toggleFlashlight = () => {
    if (videoStream) {
      const track = videoStream.getVideoTracks()[0]
      const capabilities = track.getCapabilities()
      if (capabilities.torch) {
        const constraints = { advanced: [{ torch: !isFlashOn }] }
        track.applyConstraints(constraints)
        setIsFlashOn(!isFlashOn)
      } else {
        alert('Flashlight is not supported on this device.')
      }
    }
  }

  const captureImage = () => {
    const canvas = document.createElement('canvas')
    const video = videoElement.current
    if (video) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      context.drawImage(video, 0, 0)
      const imageDataUrl = canvas.toDataURL('image/jpeg')
      setIsLoading(true)
      sendImageDataToServer(imageDataUrl)
    }
  }

  const captureSelectedArea = () => {
    const canvas = document.createElement('canvas')
    const video = videoElement.current
    if (video) {
      // Получаем положение и размер выделенной области
      const screenWidth = window.innerWidth < 800 ? window.innerWidth : 800
      const screenHeight = window.innerHeight
      const x = screenWidth / 2 - selectionArea.width / 2
      const y = (selectionArea.y / 100) * screenHeight

      // Масштабирование
      const scaleX = video.videoWidth / video.clientWidth
      const scaleY = video.videoHeight / video.clientHeight

      // Рассчитываем координаты в реальном масштабе видео
      const realX = x * scaleX
      const realY = y * scaleY
      const realWidth = selectionArea.width * scaleX
      const realHeight = selectionArea.height * scaleY

      // Настраиваем canvas и рисуем изображение
      canvas.width = realWidth
      canvas.height = realHeight
      const context = canvas.getContext('2d')
      context.drawImage(
        video,
        realX,
        realY,
        realWidth,
        realHeight,
        0,
        0,
        realWidth,
        realHeight
      )

      // Преобразуем изображение в DataURL и отправляем на сервер
      const imageDataUrl = canvas.toDataURL('image/jpeg')
      setIsLoading(true)
      sendImageDataToServer(imageDataUrl)
    }
  }

  const sendImageDataToServer = (imageDataUrl) => {
    const byteString = atob(imageDataUrl.split(',')[1])
    const mimeString = imageDataUrl.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: mimeString })
    const formData = new FormData()
    formData.append('image', blob, 'photo.jpeg')
    if (email != '') {
      formData.append('email', email)
    }

    // const imagePreviewUrl = URL.createObjectURL(blob)
    // setImagePreview(imagePreviewUrl)

    fetch('http://173.249.56.139:8000/api/v1/chats/upload_image', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        updateResponse({ response: data.text || 'Error' })
        setIsLoading(false)
        closeCamera()
        // window.open(imagePreview, '_blank')
      })
      .catch((error) => {
        console.error('Error sending image:', error.message)
        setIsLoading(false)
        closeCamera()
      })
      .finally(() => {
        setTimeout(1000)
        fetchRemainingRequests(email)
      })
  }

  useEffect(() => {
    if (isCameraOpen) {
      openCamera()
    }
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isCameraOpen])

  return (
    <div>
      <button
        className='cameraButton'
        onClick={() => setIsCameraOpen((prev) => !prev)}
      ></button>

      {isCameraOpen && (
        <div className={`CameraModal ${isCameraOpen ? 'open' : ''}`}>
          <div
            className='CameraModalContent'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='focus-frame'>
              <div className='left-ruler'>
                <div className='tick long' style={{ top: '0%' }}></div>
                <div className='tick short' style={{ top: '20%' }}></div>
                <div className='tick short' style={{ top: '40%' }}></div>
                <div className='tick short' style={{ top: '60%' }}></div>
                <div className='tick short' style={{ top: '80%' }}></div>
                <div className='tick long' style={{ top: '99.5%' }}></div>
              </div>
            </div>
            <div className='focus-frame-top-right'></div>
            <div className='focus-frame-bottom-left'></div>
            <div className='focus-frame-bottom-right'></div>
            {isLoading ? (
              <img src={loading} alt='Loading...' className='loadingGif' />
            ) : (
              <div className='video-wrapper'>
                <video ref={videoElement} autoPlay playsInline />
                {isSelectingArea && (
                  <SelectionArea selectionArea={selectionArea} />
                )}
              </div>
            )}
            <div className='controls'>
              {!isLoading && (
                <>
                  <button
                    className={`flashlightButton ${
                      isFlashOn ? 'flashlight-off' : 'flashlight-on'
                    }`}
                    onClick={toggleFlashlight}
                  ></button>
                  <button
                    className='captureButton'
                    onClick={
                      isSelectingArea ? captureSelectedArea : captureImage
                    }
                  ></button>
                  <button
                    className='selectAreaButton'
                    onClick={() => setIsSelectingArea((prev) => !prev)}
                  >
                    {/* {isSelectingArea ? 'Cancel Area' : 'Select Area'} */}
                  </button>
                </>
              )}
            </div>
            <div
              className={`predefinedAreaButtons ${
                isSelectingArea ? 'visible' : ''
              }`}
            >
              <div className='predefinedAreas'>
                {predefinedAreas.map((area, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      {
                        setSelectionArea(area)
                      }
                    }}
                  >
                    {area.label}
                  </button>
                ))}
              </div>
            </div>
            <button className='cancelButton' onClick={closeCamera}></button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Camera
