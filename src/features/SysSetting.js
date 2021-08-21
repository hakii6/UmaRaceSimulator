const framePerSec = 15
const frameLength = Math.round(1.0 / framePerSec * 1000.0) / 1000.0
const statusType = ['speed', 'stamina', 'power', 'guts', 'wisdom']

const SysSetting = {
	framePerSec,
	frameLength,
	statusType,
}

export default SysSetting