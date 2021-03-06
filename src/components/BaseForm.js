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
					<TextField id='speed' name='speed' value={ umaSetting.speed } type='number' label='ιεΊ¦' variant='outlined' onChange={handleSettingChange} />
					<TextField id='stamina' name='stamina' value={ umaSetting.stamina } type='number' label='θε' variant='outlined' onChange={handleSettingChange}/>
					<TextField id='power' name='power' value={ umaSetting.power } type='number' label='ει' variant='outlined' onChange={handleSettingChange}/>
					<TextField id='guts' name='guts' value={ umaSetting.guts } type='number' label='ζ Ήζ§' variant='outlined' onChange={handleSettingChange}/>
					<TextField id='wisdom' name='wisdom' value={ umaSetting.wisdom } type='number' label='ζΊζ§' variant='outlined' onChange={handleSettingChange}/>
				</FormControl>

				<FormControl required>
			        <InputLabel id='usingStyle-label'>θ·ζ³</InputLabel>
			        <Select native
			          labelId='usingStyle-label'
			          id='usingStyle'
			          name='usingStyle'
			          value={ option['usingStyle'] }
	  		          onChange={ handleOptionChange }
			        >
						<option value='1'>ι</option>
						<option value='2'>ε</option>
						<option value='3'>ε·?</option>
						<option value='4'>θΏ½</option>
			        </Select>
				</FormControl>

				<FormControl required>
			        <InputLabel id='motivation-label'>εΏζ</InputLabel>
			        <Select native
			          labelId='motivation-label'
			          id='motivation'
			          name='motivation'
			          value={ option['motivation'] }
	  		          onChange={ handleOptionChange }
			        >
						<option value='0'>η΅ε₯½θͺΏ</option>
						<option value='1'>ε₯½θͺΏ</option>
						<option value='2'>ζ?ι</option>
						<option value='3'>δΈθͺΏ</option>
						<option value='4'>η΅δΈθͺΏ</option>
			        </Select>
				</FormControl>

				<Button type="submit" variant="contained" color="primary" />
			</form>
			{ submit && <Simulator /> }
		</React.Fragment>
	)
}


export default BaseForm;