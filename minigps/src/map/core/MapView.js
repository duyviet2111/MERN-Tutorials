import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import './MapView.css';
import { SwitcherControl } from '../../map/switcher/switcher';
import { mapImages } from '../../map/core/preloadImages';
import usePersistedState, { savePersistedState } from '../../common/util/usePersistedState';
import useMapStyles from '../../map/core/useMapStyles';
import { useAttributePreference } from '../../common/util/preferences';

const element = document.createElement('div');
element.style.width = '100%';
element.style.height = '100%';
element.style.boxSizing = 'initial';

export const map = new maplibregl.Map({
  container: element,
  attributionControl: false,
});

let ready = false;
const readyListeners = new Set();

const addReadyListener = (listener) => {
  readyListeners.add(listener);
  listener(ready);
};

const removeReadyListener = (listener) => {
  readyListeners.delete(listener);
};

const updateReadyValue = (value) => {
  ready = value;
  readyListeners.forEach((listener) => listener(value));
};

const initMap = async () => {
  if (ready) return;
  if (!map.hasImage('background')) {
    Object.entries(mapImages).forEach(([key, value]) => {
      map.addImage(key, value, {
        pixelRatio: window.devicePixelRatio,
      });
    });
  }
  updateReadyValue(true);
};

map.addControl(new maplibregl.NavigationControl()); // thêm control như zoom và chỉnh hướng la bàn

//Code đoạn dưới thêm nút chuyển kiểu map sau đó dùng useEffect để render lại map
const switcher = new SwitcherControl(
  () => updateReadyValue(false),
  (styleId) => savePersistedState('selectedMapStyle', styleId),
  () => {
    map.once('styledata', () => {
      const waiting = () => {
        if (!map.loaded()) {
          setTimeout(waiting, 33);
        } else {
          initMap();
        }
      };
      waiting();
    });
  },
  );
  map.addControl(switcher);
  
  const MapView = ({children}) => {
    const containerEl = useRef();
    
    const [mapReady, setMapReady] = useState(false);

    const mapStyles = useMapStyles();
    const [activeMapStyles] = usePersistedState('activeMapStyles', ['googleRoad', 'googleSallite', 'osm']);
    const [defaultMapStyle] = usePersistedState('selectedMapStyle', 'googleRoad');
    const mapboxAccessToken = useAttributePreference('mapboxAccessToken');
    
    // console.log('viet', activeMapStyles);
    
    
    useEffect(() => {
      const filteredStyles = mapStyles.filter((style) => style.available && activeMapStyles.includes(style.id));
      switcher.updateStyles(filteredStyles, defaultMapStyle);
    }, [mapStyles, defaultMapStyle]);
    
  useEffect(() => {
    maplibregl.accessToken = mapboxAccessToken;
  }, [mapboxAccessToken]);
  
  useEffect(() => {
    const listener = (ready) => setMapReady(ready);
    addReadyListener(listener);
    return () => {
      removeReadyListener(listener);
    };
  }, []);
  
    useLayoutEffect(() => {
      const currentEl = containerEl.current;
      currentEl.appendChild(element);
      map.resize();
      return () => {
        currentEl.removeChild(element);
      };
    }, [containerEl]);
    
    return (
      <div className="map-wrap">
        <div ref={containerEl} className="map">
        {mapReady && children}
        </div>
      </div>
  );
}

export default MapView;

