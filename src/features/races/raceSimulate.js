const raceSimulate = (umas, params) => {
	const {
					frameLength, framesPerSec,
					trackData, baseV,
					coef, constant
				} = params
	const { dist, phaseLine, slopes } = trackData

	const record = {

	}

	const calConsumeSp = (V, time = frameLength, consumeMode = 'normal', isSpurt = false) => {
		let spVCoef = (V - baseV + 12.0) ** 2 / 144
		return (20 
					* coef.spConsume.[consumeMode] 
					* spVCoef
					* coef.surface.sp
					* (1 + spurtSpCoef * isSpurt) 
					* time).round()
	}

	// cal before race
	const safeSpurtSp = calConsumeSp(v.spurt, (dist / 3) / v.spurt, 'normal', true)

	// race condition
	// init tempt
	// 2~9 or -1
	const temptSection = (Math.random() * 100 < temptRate)
												? Math.floor(Math.random() * 8) + 1
												: -1

	// initialRace

	// init value
	let frame

	let [pos, sp, currentV, phase, section, state] = [0, params.spMax, 3, '0', 1, 'startdash']
	let [targetV, deltaV, avgV, movement, consumeSp, consumeMode, currentA] = [v.startdash, 0, 0, 0, 0, 'normal', 0]
	const sectionDist = dist / 24

	let temptLast

	const checkSpurt = (remainDist) => {
		let spurtTime = (remainDist - 60) / v.spurt
		return sp >= calConsumeSp(v.spurt, spurtTime, 'normal', true)
	}
	const checkState = () => {
		if (sp <= 0) {
			state = 'inExhaust'
		} else if (state === 'startdash' && currentV >= v.startdash) {
			state = phase
		} else if (state !== 'spurt') {
			if (section > 16 && checkSpurt(dist - pos)){
				state = 'spurt'
			} else {
				state = phase
			}
		}
		if (section === temptSection && (!result.ifTempt)) {
			temptLast = 3 * framesPerSec
			result.ifTempt = true
			framesCount.consumeMode.tempt++
			consumeMode = 'tempt'
		} else if (consumeMode === 'tempt') {
			framesCount.consumeMode.tempt++

			if (framesCount.consumeMode.tempt >= 12 * framesPerSec) {
				consumeMode = 'normal'
			} else if (framesCount.consumeMode.tempt >= temptLast) {
				consumeMode = (Math.random() * 100 <= 55) ? 'normal' : consumeMode
				temptLast += 3 * framesPerSec
			}
		}

		framesCount.[state]++
	}

	const setStart = () => {
		phase = (pos >= phaseLine) ? String(Number(phase) + 1) : phase
		section = Math.ceil(pos / sectionDist) + 1

		frame.start = {
			pos,
			sp,
			currentV,
			phase,
			section,
		}
	}
	const setContent = () => {
		checkState()

		if (currentV < v.startdash) {
			targetV = v.startdash
			currentA = a.acc.[phase] + 24.0
		} else if (sp <= 0) {
			targetV = v.exhausted
			currentA = a.dec.tired
		} else {
			targetV = (state === 'spurt') ? v.spurt : v.[phase]
			currentA = (targetV >= currentV) ? a.acc.[phase] : a.dec.[phase]
		}

		if (currentV === targetV) {
			avgV = targetV
		} else {
			let nextV = currentV + currentA * frameLength

			// check in the middle (means it would accelerate to much)
			if (targetV !== Math.min(currentV, targetV, nextV) && targetV !== Math.max(currentV, targetV, nextV)) {
				nextV = targetV
			}
			avgV = ((currentV + nextV) / 2).round()
			currentV = nextV
		}
		consumeSp = calConsumeSp(avgV, frameLength, consumeMode, state === 'spurt')
		movement = (avgV * frameLength).round()
		if (pos + movement >= dist) {
			movement = dist - pos
		}

		frame.content = { 
			targetV, 
			deltaV, 
			avgV, 
			movement, 
			consumeSp,
			currentA 
		}
	}
	const setEnd = () => {
		pos = (pos + movement).round()
		sp = (sp - consumeSp).round()
		phase = (pos >= phaseLine) ? String(Number(phase) + 1) : phase
		section = Math.ceil(pos / sectionDist) + 1
		
		frame.end = {
			pos,
			currentV,
			sp,
			phase,
			section,
		}
	}


	let framesArr =[]

	while (pos < dist) {
		framesCount.total++
		frame = {}

		setStart()
		setContent()
		setEnd()

		framesArr.push(frame)
	}
	return framesArr

}

export default setFrames
