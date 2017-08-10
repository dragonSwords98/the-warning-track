'use strict'

import { objectToOption } from '@track/utils'

import {
  HIT_ORDERING,
  LANE_ORDERING,
  DEPTH_ORDERING
} from '@track/utils/constants'

const INITIAL_STATE = {
  hitTypeOptions: [],
  laneOptions: [],
  depthOptions: []
}

export default function opponentReducers (state = INITIAL_STATE, action) {
  if (action.type === 'game.opponent/init') {
    state = Object.assign({}, state, INITIAL_STATE)
    state.hitTypeOptions = objectToOption(HIT_ORDERING)
    state.laneOptions = objectToOption(LANE_ORDERING)
    state.depthOptions = objectToOption(DEPTH_ORDERING)
  }
  if (action.type === 'game.opponent/destroy') {
    state = Object.assign({}, state, INITIAL_STATE)
  }
  return state
}