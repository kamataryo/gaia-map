const map = new window.geolonia.Map('#map')
map.once('load', () => {
	map.addSource('gaia', {
		type: 'vector',
		url: 'http://localhost:8080/data/gaia.json',
	})

	map.addLayer({
		id: 'gaia-layer',
		type: 'circle',
		source: 'gaia',
		// TODO: rebuild and use 'gaia'
		'source-layer': 'out',
		// TODO: pick the properties
		layout: {
			// 'text-layout': 'aaa'
		},
		paint: {
			'circle-color': '#000000',
			'circle-radius': 1
		}
	})

})