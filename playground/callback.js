const doWork = (callback) => {
  setTimeout(() => {

    // callback('this is an error')
    callback(undefined, 'success')
  }, 2000)
}

doWork((error, result) => {
  if (error) {
    return console.log(error)
  }

  console.log(result)
})