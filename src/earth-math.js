/* NOAA approximate solar equations; UTC only. No refraction or terrain model. */
(function (root) {
    'use strict';
    var rad = Math.PI / 180, latitude = 51.293 * rad, longitude = 4.494 * rad;
    function sun(date) {
        var year = date.getUTCFullYear(), start = Date.UTC(year, 0, 1);
        var days = (Date.UTC(year + 1, 0, 1) - start) / 86400000;
        var day = Math.floor((date.getTime() - start) / 86400000) + 1;
        var minutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
        var g = 2 * Math.PI / days * (day - 1 + (minutes / 60 - 12) / 24);
        var eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) -
            0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
        var dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) -
            0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) -
            0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
        var lon = (180 - (minutes + eq) / 4) * rad;
        var diff = lon - longitude, cd = Math.cos(dec), sd = Math.sin(dec);
        return { declination: dec / rad, longitude: ((lon / rad + 540) % 360) - 180,
            equationMinutes: eq, vector: [cd * Math.sin(diff),
                Math.cos(latitude) * sd - Math.sin(latitude) * cd * Math.cos(diff),
                Math.sin(latitude) * sd + Math.cos(latitude) * cd * Math.cos(diff)] };
    }
    // Artistic smoothstep over solar elevation -6..+6 degrees; horizon is dot=0.
    function blend(dot) {
        var edge = Math.sin(6 * rad), t = Math.max(0, Math.min(1, (dot + edge) / (2 * edge)));
        return t * t * (3 - 2 * t);
    }
    var api = { sun: sun, blend: blend, latitude: latitude / rad, longitude: longitude / rad };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.EarthSolar = api;
}(this));
