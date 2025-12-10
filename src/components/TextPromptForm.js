import React, { useState, useCallback } from 'react'
import './TextPromptForm.css'

const TextPromptForm = ({
  updateResponse,
  email,
  coins,
  setCoins,
  fetchRemainingRequests,
  isLoggedIn,
  setIsLoading,
}) => {
  const [prompt, setPrompt] = useState('')

  const handlePromptInput = useCallback(
    (event) => {
      event.preventDefault()

      if (prompt.trim() === '') {
        return
      }
      setIsLoading(true)

      fetch('http://173.249.56.139:8000/api/v1/chats/chat', {
        method: 'POST',
        body: JSON.stringify({
          prompt: prompt,
          ...(isLoggedIn && { email: email }),
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => {
          const fullResponse = {
            prompt: prompt,
            response: json.response,
            pdf_url: json.pdf_url,
            error: json.error || '',
            // coins: json.remaining,
          }
          // setCoins(fullResponse.coins)
          updateResponse(fullResponse)
        })
        .catch((error) => {
          updateResponse({ response: `Error: ${error.message}` })
        })
        .finally(() => {
          setIsLoading(false)
          fetchRemainingRequests(email)
        })

      setPrompt('')
    },
    [prompt, updateResponse]
  )
  return (
    <form onSubmit={handlePromptInput}>
      <div className='inputForm'>
        <input
          className='inputField'
          type='text'
          placeholder='Type here your request...'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button className='sendButton' type='submit'></button>
      </div>
    </form>
  )
}

export default TextPromptForm
