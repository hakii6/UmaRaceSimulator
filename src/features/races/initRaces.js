// import Setting from '../Setting'
import Constant from '../Constant'
import Coef from '../Coef'
import CourseData from '../CourseData.json'

const loadTrack = (track) => {
  const courseDetail = CourseData[track.courseId]
  const trackDetail = courseDetail.courses[track.trackId]
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

const initRaces = (option) => {
  const trackData = loadTrack(option)

  const framesPerSec = 15
  const statusType = ['speed', 'stamina', 'power', 'guts', 'wisdom']
  const frameLength = (1.0 / framesPerSec).round()
  const surfaceConstant = Constant.surface.[trackData.surface].[option.groundCond]

  const surfaceCoef = Coef.surface.[trackData.surface].[option.groundCond]

  const baseV = (22.0 - trackData.dist / 1000.0).round()

  return {
    trackData,
    surfaceConstant,
    surfaceCoef,
    baseV,
    frameLength,
    framesPerSec,
    statusType,
  }
}



export default initRaces

