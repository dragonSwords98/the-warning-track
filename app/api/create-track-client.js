'use strict'

import axios from 'axios'
import TrackClient from './track-client'

export default function createTrackClient () {
  let http = axios.create({})
  let client = new TrackClient({ http, CancelToken: axios.CancelToken })
  
  return client
}
