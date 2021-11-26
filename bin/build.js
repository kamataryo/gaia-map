
const csv = require('csv-parser')

const featureCollection = {
	type: 'FeatureCollection',
	features: [],
}

const ECL_ANG = 23.4
const ang2rad = (ang) => ang * 2 * Math.PI / 360
const rad2ang = (rad) => 360 * rad / (2 * Math.PI)

const sin = (ang) => Math.sin(ang2rad(ang))
const cos = (ang) => Math.cos(ang2rad(ang))
const atan = Math.atan
const asin = Math.asin

const ecl2eq = ([lng, lat]) => {
	const eq_lng = atan((- sin(lat) * sin(ECL_ANG) + cos(lat) * sin(lng) * cos(ECL_ANG)) / (cos(lat) * cos(ECL_ANG)))
	const eq_lat = asin(sin(lat) * cos(ECL_ANG) + cos(lat) * sin(lng) * sin(ECL_ANG))
	return [rad2ang(eq_lng), rad2ang(eq_lat)]
}

process.stdin
	.pipe(csv())
	.on('data', (chunk) => {
		const { ecl_lon, ecl_lat, phot_g_mean_mag } = chunk
		const ecl_coord = [parseFloat(ecl_lon),parseFloat(ecl_lat)];
		const eq_coord = ecl2eq(ecl_coord)
		featureCollection.features.push({
			type: 'Feature',
			properties: {
				m: phot_g_mean_mag,
			},
			geometry: {
				type: 'Point',
				coordinates: eq_coord,
			}
		})
	})
	.on('end', () => {
		process.stderr.write(`[success] processed ${featureCollection.features.length} stars.\n`)
		process.stdout.write(JSON.stringify(featureCollection) + '\n')
	})
