import { createSlice } from '@reduxjs/toolkit'

import initRaces from './initRaces'

const initialState = {
	track: {
    courseId: '10009',
    trackId: '10906',
    statusCheck: [],
    groundCond: '1',
    weather: '1',
    season: '1',
	},
  umasCount: 0,
  umasData: [],
  umasReady: [],
  momentDetail: {momentFrame: -1, umasState:[], umasUpdateCount:0},
	params: {},
	result: {
    momentFrame: 0,
    frames: [],
    umas: [],
	},
  framesElapsed: 0
}


// raceCourse
// setStatus
const racesSlice = createSlice({
  name: 'races',
  initialState, 
  reducers: {
    init: (state, action) => {
      state.params = initRaces(action.payload)
    },
    addUma: (state, action) => {
      state.umasCount++
      state.umasData = state.umasData.concat(action.payload)
      state.umasReady = state.umasReady.concat({})
      state.result.umas = state.result.umas.concat([[]])
    },
    ready: (state, action) => {
      let umaInit = action.payload
      let tmp = {
        umaId: umaInit.umaId,
        index: umaInit.index,
        pos: 0,
        momentV: 3,
        sp: umaInit.sp,
        phase: 0,
        section: 1,
        moveState: 'startdash', 
        costState: 'normal',
        otherCond: [],
      }
      state.umasReady[umaInit.index] = tmp

      // if all umas are ready
      if (state.umasReady.length === state.umasCount) {
        state.momentDetail = {
          momentFrame: 0,
          umasState: state.umasReady,
          umasUpdateCount: 0
        }
      }
    },
    updateFrame: (state, action) => {
      const umaFrame = action.payload

      // update the momentFrame
      state.momentDetail.umasState[umaFrame.index] = umaFrame.result
      state.momentDetail.umasUpdateCount++

      // record the result
      state.result.umas[umaFrame.index] = state.result.umas[umaFrame.index].concat(umaFrame)
      
      // if all umaState have updated, then push to next frame
      if (state.momentDetail.umasUpdateCount === state.umasCount) {
        state.momentDetail.momentFrame++
        state.momentDetail.umasUpdateCount = 0
      }
    },
    reset: (state) => initialState,
  },
})

export const { init, addUma, ready, updateFrame, reset } = racesSlice.actions

export default racesSlice.reducer

