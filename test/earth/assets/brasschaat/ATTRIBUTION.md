# Brasschaat day/night assets — TASK-2.5

Retrieved 2026-11-04. These are deterministic projections of historical NASA maps, not live observations or NASA-authored rendered outputs. No AI-generated imagery is used.

| Asset | Source and exact download | Historical period and credit |
| --- | --- | --- |
| `day.jpg` | [Blue Marble Next Generation base maps](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/), [September JPEG](https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-base/september/world.200409.3x5400x2700.jpg), 5400 × 2700 | September 2004 monthly composite. NASA Earth Observatory; Blue Marble Next Generation by Reto Stöckli. |
| `night.jpg` | [Earth at Night flat maps](https://science.nasa.gov/earth/earth-observatory/earth-at-night/maps/), [2016 color JPEG](https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/144000/144898/BlackMarble_2016_01deg.jpg), 3600 × 1800 | 2016 cloud-free night-light composite. NASA Earth Observatory images by Joshua Stevens, using Suomi NPP VIIRS data from Miguel Román, NASA GSFC; see [source explanation and credit](https://science.nasa.gov/earth/earth-observatory/night-light-maps-open-up-new-applications-90008/). |

## Usage

[NASA media guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) permit factual educational/informational uses, including personal web pages, with source acknowledgment and no implied endorsement. Third-party copyrighted material requires its own permission; neither selected map identifies a separate third-party copyright restriction. NASA identifiers/logos have separate restrictions and are not included here. This documents the applicable source terms, rather than assigning a Creative Commons license to these assets. Keep credits with redistributions. Existing original still has its own [attribution](../ATTRIBUTION.md).

## Reproduce and align

Download the two exact URLs above to files named `world.200409.3x5400x2700.jpg` and `BlackMarble_2016_01deg.jpg`, then from repository root (Python 3, NumPy and Pillow):

```sh
python3 test/earth/render-brasschaat.py /tmp/world.200409.3x5400x2700.jpg /tmp/BlackMarble_2016_01deg.jpg /tmp/brasschaat-assets
```

Inputs are north-up equirectangular maps spanning 180°W..180°E and 90°N..90°S. Both use the same inverse orthographic transform centered at approximate Brasschaat town coordinates **51.293°N, 4.494°E**. North is up, east is right, no roll. For normalized screen east `x`, north `y`, and `z=sqrt(1-x²-y²)`, latitude is `asin(y cos(lat0)+z sin(lat0))`; longitude is `lon0+atan2(x,z cos(lat0)-y sin(lat0))`. Thus Brasschaat is the center ray, rather than the equator; the north pole appears above it.

Each map is bilinearly sampled with horizontal seam wrap and vertical clamp, on the same 1024² grid. Both receive identical artistic limb falloff `0.65+0.35z`; outside the disc is black. Downsample to 512² with Lanczos, JPEG quality 85, optimized. No separate geographical shift, crop, contrast, city-light painting, color boosting, clouds or baked solar shading is applied. The coastal and city geography aligns at this resolution, subject to original composites, resampling and JPEG losses; these are not contemporaneous maps. The day map stays September 2004 even for winter previews; only illumination changes seasonally. Night ocean/land tones belong to the supplied color visualization, not an absolute radiance measurement.

Only the reduced projections are bundled. The browser never requests full maps or a per-location rendering service.

## Integrity and bytes

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| Original day download | 1709729 | `ed72e87674861f72e2a6e5df52f0cc6bf3df1edd9b862664cf18ac423e2e9e0e` |
| Original night download | 779638 | `d87de751a264e4f8ff69c68de5dab9606daee87a6f15ae743c93200743bd7ec1` |
| `day.jpg` | 42781 | `8a3f754f838558d996fad22c1ed96ac1354ef45b61502b298edc90a33a11040d` |
| `night.jpg` | 29326 | `6681267bd820b9b30d07a9921fe17e3adbfa21c115973bb31add9fa88fa69b0c` |

Encoding reproducibility depends on the Pillow/JPEG version (generated with Pillow 12.3.0). The input checksums are authoritative if NASA replaces downloads.
