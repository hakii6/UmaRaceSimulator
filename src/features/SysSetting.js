const framesPerSec = 15
const frameLength = Math.round(1.0 / framesPerSec * 1000.0) / 1000.0
const statusType = ['speed', 'stamina', 'power', 'guts', 'wisdom']

const SysSetting = {
	framesPerSec,
	frameLength,
	statusType,
}

export default SysSetting