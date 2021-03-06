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
// export const IN_THE_HOLE_STATUS = {
//   name: 'IN_THE_HOLE',
//   label: 'Hole',
//   color: 'yellow'
// }
// export const ON_DECK_STATUS = {
//   name: 'ON_DECK',
//   label: 'Deck',
//   color: 'orange'
// }
export const AT_BAT_STATUS = {
  name: 'AT_BAT',
  label: 'Bat',
  color: 'red'
}
export const FIRST_STATUS = {
  name: 'FIRST',
  label: '1st',
  color: 'olive'
}
export const SECOND_STATUS = {
  name: 'SECOND',
  label: '2nd',
  color: 'green'
}
export const THIRD_STATUS = {
  name: 'THIRD',
  label: '3rd',
  color: 'teal'
}
export const HOME_STATUS = {
  name: 'HOME',
  label: 'Home',
  color: 'blue'
}

export const STATUS_ORDERING = [
  // IN_THE_HOLE_STATUS,
  // ON_DECK_STATUS,
  OUT_STATUS,
  HOME_STATUS,
  THIRD_STATUS,
  SECOND_STATUS,
  FIRST_STATUS,
  AT_BAT_STATUS,
  BENCH_STATUS
]

/* HITTING TYPES */

export const WALK = {
  name: 'WALK',
  label: 'W',
  _id: 'Walk',
  color: 'black',
  disabled: true
}

export const SINGLE_HIT = {
  name: 'SINGLE',
  label: '1B',
  _id: '1B',
  color: 'olive',
  disabled: true
}

export const DOUBLE_HIT = {
  name: 'DOUBLE',
  label: '2B',
  _id: '2B',
  color: 'green',
  disabled: true
}

