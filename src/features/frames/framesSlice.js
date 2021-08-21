import { createSlice } from '@reduxjs/toolkit'

import setFrames from './setFrames'

const result = {}

const initialState = {
	framesCount: {
		
		// frames not seconds
		total: 0,
		inExhaust: 0,

		startdash: 0,
		0: 0,
		1: 0,
		2: 0,
		spurt: 0,
		
		consumeMode: {
			normal: 0,
			tempt: 0,
			descentMode: 0,
			slacking: 0,
		}

	},
	condRecord: {
		ifStartLate: false,
		ifTempt: false,
		inExhaust: false,
		isMaxSpurt: false,
	},
	framesDetail: [],
}



// framesCourse
// setStatus
const framesSlice = createSlice({
  name: 'frames',
  initialState,
  reducers: {
    simulate: (state, action) => Object.assign(
    	state, 
    	{
    		framesDetail: setFrames(action.payload, state)
    	}
    ),
    reset: (state) => initialState,
  },
})

export const { simulate, reset } = framesSlice.actions

export default framesSlice.reducer
