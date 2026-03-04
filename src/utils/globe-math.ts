import * as THREE from "three";

export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export function getSunPosition(): THREE.Vector3 {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const declination =
    -23.44 * Math.cos((360 / 365) * (dayOfYear + 10) * (Math.PI / 180));
  const hourAngle =
    ((now.getUTCHours() + now.getUTCMinutes() / 60) / 24) * 360 - 180;

  const sunLat = declination;
  const sunLon = -hourAngle;

  return latLonToVector3(sunLat, sunLon, 10);
}

export function temperatureToColor(temp: number): string {
  if (temp <= -20) return "#1e3a5f";
  if (temp <= -10) return "#2563eb";
  if (temp <= 0) return "#38bdf8";
  if (temp <= 10) return "#34d399";
  if (temp <= 20) return "#a3e635";
  if (temp <= 30) return "#facc15";
  if (temp <= 35) return "#f97316";
  return "#ef4444";
}
