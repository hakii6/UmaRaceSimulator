export const calSpCost = (V, time, spCostCoef, params) => {
	const { surfaceCoef, baseV } = params
	const spVCoef = (V - baseV + 12.0) ** 2 / 144
	return (	
						20 
						* spCostCoef
						* spVCoef
						* surfaceCoef.sp
						* time
					).round()
}