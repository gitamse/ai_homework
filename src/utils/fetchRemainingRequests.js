export const fetchRemainingRequests = (email, isLoggedIn) => {
  const url = new URL('http://173.249.56.139:8000/api/v1/chats/get_remaining')

  if (isLoggedIn && email) {
    url.searchParams.append('email', email)
  }

  console.log(email + ' in fetch')

  return fetch(url.toString())
    .then((response) => response.json())
    .then((data) => {
      if (data.remaining !== undefined) {
        return data.remaining
      } else {
        console.error('Error:', data.error)
        return 0
      }
    })
    .catch((error) => {
      console.error('Error fetching remaining requests:', error)
      return 0
    })
}
