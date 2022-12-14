import { useTheme } from "@mui/styles";
import maplibregl from "maplibre-gl";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { map } from "./core/MapView";

const MapRoutePath = ({ positions }) => {
  const id = "replay";

  const theme = useTheme();
  // Màu cho đường đi
  const reportColor = useSelector((state) => {
    const position = positions.find(() => true);
    if (position) {
      const attributes = state.devices.items[position.deviceId]?.attributes;
      // console.log("Check attributes", attributes, position);

      if (attributes) {
        const color = attributes["web.reportColor"];
        // console.log("Type attribute", attributes);
        if (color) {
          return color;
        }
      }
    }
    return theme.palette.colors.geometry;
  });

  useEffect(() => {
    map.addSource(id, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
    });
    // render đường đi
    // map.addLayer({
    //   source: id,
    //   id,
    //   type: "line",
    //   layout: {
    //     "line-join": "round",
    //     "line-cap": "round",
    //   },
    //   paint: {
    //     "line-color": ["get", "color"],
    //     "line-width": 2,
    //   },
    // });
    map.addLayer({
      source: id,
      id,
      type: "circle",
      paint: {
        "circle-color": ["get", "color"],
        "circle-radius": 5,
        "circle-pitch-alignment": "viewport",
      },
    });
    return () => {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, []);

  useEffect(() => {
    const coordinates = positions.map((item) => [
      item.longitude,
      item.latitude,
    ]);
    map.getSource(id).setData({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates,
      },
      properties: {
        color: reportColor,
      },
    });
    if (coordinates.length) {
      const bounds = coordinates.reduce(
        (bounds, item) => bounds.extend(item),
        new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
      );
      const canvas = map.getCanvas();
      map.fitBounds(bounds, {
        padding: Math.min(canvas.width, canvas.height) * 0.1,
        duration: 0,
      });
    }
  }, [positions, reportColor]);

  return null;
};

export default MapRoutePath;
