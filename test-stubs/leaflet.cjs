/* Leaflet stub, used ONLY by the test bundle.
   Leaflet touches document and Element.prototype at import time and
   needs real layout to initialise a map, neither of which jsdom
   provides usefully. The tests here cover roofing logic, not Leaflet's
   own behaviour, so the map is stubbed out and the smoke test can keep
   proving the app renders. The real build imports the real library. */
function noop() { return chain; }
const chain = new Proxy(function () { return chain; }, {
  get(_, prop) {
    if (prop === "then") return undefined;         // not a promise
    if (prop === "toGeoJSON") return () => ({ type: "Feature", geometry: { type: "Polygon", coordinates: [[]] } });
    return chain;
  },
  apply() { return chain; },
});
module.exports = {
  __esModule: true,
  default: chain,
  map: noop, tileLayer: noop, FeatureGroup: function () { return chain; },
  marker: noop, polygon: noop,
};
