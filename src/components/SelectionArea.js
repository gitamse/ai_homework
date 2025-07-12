import React from 'react'
import './SelectionArea.css'

const SelectionArea = ({ selectionArea }) => {
  const screenWidth = window.innerWidth < 800 ? window.innerWidth : 800
  const screenHeight = window.innerHeight
  const x = screenWidth / 2 - selectionArea.width / 2
  const y = (selectionArea.y / 100) * screenHeight

  return (
    <>
      <div
        className='selection-area'
        style={{
          left: x,
          top: y,
          width: selectionArea.width,
          height: selectionArea.height,
        }}
      ></div>

      <div className='overlay overlay-top' style={{ height: y }}></div>
      <div
        className='overlay overlay-left'
        style={{
          width: x,
          top: y,
          height: selectionArea.height,
        }}
      ></div>
      <div
        className='overlay overlay-right'
        style={{
          left: x + selectionArea.width,
          top: y,
          height: selectionArea.height,
        }}
      ></div>
      <div
        className='overlay overlay-bottom'
        style={{ top: y + selectionArea.height }}
      ></div>
    </>
  )
}

export default SelectionArea
