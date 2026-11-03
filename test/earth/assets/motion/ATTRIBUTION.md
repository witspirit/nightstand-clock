# Pre-rendered longitude views — TASK-2.3

`view-00.jpg` through `view-11.jpg`: twelve 512 × 512 JPEGs, **292,646 bytes total**. These are offline-generated orthographic globe views, not satellite photographs from different times.

Source: NASA Goddard Space Flight Center, **The Blue Marble: Land Surface, Ocean Color and Sea Ice**, February 8, 2002. Image by Reto Stöckli (land surface, shallow water, clouds); enhancements by Robert Simmon (ocean color, compositing, 3D globes, animation). Data/technical support: MODIS Land Group; MODIS Science Data Support Team; MODIS Atmosphere Group; MODIS Ocean Group. Additional data: USGS EROS Data Center (topography), USGS Terrestrial Remote Sensing Flagstaff Field Center (Antarctica), Defense Meteorological Satellite Program (city lights). These are dataset-wide credits; this selected texture contains no cloud or city-light layer.

- [NASA dataset description and complete credits](https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/).
- Original texture URL: https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg (unavailable during this work).
- Retrieved 2026-11-03 via the [Wikimedia mirror and license page](https://commons.wikimedia.org/wiki/File:Land_ocean_ice_2048.jpg).
- Exact mirror image: https://upload.wikimedia.org/wikipedia/commons/c/cd/Land_ocean_ice_2048.jpg
- Downloaded original: 2048 × 1024 JPEG, 266,599 bytes. SHA-256: `d4dc80a6ef571939d0abe04a9bed3d3d1e6cd63e59514be1c5e43a6b069e6f1e`.
- The mirror offers CC BY-SA 3.0 and GFDL. These transformed JPEG frames are distributed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), with credit to NASA/GSFC, Reto Stöckli and Robert Simmon, and mirror uploader Brosen. The image license applies to these assets; it does not relicense the clock source code. No endorsement is implied.

Transformations: `../../render-frames.py` samples the equirectangular map onto a zero-latitude orthographic sphere, centers at longitude -90° plus 30° per frame, applies neutral radial limb darkening (45% at the limb, 100% at the center), supersamples at 1024², downsamples to 512² and encodes optimized JPEG quality 80. Corners are black and clipped by the experiment. No axial tilt, current clouds, city lights or astronomical sunlight is calculated. Runtime lighting adds a separately labelled illustrative CSS gradient. Runtime opacity defaults to 28%.

Reproduce with Python 3, NumPy and Pillow (used here: Pillow 12.3.0):

```sh
python3 test/earth/render-frames.py /path/to/land_ocean_ice_2048.jpg /tmp/earth-frames
```

The source texture and Python dependencies are not loaded by the browser. The original still has separate [provenance](../ATTRIBUTION.md).
