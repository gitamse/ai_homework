import React, { useState, useRef, useEffect } from 'react'
import Modal from './Modal'
import './AudioRecorder.css'
import modal_audio_start from '../data/mic.svg'
import modal_audio_stop from '../data/mic-off.svg'
import modal_audio_upload from '../data/record-circle-1-svgrepo-com.svg'
import loadingGif from '../data/loading.gif'

const MAX_RECORD_TIME = 10

const AudioRecorder = ({
  updateResponse,
  email,
  setCoins,
  fetchRemainingRequests,
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordStatus, setRecordStatus] = useState('Start Recording')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [recordTimeLeft, setRecordTimeLeft] = useState(MAX_RECORD_TIME)
  const [isUploading, setIsUploading] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const intervalRef = useRef(null)
  const streamRef = useRef(null)

  const openModal = () => {
    setIsModalOpen(true)
    resetRecordingState()
  }

  const closeModal = () => {
    if (isRecording) {
      handleStopRecording()
    }
    resetRecordingState()
    setIsModalOpen(false)
  }

  // Сброс состояния записи
  const resetRecordingState = () => {
    setIsRecording(false)
    setRecordTimeLeft(MAX_RECORD_TIME)
    setRecordStatus('Start Recording')
    setIsUploading(false)
    audioChunksRef.current = []
    stopTimer()
  }

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setRecordTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handleStopRecording()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(intervalRef.current)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream)
        streamRef.current = stream
        mediaRecorderRef.current.start()
        setRecordStatus('Recording...')
        setIsRecording(true)
        startTimer()
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data)
        }
        mediaRecorderRef.current.onstop = () => {
          setRecordStatus('Recording Stopped')
        }
      })
      .catch((err) => {
        setRecordStatus('Microphone access error.')
      })
  }

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      stopTimer()

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }

  const sendAudioToServer = () => {
    setIsUploading(true)
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
    const formData = new FormData()
    formData.append('audio', audioBlob, 'audio.wav')

    fetch('http://173.249.56.139:8000/api/v1/chats/transcribe', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        updateResponse({
          response: `<strong>Transcription:</strong> ${
            data.transcript || 'Error'
          }`,
        })

        sendTranscriptionToChat(data.transcript)
      })
      .catch((error) => {
        updateResponse({ response: `Error sending audio: ${error.message}` })
      })
      .finally(() => {
        setIsModalOpen(false)
        resetRecordingState()
      })
  }
  const sendTranscriptionToChat = (transcription) => {
    fetch('http://173.249.56.139:8000/api/v1/chats/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt: transcription, email: email }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((json) => {
        const fullResponse = {
          response: json.response,
          pdf_url: json.pdf_url,
          // coins: json.remaining,
        }
        updateResponse(fullResponse)
        // setCoins(fullResponse.coins)
      })
      .catch((error) => {
        updateResponse(`Error sending text: ${error.message}`)
      })
      .finally(() => {
        setIsModalOpen(false)
        resetRecordingState()
        setTimeout(1000)
        fetchRemainingRequests(email)
      })
  }
  return (
    <div>
      <button onClick={openModal} className='startRecordingButton'></button>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        className='recordingModal'
      >
        {isRecording && <p className='timer'>{formatTime(recordTimeLeft)}</p>}

        {isUploading ? (
          <div>
            <img
              src={loadingGif}
              alt='Uploading...'
              className='audioLoadingGif'
            />
          </div>
        ) : (
          <div>
            <div
              className={
                recordTimeLeft ? 'buttonContainer' : 'invisibleButtonContainer'
              }
            >
              {!isRecording ? (
                <div
                  onClick={handleStartRecording}
                  className='modalStartButton'
                >
                  <img src={modal_audio_start} alt='Start' />
                </div>
              ) : (
                <div onClick={handleStopRecording} className='modalStopButton'>
                  <img src={modal_audio_stop} alt='Stop' />
                </div>
              )}
              {recordStatus === 'Start Recording'
                ? 'Start Recording'
                : isRecording
                ? 'Stop Recording'
                : 'Continue Recording'}
            </div>

            {!isRecording && audioChunksRef.current.length > 0 && (
              <div onClick={sendAudioToServer} className='modalSendVoice'>
                <img src={modal_audio_upload} alt='Send' />
                Send
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AudioRecorder
