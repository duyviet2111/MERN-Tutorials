import { useTranslation } from '../../common/components/LocalizationProvider';

const styleCustom = ({ tiles, minZoom, maxZoom, attribution }) => ({
  version: 8,
  sources: {
    custom: {
      type: 'raster',
      tiles,
      attribution,
      tileSize: 256,
      minzoom: minZoom,
      maxzoom: maxZoom,
    },
  },
  glyphs: 'https://cdn.traccar.com/map/fonts/{fontstack}/{range}.pbf',
  layers: [{
    id: 'custom',
    type: 'raster',
    source: 'custom',
  }],
});

export default () => {
  const t = useTranslation();

  return [
    {
      id: 'googleRoad',
      title: t('mapGoogleRoad'),
      style: styleCustom({
        tiles: ['https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga'],
        maxZoom: 17,
      }),
      available: true,
    },
    {
      id: 'googleSallite',
      title: t('mapGoogleSallite'),
      style: styleCustom({
        tiles: ['https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga'],
        maxZoom: 17,
      }),
      available: true,
    },
    {
      id: 'osm',
      title: t('mapOsm'),
      style: styleCustom({
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        maxZoom: 19,
        attribution: '© <a target="_top" rel="noopener" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
      available: true,
    },
  ];
};
