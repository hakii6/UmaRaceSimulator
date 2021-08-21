import React, { useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import * as umasActions from '../features/umas/umasSlice'
import * as raceActions from '../features/race/raceSlice'

import TextField from '@material-ui/core/TextField'

import Button from '@material-ui/core/Button'

import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

// import Result from './Result'
import Simulator from './Simulator'

const defaultUma = {
  id: 0,
  status:{
    speed: 1200,
    stamina: 1200,
    power: 1200,
    guts: 300,
    wisdom: 300,
  },
  fit: {
    surface: {
      1: 'A',
      2: 'A',
    },
    dist: {
      1: 'A',
      2: 'A',
      3: 'A',
      4: 'A',
    },
    style: {
      1: 'A',
      2: 'A',
      3: 'A',
      4: 'A',
    },
  },
  skill: {
    passive: [],
  },
}

const BaseForm = () => {

	// const uma = useSelector(state => state.umas.status)
	const submit = useSelector(state => state.race.submit)
	const dispatch = useDispatch()

	const [ umaSetting, setUmaSetting ] = useState(defaultUma.status)
	const [ option, setOption ] = useState({
		usingStyle: '1',
		motivation: '1',

		groundCond: '1',
		weather: '1',
		season: '1',
	})
	const handleSettingChange = (e) => {
		setUmaSetting({...umaSetting, [e.target.name]: e.target.value })
	}

	const handleOptionChange = (e) => {
		setOption({...option, [e.target.name]: e.target.value })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		dispatch(umasActions.create(umaSetting))
		dispatch(raceActions.init(umaSetting))
	}

	return (
		<React.Fragment>
			<form onSubmit={handleSubmit}>
				<FormControl required>
					<TextField id='speed' name='speed' value={ umaSetting.speed } type='number' label='速度' variant='outlined' onChange={handleSettingChange} />
					<TextField id='stamina' name='stamina' value={ umaSetting.stamina } type='number' label='耐力' variant='outlined' onChange={handleSettingChange}/>
					<TextField id='power' name='power' value={ umaSetting.power } type='number' label='力量' variant='outlined' onChange={handleSettingChange}/>
					<TextField id='guts' name='guts' value={ umaSetting.guts } type='number' label='根性' variant='outlined' onChange={handleSettingChange}/>
					<TextField id='wisdom' name='wisdom' value={ umaSetting.wisdom } type='number' label='智慧' variant='outlined' onChange={handleSettingChange}/>
				</FormControl>

				<FormControl required>
			        <InputLabel id='usingStyle-label'>跑法</InputLabel>
			        <Select native
			          labelId='usingStyle-label'
			          id='usingStyle'
			          name='usingStyle'
			          value={ option['usingStyle'] }
	  		          onChange={ handleOptionChange }
			        >
						<option value='1'>逃</option>
						<option value='2'>先</option>
						<option value='3'>差</option>
						<option value='4'>追</option>
			        </Select>
				</FormControl>

				<FormControl required>
			        <InputLabel id='motivation-label'>心情</InputLabel>
			        <Select native
			          labelId='motivation-label'
			          id='motivation'
			          name='motivation'
			          value={ option['motivation'] }
	  		          onChange={ handleOptionChange }
			        >
						<option value='0'>絕好調</option>
						<option value='1'>好調</option>
						<option value='2'>普通</option>
						<option value='3'>不調</option>
						<option value='4'>絕不調</option>
			        </Select>
				</FormControl>

				<Button type="submit" variant="contained" color="primary" />
			</form>
			{ submit && <Simulator /> }
		</React.Fragment>
	)
}


export default BaseForm;