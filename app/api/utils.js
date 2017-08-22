'use strict'
// TODO: this is not your code, rewrite it with your own code please...
import Promise from 'bluebird'

/**
 * standard analytics api error handling.
 *
 * @param { Object|Error } reason - either a API error object or javascript Error
 * @returns { Promise.<Object> } decoded status and reason (rejected)
 */
export function handleError (reason) {
  let { response } = reason
  //
  // exceptions and other weird network errors
  //
  if (reason instanceof Error) {
    return Promise.reject(reason)
  }
  //
  // when we cancel a request, the promise chain gets rejected.
  // this is our way of telling the rest of the system that
  // everything is fine ;)
  //
  if (reason.message && reason.message === 'safely.cancelled') {
    return
  }
  if (response.data && response.data.response && response.data.data) {
    response = Object.assign({}, response.data.data, { status: response.status })
    return Promise.reject(response) // JSON.stringify(response))
  }
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({
    status: reason.response.status,
    reason: reason.message
  })
}

let handleAPISuccess = (response) => Promise.resolve(response.data)
let handleAPIError = (error) => handleError(error)
/**
 * wrap the api query in a standardized promise that will
 * correctly manage the response as well as normalized
 * API errors.
 */
export function wrapApiQuery (promise) {
  return Promise.resolve(promise).then(handleAPISuccess).catch(handleAPIError)
}

// function uniq (acc, val, index, arr) {
//   if (!acc.includes(val)) {
//     acc.push(val)
//   }
//   return acc
// }

// /**
//  * expect a given response type in the result of an API call. Rejects otherwise
//  * to ensure that errors get routed to the rejection chain.
//  *
//  * @param { String } expected - the response type expected
//  * @returns { Function } promise interceptor
//  */
// export function expectResponse (expected) {
//   return function ({ response, data }) {
//     if (response !== expected) {
//       let message = 'expected ' + JSON.stringify(expected) +
//         ' in response, got: ' + JSON.stringify(response)
//       return Promise.reject(new Error(message))
//     }
//     return Promise.resolve(data)
//   }
// }
