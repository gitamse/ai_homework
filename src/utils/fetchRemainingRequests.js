export const fetchRemainingRequests = (email) => {
  console.log(email + ' in fetch')
  return fetch(`https://aimentory.com:5000/get_remaining?email=${email}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.remaining !== undefined) {
        return data.remaining // Возвращаем количество монет
      } else {
        console.error('Error:', data.error)
        return 0 // Если произошла ошибка, возвращаем 0
      }
    })
    .catch((error) => {
      console.error('Error fetching remaining requests:', error)
      return 0 // Если произошла ошибка, возвращаем 0
    })
}
