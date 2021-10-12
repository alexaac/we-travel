import bbox from '@turf/bbox';
import * as mapboxgl from 'mapbox-gl'; //version 1.13.2 BSD-3-Clause
/**
 * @description Pan map to zipcode
 * @param {string} city - location name
 * @param {numeric} lat - latitude
 * @param {numeric} lon - longitude
 */

const panToLatLon = (map, coords) => {
  map.flyTo({ center: coords, zoom: 12 });
};

const showMarker = async (tripId, coords, mapboxApiKey) => {
  try {
    /* Initialize MapBox map */
    mapboxgl.accessToken = mapboxApiKey;

    const maps = {};

    maps[`map-${tripId}`] = new mapboxgl.Map({
      container: `map-${tripId}`,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [45.84, 24.98], // starting position
      zoom: 5, // starting zoom
    });

    if (coords[0]) {
      const el = document.createElement('div');
      const width = 50;
      const height = 50;
      el.className = 'marker';
      el.style.backgroundImage = `url(../media/wemotoicon.svg)`;
      el.style.backgroundRepeat = 'no-repeat';
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = '100%';

      new mapboxgl.Marker(el).setLngLat(coords).addTo(maps[`map-${tripId}`]);

      // Center map on marker
      panToLatLon(maps[`map-${tripId}`], coords);
    }
  } catch (error) {
    console.error('error', error);
  }
};

const showMarkers = (coords, mapboxApiKey) => {
  /* Initialize MapBox map */
  mapboxgl.accessToken = mapboxApiKey;

  const map = new mapboxgl.Map({
    container: 'map-all',
    style: 'mapbox://styles/mapbox/satellite-streets-v11',
    center: [45.84, 24.98],
    zoom: 3,
    pitch: 77,
    bearing: -39.2,
    hash: true,
  });

  var features = [];
  Object.keys(coords).forEach((city) => {
    features.push(
      JSON.parse(
        `{"type": "Feature", "geometry": {"type": "Point", "coordinates": [${coords[city][0]},${coords[city][1]}]}}`
      )
    );
  });

  map.on('load', function () {
    map.addSource('mapbox-dem', {
      type: 'raster-dem',
      url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
      tileSize: 512,
      maxzoom: 17,
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.addSource('point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: features,
      },
    });

    map.addLayer({
      id: 'point',
      type: 'circle',
      source: 'point',
      paint: {
        'circle-color': '#f61708',
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });
  });

  // Center map on bounding box for all markers
  var bounds = bbox({ type: 'FeatureCollection', features });
  map.fitBounds(bounds, { padding: 100 });

  // Center the map on the coordinates of any clicked circle from the 'circle' layer.
  map.on('click', 'point', (e) => {
    map.flyTo({
      center: e.features[0].geometry.coordinates,
    });
  });

  // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
  map.on('mouseenter', 'point', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'point', () => {
    map.getCanvas().style.cursor = '';
  });
};

export { showMarker, showMarkers };
