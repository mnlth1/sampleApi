'use strict'

var promiseTimeout = function(time, reject, errorMessage) {
  let timeout = setTimeout(() => {
    clearTimeout(timeout)
    reject(createError(500, 'Timeout', `Request Timed out: ${errorMessage}`))
  }, time)
  return timeout;
  }

var createError = function(code, name, message, err) {
    let error = new Error(message)
    error.name = name
    error.code = code
    if (err && err.stack) {
      error.stack = err.stack
    }
    console.log('Error: ', err)
    return error
}

var executePromises = function(promises) {
    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(results => { resolve(results) })
        .catch(function(err) { reject(err) })
    })
  }

module.exports = {promiseTimeout, createError, executePromises}