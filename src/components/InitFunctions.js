import Coef from '../features/Coef'
import { calSpCost } from './CustomFunctions'

const coefData = (uma, params) => ({
  motBonus: Coef.motivation.[uma.motivation],
  styleFitCoef: Coef.styleFit.[uma.fit.style],
  distFitCoef: Coef.distFit.[uma.fit.dist],
  surfaceFitCoef: Coef.surfaceFit.[uma.fit.surface],
  usingStyleCoef: Coef.usingStyle.[uma.usingStyle],
})

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

export const initStatus = (uma, params) => {
  const rawStatus = uma.status

  const { motBonus, styleFitCoef, distFitCoef, surfaceFitCoef, usingStyleCoef } = coefData(uma, params)
  const { statusCheck } = params.trackData


  // multiply by track status check
  const speedMutiplier = (() => {
    let multiplier = 1
    if (statusCheck.length > 0) {
      for (let sc of statusCheck) {
        let statusGetCheck = params.statusType[sc - 1]
        let statusToCheck = rawStatus.[statusGetCheck] * motBonus

        multiplier += Math.min(Math.ceil(statusToCheck / 300), 4) * .05
      }
    }
    return multiplier
  })()

  // ///////////
  // // todo: let users to set it by themselves
  const passiveSkillEffect =  {
    speed: 0,
    stamina: 0,
    power: 0,
    guts: 0,
    wisdom: 0,
  }

  const status =  {
    speed: (rawStatus.speed * motBonus * speedMutiplier + params.surfaceConstant.speed + passiveSkillEffect.speed).round(),
    stamina: (rawStatus.stamina * motBonus + passiveSkillEffect.stamina).round(),
    power: (rawStatus.power * motBonus + params.surfaceConstant.power + passiveSkillEffect.power).round(),
    guts: (rawStatus.guts * motBonus + passiveSkillEffect.guts).round(),
    wisdom: (rawStatus.wisdom * motBonus * styleFitCoef.wisdom + passiveSkillEffect.wisdom).round(),
  }

  return { rawStatus, status }
}

export const initUmaCond = (uma, params, {rawStatus, status}) => {
  const { motBonus, styleFitCoef, distFitCoef, surfaceFitCoef, usingStyleCoef } = coefData(uma, params)
	const {     
	        trackData,
	        surfaceConstant,
	        surfaceCoef,
	        baseV,
	        frameLength,
	        framesPerSec,
	        statusType
	      } = params
	const { 
	        dist, phaseLine, sectionDist, 
	        slopes, statusCheck
	      } = params.trackData

  const skillActRate = Math.max(100 - 90.0 / (rawStatus.wisdom * motBonus), 20)
  const temptRate = (6.5 / Math.log10(0.1 * status.wisdom + 1)) ** 2

  const v = (() => {

    ///////////
    // TODO: set random
    // let wisMod = {}
    // wisMod.max = ((uma.status.wisdom / 5500) * (Math.log10(uma.status.wisdom) - 1) * 0.01)
    // wisMod.min = (wisMod.max - .65)
    // wisMod.avg = (wisMod.max - .325)

    const wisMod = ((status.wisdom / 5500) * (Math.log10(status.wisdom) - 1) - .325) * .01
    const vCoef = usingStyleCoef.v
    const speedEffect = (((status.speed * 500) ** .5) * distFitCoef.v * .002)

    const tmp = {
      startdash: (baseV * 0.85).round(),
      phase0: (baseV * (vCoef.phase0 + wisMod)).round(),
      phase1: (baseV * (vCoef.phase1 + wisMod)).round(),
      phase2: (baseV * (vCoef.phase2 + wisMod) + speedEffect).round(),
      tiring: (baseV * 0.85 + ((status.guts * 200) ** .5) * .001).round(),
    }
    tmp.spurting = (((tmp.phase2 + baseV * .01) * 1.05 + speedEffect)).round()

    return tmp
  })()

  const a = (() => {
    const accCoef = ((500 * status.power) ** .5) 
                      * surfaceFitCoef.a
                      * distFitCoef.a
    const aCoef = usingStyleCoef.a
    return {
        acc: {
          normal:{
            phase0: (accCoef * 0.0006 * aCoef.phase0).round(),
            phase1: (accCoef * 0.0006 * aCoef.phase1).round(),
            phase2: (accCoef * 0.0006 * aCoef.phase2).round(),
            phase3: (accCoef * 0.0006 * aCoef.phase3).round(),
          },
          ascent: {
            phase0: (accCoef * 0.0004 * aCoef.phase0).round(),
            phase1: (accCoef * 0.0004 * aCoef.phase1).round(),
            phase2: (accCoef * 0.0004 * aCoef.phase2).round(),
            phase3: (accCoef * 0.0004 * aCoef.phase3).round(),
          },
        },
        dec: {
          tiring: -1.2,
          phase0: -0.8,
          phase1: -1.0, 
          phase2: -1.2,
        }
      }
  })()

  const spCostCoef = Object.assign({}, Coef.spConsume)
  spCostCoef.spurting = 1 + (200 / ((600 * status.guts) ** .5)).round()
  const spMax = (dist + 0.8 * status.stamina * usingStyleCoef.sp).round()

  const safeSpurtSp = calSpCost(v.spurting, (dist / 3) / v.spurting, spCostCoef.spurting, params)

  return { skillActRate, temptRate, v, a, spCostCoef, spMax, safeSpurtSp}

}

export const initUmaRandCond = temptRate => {
    // init tempt 2~9(true) or -1(false)
    const temptSection = (Math.random() * 100 < temptRate)
                        	? Math.floor(Math.random() * 8) + 1
                        	: -1
    return { temptSection }
}
// initFunctions.js