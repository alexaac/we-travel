/**
 * @description Pan map to zipcode
 * @param {string} city - location name
 * @param {numeric} lat - latitude
 * @param {numeric} lon - longitude
 */
const panToLatLon = async (map, mapboxData) => {
  try {
    if (mapboxData.features[0]) {
      const coords = mapboxData.features[0].geometry.coordinates;

      var el = document.createElement('div');
      el.className = 'marker';
      var marker = new mapboxgl.Marker(el).setLngLat(coords).addTo(map);

      map.flyTo({ center: coords, zoom: 12 });
    }
  } catch (error) {
    console.error('error', error);
  }
};

export { panToLatLon };
