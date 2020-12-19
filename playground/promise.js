const doWork = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve('this was good')
    reject('this was bad')
  }, 2000)
})

doWork.then((result) => {
  console.log(result)
}).catch((error) => {
  console.log(error)
})