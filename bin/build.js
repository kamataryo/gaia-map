
const csv = require('csv-parser')

const featureCollection = {
	type: 'FeatureCollection',
	features: [],
}

process.stdin
	.pipe(csv())
	.on('data', (chunk) => {
		// TODO: 黄道座標系から赤道座標系に変換
		const { designation, ecl_lon, ecl_lat, phot_g_mean_mag } = chunk
		featureCollection.features.push({
			type: 'Feature',
			properties: {
				n: designation,
				m: phot_g_mean_mag,
			},
			geometry: {
				type: 'Point',
				coordinates: [parseFloat(ecl_lon),parseFloat(ecl_lat)],
			}
		})
	})
	.on('end', () => {
		process.stderr.write(`[success] processed ${featureCollection.features.length} stars.\n`)
		process.stdout.write(JSON.stringify(featureCollection) + '\n')
	})
