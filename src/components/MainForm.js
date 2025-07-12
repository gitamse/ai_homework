import React, { useState } from 'react'
import Camera from './Camera'
import FileUpload from './FileUpload'
import AudioRecorder from './AudioRecorder'
import TextPromptForm from './TextPromptForm'
import ResponseField from './ResponseField'
import './MainForm.css'

const MainForm = ({ email, coins, setCoins, fetchRemainingRequests }) => {
  const [responseText, setResponseText] = useState([])

  // Функция для обновления общего поля ответа
  const updateResponse = (newResponse) => {
    setResponseText((prev) => [...prev, newResponse])
  }
  return (
    <div>
      <TextPromptForm
        updateResponse={updateResponse}
        email={email}
        coins={coins}
        setCoins={setCoins}
        fetchRemainingRequests={fetchRemainingRequests}
      />
      <div className='requestOptions'>
        <div className='requestOption'>
          <AudioRecorder
            updateResponse={updateResponse}
            email={email}
            setCoins={setCoins}
            fetchRemainingRequests={fetchRemainingRequests}
          />
        </div>
        <div className='requestOption'>
          <Camera
            updateResponse={updateResponse}
            email={email}
            setCoins={setCoins}
            fetchRemainingRequests={fetchRemainingRequests}
          />
        </div>
        <div className='requestOption'>
          <FileUpload
            email={email}
            updateResponse={updateResponse}
            coins={coins}
            setCoins={setCoins}
            fetchRemainingRequests={fetchRemainingRequests}
          />
        </div>
      </div>
      <div>
        <ResponseField
          setResponseText={setResponseText}
          responseText={responseText}
        ></ResponseField>
      </div>
    </div>
  )
}

export default MainForm
