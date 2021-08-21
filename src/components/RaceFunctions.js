import SysSetting from '../features/SysSetting'
import { calSpCost } from './CustomFunctions'

const { framesPerSec, frameLength } = SysSetting

const checkSpurt = (uma, v) => {
	const { sp, spCostCoef } = uma
	const spurtingTime = (uma.pos - 60) / v.spurting
  return sp >= calSpCost(v.spurting, spurtingTime, spCostCoef.spurting, uma)
}

export const checkMoveState = (frame, umaDetail) => {
	const { v } = umaDetail
	const preUma = frame.pre
  if (preUma.sp <= 0) {
    return 'tiring'
  }

  switch (preUma.moveState) {
    case 'startdash':
      if (preUma.momentV >= v.startdash) {
        return 'phase' + String(preUma.phase)
      }
      return 'startdash'
    case 'spurting':
      return 'spurting'
      // break
    default:
      if (preUma.section > 16 && checkSpurt(preUma, v)) {
        return 'spurting'
      }
      return 'phase' + String(preUma.phase)
  }
}

export const checkCostState = (frame, umaDetail) => {
	const preUma = frame.pre
	console.log(preUma.costState)
  switch (preUma.costState) {
    case 'tempt':
      frame.otherCond.temptCount++
      if (frame.otherCond.temptCount >= 12 * framesPerSec) {
        return 'normal'
      } else if (frame.otherCond.temptCount >= frame.otherCond.temptLast) {
        if (Math.random() * 100 < 55) {
        	return 'normal'
        } else {
          frame.otherCond.temptLast += 3 * framesPerSec
        }
      }
      break
    case 'normal':
      if (preUma.section === umaDetail.temptSection && !frame.otherCond.ifTempt) {
        frame.otherCond.temptLast = 3 * framesPerSec
        frame.otherCond.temptCount = 1
        frame.otherCond.ifTempt = true
        return 'tempt'
      } else if (preUma.section > 16) {
        return 'spurting'
      }
      break
    case 'spurting':
      break
    case 'slacking':
      // unknown right now
      break
    case 'descentMode':
      /////////////////////
      // todo
      break
  }
	return preUma.costState
}

export const movePreCal = (frame, umaDetail) => {
	const { v, a, spCostCoef } = umaDetail
	const { moveState, costState } = frame
	const preUma = frame.pre
	const preV = preUma.momentV
  let nextV, avgV
  let momentA
  let targetV = v.[moveState]

  // ===, <, >  3 condition
  if (preV === targetV) {
    nextV = targetV
    avgV = targetV
    momentA = 0
  } else {
    // set momentA
    momentA = preV > targetV ? a.acc.normal.['phase' + String(preUma.phase)] : a.dec.['phase' + String(preUma.phase)]

    // startdash bonus
    if (moveState === 'startdash') {
      momentA += 24.0
    }
    
    // cal nextV
    nextV = preV + momentA * frameLength

    // nextV can't be over targetV
    // check in the middle (means it would accelerate too much)
    if (targetV !== Math.min(preV, targetV, nextV) && targetV !== Math.max(preV, targetV, nextV)) {
      nextV = targetV
    }
    avgV = ((preV + nextV) / 2).round()
  }

  const spCost = calSpCost(avgV, frameLength, spCostCoef.[costState], umaDetail.params)

  frame = Object.assign(frame, {nextV, avgV, targetV, momentA, spCost})

}

export const moveResult = (frame, umaDetail) => {
	const { nextV, avgV, targetV, momentA, spCost } = frame
	const { pos, phase, section, sp } = frame.pre
	const { phaseLine, sectionDist } = umaDetail.params.trackData
	const { moveState, costState } = frame

  let movement = (avgV * frameLength).round()
  if (pos + movement >= umaDetail.dist) {
    movement = umaDetail.dist - pos
  }
  frame.result = {
  	pos: (pos + movement).round(),
  	sp: (sp - spCost).round(),
  	momentV: nextV,
	  phase: (pos >= phaseLine[phase]) ? phase + 1 : phase,
	  section: Math.ceil(pos / sectionDist) + 1,
	  moveState,
	  costState,
  }
}