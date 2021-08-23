import React, { useState, useCallback } from 'react'

// import { useSelector, useDispatch } from 'react-redux'
// import * as racesActions from '../features/races/racesSlice'

import RaceSimulator from './RaceSimulator'
const RaceForm = () => {

	const [ simulateCount, setSimulateCount ] = useState(50)
	const [ result, setResult ] = useState([])
	const [ count, setCount ] = useState(0)

	const resultAdd = useCallback(res => {
		console.log(res)
		setResult(result.concat(res))
		setCount(count + 1)
	}, [count])

	const avgResult = () => {
		let avg = 0
		console.log(result)
		for (let res of result) {
			avg += res
		}
		// console.log(avg)
		avg /= count
		return <div>{avg}</div>

	}
	const umas = [
		{
			// umaId: 'skyblade',
			// status: {
			// 	speed: 1140,
			// 	stamina: 678,
			// 	power: 657,
			// 	guts: 436,
			// 	wisdom: 955,
			// },
			umaId: 'skyblade2',
			status: {
				speed: 1140,
				stamina: 678,
				power: 900,
				guts: 436,
				wisdom: 1000,
			},
			usingStyle: '1',
			fit: {
		    surface: 'A',
		    dist: 'S',
		    style: 'A',
		  },
	  	motivation: '1'
	  }, 
	  {
	  	umaId: 'chu',
			status: {
				speed: 1193,
				stamina: 789,
				power: 759,
				guts: 365,
				wisdom: 1057,
			},
			usingStyle: '1',
			fit: {
			  surface: 'A',
			  dist: 'S',
			  style: 'A',
			},
			motivation: '1',
		}
	]

  const option = {
    courseId: '10009',
    trackId: '10906',
    groundCond: '1',
    weather: '1',
    season: '1',
	}

	return (
		<React.Fragment>
			{ count < simulateCount &&
				<RaceSimulator count={count} resultAdd={resultAdd} umas={umas} option={option} />
			} {
				count >= simulateCount && avgResult()
			}

		</React.Fragment>
	)
}





export default RaceForm;