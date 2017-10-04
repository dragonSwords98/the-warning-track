// stats.js
const moment = require('moment')
const mongo = require('mongodb')

// const INITIAL_STATE = {
//   league: null,
//   _id: null,
//   ourTeam: null,
//   opposingTeam: '',
//   diamond: null,
//   dateTime: moment().format('YYYY-MM-DD'),
//   homeOrAway: 'Away', // or 'Home'
//   currentInning: 1, // to emphasis specific off/def lineups
//   lockedInnings: [],
//   currentFrame: 0, // 0 for top, 1 for bottom
//   ourActiveRoster: [],
//   ourBattingOrder: [],
//   ourFieldingLineup: [],
//   opposingBattingOrder: [],
//   statusGrid: [], // ours batting order
//   radialActive: false,
//   hitGrid: [], // ours hitting chart
//   scoresheet: [], // ours vs theirs
//   gameStatus: 0 // =pre-game, 1 = in-game, 2 = post-game
// }

const PLAYER_STATS_OBJECT_SINGLE_SEASON = {
  offense: {
    G: 0,
    AB: 0,
    R: 0,
    H: 0, // popups onto base = H - LD - GD - HR
    LD: 0, // line drives
    GD: 0, // grounders
    2B: 0,
    3B: 0,
    HR: 0,
    RBI: 0,
    BB: 0,
    SO: 0,
    PO: 0, // pop outs
    GO: 0, // ground outs
    SF: 0
  },
  defense: [
    {
      Pos: "C",
      IP: 0,
      Ch: 0,
      PO: 0,
      A: 0,
      E: 0
    }, {
      Pos: "P",
      IP: 0,
      Ch: 0,
      PO: 0,
      A: 0,
      E: 0
    }, {
      Pos: "1B",
      IP: 0,
      Ch: 0,
      PO: 0,
      A: 0,
      E: 0
    }, {
      Pos: "2B",
      IP: 0,
      Ch: 0,
      PO: 0,
      A: 0,
      E: 0
    }, {
      Pos: "SS",
      IP: 0,
      Ch: 0,
      PO: 0,
      A: 0,
      E: 0
    }, {
      Pos: "3B",
      IP: 0,
      Ch: 0,
      PO: 0,
      A: 0,
      E: 0
    }, {
      Pos: "LF",
      IP: 0,
      Ch: 0,
      PO: 0,
      A: 0,
      E: 0
    }, {
      Pos: "LR",
      IP: 0,
      Ch: 0,
      PO: 0,
      A: 0,
      E: 0
    }, {
      Pos: "CF",
      IP: 0,
      Ch: 0,
      PO: 0,
      A: 0,
      E: 0
    }, {
      Pos: "RR",
      IP: 0,
      Ch: 0,
      PO: 0,
      A: 0,
      E: 0
    }, {
      Pos: "RF",
      IP: 0,
      Ch: 0,
      PO: 0,
      A: 0,
      E: 0
    }
  ]
}

const TEAM_STATS_OBJECT_SINGLE_SEASON = {
  games: 0,
  wins: 0,
  losses: 0,
  ties: 0,
  biggestLead: 0,
  farthestDeficit: 0,
  currentStreak: 0,
  longestWinStreak: 0,
  longestLosingStreak: 0,
  mostRunsAllowed: 0,
  mostRunsScored: 0,
  shutouts: 0,
  shutoutsByOpponent: 0,
  walkoffWins: 0,
  walkoffLosses: 0
}

exports.commitGame = function (req, res) {
  const game = req.body

  // game.statusGrid

  // game.ourActiveRoster

  // game.ourBattingOrder

  // game.hitGrid

  // game.scoresheet

  // game.ourTeam

  // game.opposingTeam

  // game.league

  // game.gameStatus

  
}

const calculateTeamSeasonStatsAfterGame = function (game, TeamSeasonStats) {
  if (!TeamSeasonStats) TeamSeasonStats = Object.assign({}, TEAM_STATS_OBJECT_SINGLE_SEASON)

  TeamSeasonStats.games++

  let ourRuns = game.scoresheet.ours.runs.reduce((sum, value) => sum + value, 0)
  let theirRuns = game.scoresheet.theirs.runs.reduce((sum, value) => sum + value, 0)
  TeamSeasonStats.wins = (ourRuns > theirRuns) ? 1 : 0
  TeamSeasonStats.losses = (ourRuns < theirRuns) ? 1 : 0
  TeamSeasonStats.ties = (ourRuns === theirRuns) ? 1 : 0
  
  // TODO: find biggest lead and deficit in this game, if any, check with records
  // biggestLead: 0,
  // farthestDeficit: 0,

  // TODO: evaluate current streak, determine if recent win/loss/tie affects longest standing streaks
  // longestWinStreak: 0,
  // longestLosingStreak: 0,

  if (ourRuns > TeamSeasonStats.mostRunsScored) TeamSeasonStats.mostRunsScored = ourRuns
  if (theirRuns > TeamSeasonStats.mostRunsAllowed) TeamSeasonStats.mostRunsAllowed = theirRuns

  if (theirRuns <= 0) TeamSeasonStats.shutouts++
  if (ourRuns <= 0) TeamSeasonStats.shutoutsByOpponent++

  // TODO: evaluate score after second last inning, see if it was a walkoff
  // walkoffWins: 0,
  // walkoffLosses: 0

  return TeamSeasonStats
}

const calculatePlayerSeasonStatsAfterGame = function (game, PlayerSeasonStats) {
  if (!PlayerSeasonStats) PlayerSeasonStats = Object.assign({}, PLAYER_STATS_OBJECT_SINGLE_SEASON)

  PlayerSeasonStats.offense.G++
    // AB: 0,
    // R: 0,
    // H: 0,
    // 2B: 0,
    // 3B: 0,
    // HR: 0,
    // RBI: 0,
    // BB: 0,
    // SO: 0,
    // SF: 0
  
  // defense: [
  //   {
  //     Pos: "C",
  //     IP: 0,
  //     Ch: 0,
  //     PO: 0,
  //     A: 0,
  //     E: 0
  //   }, {
  //     Pos: "P",
  //     IP: 0,
  //     Ch: 0,
  //     PO: 0,
  //     A: 0,
  //     E: 0
  //   }, {
    // ...
  return PlayerSeasonStats
}