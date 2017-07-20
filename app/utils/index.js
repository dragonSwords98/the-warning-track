'use strict'

export function objectToOption (data) {
  return data.map(d => {
    return {
      key: d._id,
      value: d._id,
      text: d.name
    }
  })
}
