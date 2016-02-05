
// Dirty fake api call.
export const addTodo = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res()
      console.log('Add Todo "AJAX Call" Resolves')
    }, 1500)
  })
}
