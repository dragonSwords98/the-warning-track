/* BATTING STATUSES */

export const OUT_STATUS = {
  name: 'OUT',
  label: 'Out',
  color: 'black'
}
export const BENCH_STATUS = {
  name: 'BENCH',
  label: 'Bench',
  color: 'grey'
}
export const IN_THE_HOLE_STATUS = {
  name: 'IN_THE_HOLE',
  label: 'Hole',
  color: 'yellow'
}
export const ON_DECK_STATUS = {
  name: 'ON_DECK',
  label: 'Deck',
  color: 'orange'
}
export const AT_BAT_STATUS = {
  name: 'AT_BAT',
  label: 'Bat',
  color: 'red'
}
export const FIRST_STATUS = {
  name: 'FIRST',
  label: 'First',
  color: 'olive'
}
export const SECOND_STATUS = {
  name: 'SECOND',
  label: 'Second',
  color: 'green'
}
export const THIRD_STATUS = {
  name: 'THIRD',
  label: 'Third',
  color: 'teal'
}
export const HOME_STATUS = {
  name: 'HOME',
  label: 'Home',
  color: 'blue'
}

export const STATUS_ORDERING = [
  BENCH_STATUS,
  IN_THE_HOLE_STATUS,
  ON_DECK_STATUS,
  AT_BAT_STATUS,
  FIRST_STATUS,
  SECOND_STATUS,
  THIRD_STATUS,
  HOME_STATUS,
  OUT_STATUS
]

/* HITTING TYPES */

export const SINGLE_HIT = {
  name: 'SINGLE',
  label: 'Single',
  _id: 'Single',
  color: 'olive',
  disabled: true
}

export const DOUBLE_HIT = {
  name: 'DOUBLE',
  label: 'Double',
  _id: 'Double',
  color: 'green',
  disabled: true
}

export const TRIPLE_HIT = {
  name: 'TRIPLE',
  label: 'Triple',
  _id: 'Triple',
  color: 'teal',
  disabled: true
}

export const HOME_RUN_HIT = {
  name: 'HOME RUN',
  label: 'HR',
  _id: 'HR',
  color: 'blue',
  disabled: true
}

export const GROUND_OUT = {
  name: 'GROUNDOUT',
  label: 'Ground',
  _id: 'Ground',
  color: 'pink',
  disabled: true
}

export const FLY_OUT = {
  name: 'FLYOUT',
  label: 'Fly',
  _id: 'Fly',
  color: 'purple',
  disabled: true
}

export const POP_OUT = {
  name: 'POPOUT',
  label: 'Pop',
  _id: 'Pop',
  color: 'yellow',
  disabled: true
}

export const FOUL_OUT = {
  name: 'FOULOUT',
  label: 'Foul',
  _id: 'Foul',
  color: 'orange',
  disabled: true
}

export const STRIKE_OUT = {
  name: 'STRIKEOUT',
  label: 'K',
  _id: 'K',
  color: 'red',
  disabled: true
}

export const HIT_ORDERING = [
  SINGLE_HIT,
  DOUBLE_HIT,
  TRIPLE_HIT,
  HOME_RUN_HIT,
  GROUND_OUT,
  FLY_OUT,
  POP_OUT,
  FOUL_OUT,
  STRIKE_OUT
]

/* LANES */
export const FOUL_BACK_LANE = {
  name: 'Foul Back',
  _id: 'FB'
}

export const FOUL_LEFT_LANE = {
  name: 'Foul Left',
  _id: 'FL'
}

export const LEFT_LEFT_FIELD_LANE = {
  name: 'Left Left Field',
  _id: 'LLF'
}

export const LEFT_FIELD_LANE = {
  name: 'Left Field',
  _id: 'LF'
}

export const CENTER_LEFT_FIELD_LANE = {
  name: 'Center Left Field',
  _id: 'CLF'
}

export const CENTER_FIELD_LANE = {
  name: 'Center Field',
  _id: 'CF'
}

