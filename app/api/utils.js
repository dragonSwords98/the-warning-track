'use strict'

// TODO: this is not your code, rewrite it with your own code please...

import Promise from 'bluebird'
// import {
//   FILTER_TYPE_LIST,
//   ORDER_DESC
// } from './constants'
// const VIEW_LOCKEDFIELDS_NAME_REGEX = /^lockedfields$/i
//
// /**
//  * takes a filterSet and encodes it for query string
//  *
//  * @param { Object } filterSet - an individual filter ({ field: , type: , values })
//  * @returns { String } urlencode filter
//  */
// export function encodeListFilter (filterSet) {
//   let json = JSON.stringify(filterSet)
//   let encoded = encodeURI(json)
//   return 'filters=' + encoded
// }
// function unpackTableObject (object, value) {
//   let { fields, order } = object
//   let result = {}
//   for (let key of order) {
//     if (value[key]) {
//       result[key] = unpackTableRow(fields, value[key])
//     }
//   }
//   return result
// }
// export function unpackTableRow (fields, row) {
//   let i
//   let len = fields.length
//   let result = {}
//   for (i = 0; i < len; ++i) {
//     let field = fields[i]
//     if (typeof (field) === 'object') {
//       result[field.name] = unpackTableObject(field, row[i])
//     } else {
//       result[field] = row[i]
//     }
//   }
//   return result
// }
// /**
//  * unpacks { fields: ..., data: ... } into [ { f: ... }, { f: ... } ]
//  *
//  * @param { Object } table - object containing fields and data to unpack
//  * @returns { Array } unpacked data rows
//  */
// export const unpackTable = ({ fields, data }) => {
//   return data.map((row) => unpackTableRow(fields, row))
// }
// /**
//  * unpacks '123,456' into [123, 456]
//  *
//  * nb. assumes values are integers for now. Should probably
//  * extract that and do it on the call side.
//  *
//  * @param { String } csv - comma separated values
//  * @param { Array } array of numbers
//  */
// export function unpackCSV (csv) {
//   if (!csv) {
//     return []
//   }
//   return csv.split(',').map((v) => parseInt(v, 10))
// }
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
// /**
//  * takes a field name and maps it to an order object.
//  *
//  * @param { String } field - name of field
//  * @return { Object } orderBy field
//  */
// export function mapFieldToOrderBy (field) {
//   return {
//     field: field,
//     direction: ORDER_DESC
//   }
// }
// /**
//  * take filter options, the field name, and produce the default
//  * filter object
//  */
// export function mapFilterOptionsToQuery (options, field, filters) {
//   //
//   // TODO: defaults based on options
//   //
//   return {
//     field,
//     type: FILTER_TYPE_LIST,
//     values: options.filter(o => o.default).map(o => o.value)
//   }
// }
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
/**
 * prepares a query to be sent to the server.
 *
 * Right now just strips empty filters
 */
// export function prepareQuery (query) {
//   let result = Object.assign({}, query)
//   //
//   // ensure all groups and fields are requested
//   //
//   result.fields = [].concat(result.groups).concat(result.fields)
//   result.fields = result.fields.reduce(uniq, [])
//   //
//   // omit empty filters
//   //
//   result.filters = result.filters.filter((filter) => {
//     if (filter.type === FILTER_TYPE_LIST) {
//       return filter.values.length
//     }
//     return true
//   })
//   return result
// }
// /**
//  * cleans up the definition as received by the server.
//  *
//  * for example: remove invalid fields from view definitions which
//  * will cause a bad query.
//  */
// export function sanitizeReportDefinition (definition) {
//   function fieldNameFilter (name) {
//     return definition.fields.find(field => field.name === name)
//   }
//   function sanitizeView (view) {
//     view.fields = view.fields.filter(fieldNameFilter)
//     //
//     // some views have a "lockedFields" entry, probably a reminant of the old
//     // codebase. Normalize to lockedfields which is what the backend defines the
//     // field as.
//     //
//     const lockedFieldsName = Object.keys(view).filter(f => VIEW_LOCKEDFIELDS_NAME_REGEX.test(f))
//     if (lockedFieldsName && lockedFieldsName !== 'lockedfields') {
//       view.lockedfields = view[lockedFieldsName]
//       delete view[lockedFieldsName]
//     }
//     return view
//   }
//   if (definition && definition.views) {
//     //
//     // at least one bseg view is missing fields. it's custom, so it *may*
//     // be limited to me. either way, it's bogus, so we'll prune it.
//     //
//     definition.views = definition.views.filter(view => view.fields && view.groups)
//     //
//     // sanitize individual views as well
//     //
//     definition.views = definition.views.map(view => sanitizeView(view))
//   }
//   return definition
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
