import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

// import umasReducer from '../features/umas/umasSlice'
import racesReducer from '../features/races/racesSlice'
// import framesReducer from '../features/frames/framesSlice'

const reducer = combineReducers({
	// umas: umasReducer,
	races: racesReducer,
	// frames: framesReducer,
})

const store = configureStore({
	reducer,
})

export default store
