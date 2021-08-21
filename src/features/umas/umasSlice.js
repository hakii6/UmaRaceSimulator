import { createSlice } from '@reduxjs/toolkit'

// const defaultUma = {
//   id: 0,
//   status:{
//     speed: '300',
//     stamina: '300',
//     power: '300',
//     guts: '300',
//     wisdom: '300',
//   },
//   fit: {
//     surface: {
//       1: 'A',
//       2: 'A',
//     },
//     dist: {
//       1: 'A',
//       2: 'A',
//       3: 'A',
//       4: 'A',
//     },
//     style: {
//       1: 'A',
//       2: 'A',
//       3: 'A',
//       4: 'A',
//     },
//   },
//   skill: {
//     passive: [],
//   },
// }

const initialState = []

const umasSlice = createSlice({
  name: 'umas',
  initialState,
  reducers: {
    create: (state, action) => [...state, Object.assign({}, action.payload)],
    reset: (state) => initialState,
  }
})

export const { create, reset } = umasSlice.actions

export default umasSlice.reducer