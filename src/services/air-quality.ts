import { AIR_QUALITY_URL, fetchApi, buildParams } from "./api";
import type { AirQualityData, AirQualityHourly } from "@/types/air-quality";

interface AirQualityApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: {
    time: string[];
    pm2_5: number[];
    pm10: number[];
    ozone: number[];
    nitrogen_dioxide: number[];
    sulphur_dioxide: number[];
    carbon_monoxide: number[];
    european_aqi: number[];
    us_aqi: number[];
  };
}

function transformAirQuality(data: AirQualityApiResponse): AirQualityData {
  const hourly: AirQualityHourly = {
    time: data.hourly.time,
    pm2_5: data.hourly.pm2_5,
    pm10: data.hourly.pm10,
    ozone: data.hourly.ozone,
    nitrogenDioxide: data.hourly.nitrogen_dioxide,
    sulphurDioxide: data.hourly.sulphur_dioxide,
    carbonMonoxide: data.hourly.carbon_monoxide,
    europeanAqi: data.hourly.european_aqi,
    usAqi: data.hourly.us_aqi,
  };

  return {
    hourly,
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
  };
}

export async function getAirQuality(
  lat: number,
  lon: number,
): Promise<AirQualityData> {
  const params = buildParams({
    latitude: lat,
    longitude: lon,
    hourly:
      "pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide,european_aqi,us_aqi",
    timezone: "auto",
  });

  const data = await fetchApi<AirQualityApiResponse>(
    `${AIR_QUALITY_URL}/air-quality?${params}`,
  );
  return transformAirQuality(data);
}
