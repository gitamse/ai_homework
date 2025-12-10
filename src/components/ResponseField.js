import { useState, useEffect } from 'react'
import DownloadPdf from './DownloadPdf'
import './ResponseField.css'

const ResponseField = ({ setResponseText, responseText, isLoading }) => {
  const [downloadPdfLink, setDownloadPdfLink] = useState('')

  useEffect(() => {
    if (responseText.length > 0) {
      const lastResponse = responseText[responseText.length - 1]
      if (lastResponse.pdf_url && lastResponse.pdf_url.trim() !== '') {
        setDownloadPdfLink(lastResponse.pdf_url)
      } else {
        setDownloadPdfLink('')
      }
    }
  }, [responseText])

  function clearResponseField() {
    setResponseText([])
    setDownloadPdfLink('')
  }
  return (
    <div className='responseField'>
      <div className='clearButtonContainer'>
        <button className='clearButton' onClick={clearResponseField}></button>
        {downloadPdfLink && (
          <div>
            <DownloadPdf downloadPdfLink={downloadPdfLink} />
          </div>
        )}
      </div>
      {isLoading && (
        <div className='loadingIndicator'>
          <p className='loading-text'>AI is thinking...</p>
        </div>
      )}
      {[...responseText].reverse().map((res, index) => (
        <div className='response-container' key={index}>
          {/* Отображаем свойство prompt */}

          {res.prompt ? (
            <div className='response'>
              <strong>Your request:</strong> {res.prompt}
            </div>
          ) : (
            ''
          )}

          {/* Отображаем свойство response с использованием dangerouslySetInnerHTML */}
          <div
            className='response'
            dangerouslySetInnerHTML={{ __html: res.response || res.error }}
          />
        </div>
      ))}
    </div>
  )
}

export default ResponseField
