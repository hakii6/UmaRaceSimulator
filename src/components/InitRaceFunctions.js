import { calSpCost } from './CustomFunctions'

import SysSetting from '../features/SysSetting'
import Constant from '../features/Constant'
import Coef from '../features/Coef'
import CourseData from '../features/CourseData.json'

const { framesPerSec, frameLength, statusType } = SysSetting

const loadTrack = (option) => {
  const courseDetail = CourseData.[option.courseId]
  const trackDetail = courseDetail.courses.[option.trackId]
  const dist = trackDetail.distance
  const phaseLine = [
    (dist / 6.0).round(),
    (dist * 2.0 / 3).round(),
    (dist * 5.0 / 6).round(),
  ]
  const sectionDist = (dist / 24.0).round()
  return {
    courseName: courseDetail.name,
    raceName: trackDetail.name,
    dist,
    phaseLine,
    sectionDist,
    distType: String(trackDetail.distanceType),
    surface: String(trackDetail.surface),
    turn: String(trackDetail.turn),
    statusCheck: trackDetail.courseSetStatus,
    laneMax: trackDetail.laneMax,
    finishTimeMin: trackDetail.finishTimeMin,
    finishTimeMax: trackDetail.finishTimeMax,
    corners: trackDetail.corners,
    slopes: trackDetail.slopes,
  }
}

export const initRace = (option) => {
  const raceParams = Object.assign({}, loadTrack(option))
  const surfaceConstant = Constant.surface.[raceParams.surface].[option.groundCond]
  const surfaceCoef = Coef.surface.[raceParams.surface].[option.groundCond]

  const baseV = (22.0 - raceParams.dist / 1000.0).round()

  return Object.assign(raceParams, { surfaceConstant, surfaceCoef, baseV }, { framesPerSec, frameLength, statusType })
}

// const {     
//         trackData,
//         surfaceConstant,
//         surfaceCoef,
//         baseV,
//         frameLength,
//         framesPerSec,
//         statusType
//       } = useMemo(() => params, [])
// const { 
//         dist, phaseLine, sectionDist, 
//         slopes, statusCheck
//       } = useMemo(() => trackData, [])


