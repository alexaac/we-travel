import bbox from '@turf/bbox';

/**
 * @description Pan map to zipcode
 * @param {string} city - location name
 * @param {numeric} lat - latitude
 * @param {numeric} lon - longitude
 */

const panToLatLon = (map, coords) => {
  map.flyTo({ center: coords, zoom: 12 });
};

const showMarker = async (tripId, coords, maptilerApiKey) => {
  import(
    /* webpackPreload: true, webpackChunkName: 'MapLibreGL' */ 'maplibre-gl'
  )
    .then((maplibregl) => {
      /* Initialize MapLibre GL map */

      const maps = {};

      maps[`map-${tripId}`] = new maplibregl.Map({
        container: `map-${tripId}`,
        style: `https://api.maptiler.com/maps/streets/style.json?key=${maptilerApiKey}`,
        center: [45.84, 24.98], // starting position
        zoom: 5, // starting zoom
      });

      if (coords[0]) {
        const el = document.createElement('div');
        const width = 50;
        const height = 50;
        el.className = 'marker';
        el.style.backgroundImage = `url(https://mps-ph.s3.us-east-2.amazonaws.com/we/media/wemotoicon.svg)`;
        el.style.backgroundRepeat = 'no-repeat';
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = '100%';

        new maplibregl.Marker(el)
          .setLngLat(coords)
          .addTo(maps[`map-${tripId}`]);

        // Center map on marker
        panToLatLon(maps[`map-${tripId}`], coords);
      }
    })
    .catch((error) => {
      console.error('error', error);
    });
};

const showMarkers = (coords, maptilerApiKey) => {
  var features = [];
  Object.keys(coords).forEach((city) => {
    features.push(
      JSON.parse(
        `{"type": "Feature", "properties": { "description": "${city}"}, "geometry": {"type": "Point", "coordinates": [${coords[city][0]},${coords[city][1]}]}}`
      )
    );
  });

  import(
    /* webpackPreload: true, webpackChunkName: 'MapLibreGL' */ 'maplibre-gl'
  )
    .then((maplibregl) => {
      /* Initialize MapLibre GL map */

      const map = new maplibregl.Map({
        container: 'map-all',
        style: `https://api.maptiler.com/maps/streets/style.json?key=${maptilerApiKey}`,
        center: [45.84, 24.98],
        zoom: 3,
        pitch: 77,
        bearing: -39.2,
        hash: true,
      });

      map.on('load', function () {
        map.addSource('wms-test-source', {
          type: 'raster',
          tiles: [
            `https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=${maptilerApiKey}`,
          ],
          tileSize: 512,
          maxzoom: 17,
        });
        map.addLayer(
          {
            id: 'wms-test-layer',
            type: 'raster',
            source: 'wms-test-source',
            paint: {},
          },
          'aeroway_fill'
        );

        map.addControl(new maplibregl.NavigationControl());

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

      // Create a popup, but don't add it to the map yet.
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
      map.on('mouseenter', 'point', (e) => {
        map.getCanvas().style.cursor = 'pointer';

        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        popup.setLngLat(coordinates).setHTML(description).addTo(map);
      });

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'point', () => {
        map.getCanvas().style.cursor = '';
      });
    })
    .catch((error) => {
      console.error('error', error);
    });
};

export { showMarker, showMarkers };