export const TRIPLE_HIT = {
  name: 'TRIPLE',
  label: '3B',
  _id: '3B',
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

export const SAC_FLY = {
  name: 'SACFLY',
  label: 'SF',
  _id: 'Sac',
  color: 'purple',
  disabled: true
}

export const GROUND_OUT = {
  name: 'GROUNDOUT',
  label: 'GO',
  _id: 'Grd',
  color: 'pink',
  disabled: true
}

export const POP_OUT = {
  name: 'POPOUT',
  label: 'PO',
  _id: 'Pop',
  color: 'yellow',
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
  WALK,
  SINGLE_HIT,
  DOUBLE_HIT,
  TRIPLE_HIT,
  HOME_RUN_HIT,
  SAC_FLY,
  GROUND_OUT,
  POP_OUT,
  STRIKE_OUT
]

/* LANES */
export const FOUL_BACK_LANE = {
  name: 'Foul Back',
  label: 'FB',
  _id: 'FB',
  color: 'red'
}

export const FOUL_LEFT_LANE = {
  name: 'Foul Left',
  label: 'FL',
  _id: 'FL',
  color: 'orange'
}

export const LEFT_LEFT_FIELD_LANE = {
  name: 'Left Left Field',
  label: 'LLF',
  _id: 'LLF',
  color: 'yellow'
}

export const LEFT_FIELD_LANE = {
  name: 'Left Field',
  label: 'LF',
  _id: 'LF',
  color: 'olive'
}

export const CENTER_LEFT_FIELD_LANE = {
  name: 'Center Left Field',
  label: 'CLF',
  _id: 'CLF',
  color: 'green'
}

export const CENTER_FIELD_LANE = {
  name: 'Center Field',
  label: 'CF',
  _id: 'CF',
  color: 'teal'
}

export const CENTER_RIGHT_FIELD_LANE = {
  name: 'Center Right Field',
  label: 'CRF',
  _id: 'CRF',
  color: 'blue'
}

export const RIGHT_FIELD_LANE = {
  name: 'Right Field',
  label: 'RF',
  _id: 'RF',
  color: 'violet'
}

export const RIGHT_RIGHT_FIELD_LANE = {
  name: 'Right Right Field',
  label: 'RRF',
  _id: 'RRF',
  color: 'purple'
}

export const FOUL_RIGHT_LANE = {
  name: 'Foul Right',
  label: 'FR',
  _id: 'FR',
  color: 'pink'
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
  max: 0,
  color: 'orange'
}

export const DINKER_DEPTH = {
  name: 'Dinker',
  _id: 'Dinker',
  min: 1,
  max: 25,
  color: 'orange'
}

export const INFIELD_DEPTH = {
  name: 'Infield',
  _id: 'Infield',
  min: 26,
  max: 40,
  color: 'yellow'
}

export const CROSSFIRE_DEPTH = {
  name: 'Crossfire',
  _id: 'Crossfire',
  min: 41,
  max: 70,
  color: 'yellow'
}

export const SHALLOW_DEPTH = {
  name: 'Shallow',
  _id: 'Shallow',
  min: 71,
  max: 140,
  color: 'olive'
}

export const ONE_FIVE_ZERO_DEPTH = {
  name: '150',
  _id: '150',
  min: 141,
  max: 170,
  color: 'olive'
}

export const FAIR_DEPTH = {
  name: '180',
  _id: '180',
  min: 171,
  max: 200,
  color: 'green'
}

export const DEEP_DEPTH = {
  name: 'Deep',
  _id: 'Deep',
  min: 201,
  max: 230,
  color: 'green'
}

export const WARNING_TRACK_DEPTH = {
  name: 'Track',
  _id: 'Track',
  min: 231,
  max: 270,
  color: 'teal'
}

export const HOMERUN_DEPTH = {
  name: 'HR',
  _id: 'HR',
  min: 271,
  max: 300,
  color: 'teal'
}

export const DEPTH_ORDERING = [
  HOMERUN_DEPTH,
  WARNING_TRACK_DEPTH,
  DEEP_DEPTH,
  FAIR_DEPTH,
  ONE_FIVE_ZERO_DEPTH,
  SHALLOW_DEPTH,
  CROSSFIRE_DEPTH,
  INFIELD_DEPTH,
  DINKER_DEPTH,
  ZERO_DEPTH
]

/* Circular Select Layers for Offense Table */
export const CIRCULAR_SELECT_LAYERS = {
  ourTeamHitReport: {
    layer: 1,
    name: 'hit',
    left: 80,
    top: 10,
    deg: 240,
    adjust: 2.4,
    fraction: 1/2,
    border: "solid #eceff1 3px",
    ordering: HIT_ORDERING
  },
  opponentHitReport: {
    layer: 1,
    name: 'opposingHit',
    left: 80,
    top: 10,
    deg: 240,
    adjust: 2.4,
    fraction: 1/2,
    border: "solid #eceff1 3px",
    ordering: HIT_ORDERING
  },
  ourTeamLocation: {
    layer: 2,
    name: 'status',
    left: 50,
    top: 80,
    deg: 200,
    adjust: 2.075,
    fraction: 1/3,
    border: "solid #263238 3px",
    ordering: STATUS_ORDERING
  },
  opponentLanes: {
    layer: 2,
    name: 'opposingLane',
    left: 50,
    top: 80,
    deg: 200,
    adjust: 2.075,
    fraction: 1/3,
    border: "solid #263238 3px",
    ordering: LANE_ORDERING
  }
}

/* Form Defaults */
export const ALL_HANDS = [
  { key: 'Right', value: 'Right', text: 'Right' },
  { key: 'Left', value: 'Left', text: 'Left' },
  { key: 'Switch', value: 'Switch', text: 'Switch' }
]
export const ALL_POSITIONS = [
  { key: 'P', value: 'P', text: 'P' },
  { key: 'C', value: 'C', text: 'C' },
  { key: '1B', value: '1B', text: '1B' },
  { key: '2B', value: '2B', text: '2B' },
  { key: 'SS', value: 'SS', text: 'SS' },
  { key: '3B', value: '3B', text: '3B' },
  { key: 'LF', value: 'LF', text: 'LF' },
  { key: 'LR', value: 'LR', text: 'LR' },
  { key: 'CF', value: 'CF', text: 'CF' },
  { key: 'RR', value: 'RR', text: 'RR' },
  { key: 'RF', value: 'RF', text: 'RF' }
]

/* MISC. */

export const GENERIC_OPPOSING_BATTER = {
  name: '',
  number: 0
}

export const GENERIC_ATBAT = {
  type: null,
  depth: null,
  lane: null
}

export const MINIMAL_BATTERS_COUNT = 7 // Always use league rules whenever applicable
export const REALISTIC_MAX_BATTERS_COUNT = 30
export const REALISTIC_MAX_AT_BATS_PER_GAME = 10
// export const STANDARD_COED_RULE = 'MMF' // CR: By default, we ignore coed, because what if the league is mens or womens?