export const CENTER_RIGHT_FIELD_LANE = {
  name: 'Center Right Field',
  _id: 'CRF'
}

export const RIGHT_FIELD_LANE = {
  name: 'Right Field',
  _id: 'RF'
}

export const RIGHT_RIGHT_FIELD_LANE = {
  name: 'Right Right Field',
  _id: 'RRF'
}

export const FOUL_RIGHT_LANE = {
  name: 'Foul Right',
  _id: 'FR'
}

export const LANE_ORDERING = [
  FOUL_BACK_LANE,
  FOUL_LEFT_LANE,
  LEFT_LEFT_FIELD_LANE,
  LEFT_FIELD_LANE,
  CENTER_LEFT_FIELD_LANE,
  CENTER_FIELD_LANE,
  CENTER_RIGHT_FIELD_LANE,
  RIGHT_FIELD_LANE,
  RIGHT_RIGHT_FIELD_LANE,
  FOUL_RIGHT_LANE
]

/* DEPTHS */
export const ZERO_DEPTH = {
  name: 'Zero',
  _id: 'Zero',
  min: -1,
  max: 0
}

export const DINKER_DEPTH = {
  name: 'Dinker',
  _id: 'Dinker',
  min: 1,
  max: 15
}

export const PITCHERS_DEPTH = {
  name: 'Pitcher Line',
  _id: 'Pitcher Line',
  min: 16,
  max: 25
}

export const RUNNERS_DEPTH = {
  name: 'Baserunner Line',
  _id: 'Baserunner Line',
  min: 26,
  max: 40
}

export const CROSSFIRE_DEPTH = {
  name: 'Crossfire',
  _id: 'Crossfire',
  min: 41,
  max: 70
}

export const SHALLOW_DEPTH = {
  name: 'Shallow',
  _id: 'Shallow',
  min: 71,
  max: 140
}

export const ONE_FIVE_ZERO_DEPTH = {
  name: '150',
  _id: '150',
  min: 141,
  max: 160
}

export const ONE_SEVEN_ZERO_DEPTH = {
  name: '170',
  _id: '170',
  min: 161,
  max: 180
}

export const AVERAGE_DEPTH = {
  name: 'Avg',
  _id: 'Avg',
  min: 181,
  max: 200
}

export const DEEP_DEPTH = {
  name: 'Deep',
  _id: 'Deep',
  min: 201,
  max: 230
}

export const WARNING_TRACK_DEPTH = {
  name: 'Track',
  _id: 'Track',
  min: 231,
  max: 260
}

export const HOMERUN_DEPTH = {
  name: 'HR',
  _id: 'HR',
  min: 261,
  max: 280
}

export const OVERPOWERED_DEPTH = {
  name: 'OP',
  _id: 'OP',
  min: 280,
  max: 500 // CR: Not humanly possible to go over 500 ft in a fair-game-situation
}

export const DEPTH_ORDERING = [
  ZERO_DEPTH,
  DINKER_DEPTH,
  PITCHERS_DEPTH,
  RUNNERS_DEPTH,
  CROSSFIRE_DEPTH,
  SHALLOW_DEPTH,
  ONE_FIVE_ZERO_DEPTH,
  ONE_SEVEN_ZERO_DEPTH,
  AVERAGE_DEPTH,
  DEEP_DEPTH,
  WARNING_TRACK_DEPTH,
  HOMERUN_DEPTH,
  OVERPOWERED_DEPTH
]

/* MISC. */

export const GENERIC_OPPOSING_BATTER = {
  name: '',
  number: 0,
  atBats: []
}

export const GENERIC_ATBAT = {
  type: null,
  depth: null,
  lane: null
}

export const MINIMAL_BATTERS_COUNT = 7 // CR: should be a league rule, no?
export const REALISTIC_MAX_BATTERS_COUNT = 30
// export const STANDARD_COED_RULE = 'MMF' // CR: By default, we ignore coed, because what if the league is mens or womens?
