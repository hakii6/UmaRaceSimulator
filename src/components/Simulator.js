import React, { useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import * as racesActions from '../features/races/racesSlice'

import UmaState from './UmaState'
const Simulator = () => {


  const umasData = useSelector(state => state.races.umasData)
  const params = useSelector(state => state.races.params)
	const dispatch = useDispatch()
	if (umasData.length === 0 && Object.keys(params).length === 0) {

		const uma = {
			umaId: 'skyblade',
			status: {
				speed: 1140,
				stamina: 678,
				power: 657,
				guts: 436,
				wisdom: 955,
			},
			usingStyle: '1',
			fit: {
		    surface: 'A',
		    dist: 'S',
		    style: 'A',
		  },
	  	motivation: '1',
	  }

		// const uma2 = {
		// 	umaId: 'chu',
		// 	status: {
		// 		speed: 1193,
		// 		stamina: 789,
		// 		power: 759,
		// 		guts: 365,
		// 		wisdom: 1057,
		// 	},
		// 	usingStyle: '1',
		// 	fit: {
		// 	  surface: 'A',
		// 	  dist: 'S',
		// 	  style: 'A',
		// 	},
		// 	motivation: '1',
	 //  }
	  const options = {
	    courseId: '10009',
	    trackId: '10906',
	    statusCheck: [],
	    groundCond: '1',
	    weather: '1',
	    season: '1',
		}

		dispatch(racesActions.init(options))
		// dispatch(racesActions.addUma([uma, uma2]))
		dispatch(racesActions.addUma([uma]))

	}

	return (
		<React.Fragment>
			{ umasData.length > 0 && umasData.map((uma, index) => <UmaState key={uma.umaId} index={index} uma={uma} params={params}/> )}
		</React.Fragment>
	)
}





export default Simulator;