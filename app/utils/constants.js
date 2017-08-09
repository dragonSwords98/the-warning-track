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
  color: 'olive'
}

export const DOUBLE_HIT = {
  name: 'DOUBLE',
  label: 'Double',
  color: 'green'
}

export const TRIPLE_HIT = {
  name: 'TRIPLE',
  label: 'Triple',
  color: 'teal'
}

export const HOME_RUN_HIT = {
  name: 'HOME RUN',
  label: 'HR',
  color: 'blue'
}

export const GROUND_OUT = {
  name: 'GROUNDOUT',
  label: 'Ground',
  color: 'pink'
}

export const FLY_OUT = {
  name: 'FLYOUT',
  label: 'Fly',
  color: 'purple'
}

export const POP_OUT = {
  name: 'POPOUT',
  label: 'Pop',
  color: 'yellow'
}

export const FOUL_OUT = {
  name: 'FOULOUT',
  label: 'Foul',
  color: 'orange'
}

export const STRIKE_OUT = {
  name: 'STRIKEOUT',
  label: 'K',
  color: 'red'
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

/* MISC. */

export const GENERIC_OPPOSING_BATTER = {
  name: '',
  number: 0,
  hits: [],
  attempts: []
}

export const MINIMAL_BATTERS_COUNT = 8 // CR: should be a league rule, no?
export const REALISTIC_MAX_BATTERS_COUNT = 30