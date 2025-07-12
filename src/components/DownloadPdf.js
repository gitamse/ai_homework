import React from 'react'
import './DownloadPdf.css'

const DownloadPdf = ({ downloadPdfLink }) => {
  const handleDownload = () => {
    if (downloadPdfLink) {
      const link = document.createElement('a')
      link.href = downloadPdfLink
      link.target = '_blank' // Открыть в новой вкладке
      link.rel = 'noopener noreferrer' // Безопасность
      link.click()
    } else {
      console.warn('Ссылка на файл отсутствует.')
    }
  }

  return (
    <button onClick={handleDownload} className='downloadPdfButton'></button>
  )
}

export default DownloadPdf
