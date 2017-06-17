'use strict'

export function populateOptions (data) {
  return data.map((d => {
    return {
      key: d._id,
      value: d._id,
      text: d.name
    }
  }))
}
