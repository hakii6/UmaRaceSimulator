import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import * as racesActions from '../features/races/racesSlice'

import Coef from '../features/Coef'

import { calSpCost } from './CustomFunctions'
import { initStatus, initUmaInRace, initUmaCond, initUmaRandCond } from './InitFunctions'
import { checkMoveState, checkCostState, movePreCal, moveResult } from './RaceFunctions'

const UmaState = ({uma, params, index}) => {
  const { momentFrame, umasState } = useSelector(state => ({
      momentFrame: state.races.momentDetail.momentFrame, 
      umasState: state.races.momentDetail.umasState
    }),
    (o, n) => o.momentFrame == n.momentFrame
  )

	const dispatch = useDispatch()

  const [ umaDetail, setUmaDetail ] = useState({})

  // set ready
  useEffect(() => {

    // uma status after modifyng
    const { rawStatus, status } = initStatus(uma, params)

    // race evaluate (fixed)
    const { skillActRate, temptRate, spCostCoef, spMax, v, a, safeSpurtSp } = initUmaCond(uma, params, {rawStatus, status})

    // race evaluate (random)
    const { temptSection } = initUmaRandCond(temptRate)

    dispatch(racesActions.ready({
      umaId: uma.umaId,
      index: index, 
      sp: spMax,
    }))

    setUmaDetail({
      umaId: uma.umaId,
      params,
      index,
      rawStatus, status,
      skillActRate, temptRate, spCostCoef, spMax, v, a, safeSpurtSp,
      temptSection,
    })
  }, [uma])

  // console.log(umaDetail)

  const momentResult = useMemo(() => {

    if (momentFrame === -1) {
      return {}
    }
    let frame = {}
    let preUma = Object.assign({}, umasState[index])
    frame.index = index
    frame.pre = preUma



    frame.otherCond = preUma.otherCond
    // let { pos, sp, momentV, phase, section, otherCond } = preUma
    frame.moveState = checkMoveState(frame, umaDetail)
    frame.costState = checkCostState(frame, umaDetail)

    movePreCal(frame, umaDetail)
    moveResult(frame, umaDetail)
    console.log(frame)
    dispatch(racesActions.updateFrame(frame))
    return frame
  }, [momentFrame])
  
	return (
		<React.Fragment>
{/*      { console.log(momentResult) }
*/}		</React.Fragment>
	)
}


export default UmaState;







  // // // base params: uma status after modifyng
  // const { rawStatus, status } = useMemo(() => initStatus(uma, params), [uma])

  // // // race evaluate
  // const { skillActRate, temptRate, spCostCoef, spMax, v, a, safeSpurtSp } = useMemo(() => 
  //   initUmaCond(uma, params, {rawStatus, status})
  //   , [uma])

  // // cal before race start
  // const { temptSection } = useMemo(() => initUmaRandCond(temptRate), [uma])
