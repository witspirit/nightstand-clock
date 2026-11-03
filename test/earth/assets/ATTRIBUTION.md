# Earth imagery provenance

Bundled asset: `blue-marble-512.jpg` (512 × 512 JPEG, 76,205 bytes).

- Source: [NASA Science — Blue marble](https://science.nasa.gov/resource/blue-marble/), visualization dated August 2, 2002; resource page dated April 13, 2011.
- Exact downloaded image: https://assets.science.nasa.gov/dynamicimage/assets/science/esd/climate/2023/12/ImageWall5_1920x1200-80.jpg
- Retrieved: 2026-11-03. Downloaded file was a 1280 × 800 JPEG (164,440 bytes), despite the dimensions in its URL.
- Credit: NASA Goddard Space Flight Center. Image by Reto Stöckli (land surface, shallow water, clouds); enhancements by Robert Simmon (ocean color, compositing, 3D globes, animation).
- Additional source credit: MODIS Land Group, MODIS Science Data Support Team, MODIS Atmosphere Group, MODIS Ocean Group; USGS EROS Data Center (topography), USGS Terrestrial Remote Sensing Flagstaff Field Center (Antarctica), Defense Meteorological Satellite Program (city lights). Full caption/credit is on the source page.
- Usage reference: [NASA imagery guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/). This personal informational experiment acknowledges the source and implies no NASA endorsement. The selected resource credits NASA and its contributors; it does not identify a separate third-party copyright notice.

Transformation, using ImageMagick 7:

```sh
magick ImageWall5_1920x1200-80.jpg -crop 800x800+240+0 +repage -resize 512x512 -quality 85 blue-marble-512.jpg
```

The centered square removes black side margins; the experiment clips the remaining corner pixels with a circular border radius and applies opacity at runtime. No generated artwork, retouching, new lighting, or upscaled alternative is bundled. The historical composite has fixed clouds and baked-in shading; it is not current weather or a calculated solar terminator. All composition screenshots in `../previews/` contain this same credited image.
