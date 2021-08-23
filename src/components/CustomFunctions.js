export const calSpCost = (V, time, spCostCoef, raceParams) => {
	const { surfaceCoef, baseV } = raceParams
	const spVCoef = (V - baseV + 12.0) ** 2 / 144
	return (	
						20 
						* spCostCoef
						* spVCoef
						* surfaceCoef.sp
						* time
					).round()
}