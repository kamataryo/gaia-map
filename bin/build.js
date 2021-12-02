const csv = require('csv-parser')

// 定数と計算用ユーティリティ
const ECL_INC = 23.4
const ang2rad = (ang) => ang * Math.PI / 180
const rad2ang = (rad) => 180 * rad / Math.PI
const sin = (ang) => Math.sin(ang2rad(ang))
const cos = (ang) => Math.cos(ang2rad(ang))
const atan = (rad) => rad2ang(Math.atan(rad))
const asin = (rad) => rad2ang(Math.asin(rad))

// 黄道 ->　赤道の座標変換
const ecl2eq = ([lng, lat]) => {
	const eq_lng = atan(cos(lng) * cos(lat) / (cos(ECL_INC) * cos(lng) * sin(lat) - sin(ECL_INC) * sin(lng)))
	const eq_lat = asin(sin(ECL_INC) * cos(lng) * sin(lat) + cos(ECL_INC) * sin(lng))
	return [eq_lng, eq_lat]
}

process.stdin
  .pipe(csv())
  .on('data', (chunk) => {
    const { ecl_lon, ecl_lat, phot_g_mean_mag } = chunk;
    const ecl_coord = [parseFloat(ecl_lon), parseFloat(ecl_lat)]
    const m = parseFloat(phot_g_mean_mag)
    if(!ecl_coord[0] || !ecl_coord[1] || !m) {
      return
    }
    try {
      const eq_coord = ecl2eq(ecl_coord)
      const feature = {
          type: 'Feature',
          properties: { m },
          geometry: { type: 'Point', coordinates: eq_coord },
      }
      process.stdout.write(JSON.stringify(feature) + '\n')
    } catch (error) {
      process.stderr.write(`[failure] ${JSON.stringify(error)}\n`)
    }
  })

