export interface AirQualityHourly {
  time: string[];
  pm2_5: number[];
  pm10: number[];
  ozone: number[];
  nitrogenDioxide: number[];
  sulphurDioxide: number[];
  carbonMonoxide: number[];
  europeanAqi: number[];
  usAqi: number[];
}

export interface AirQualityData {
  hourly: AirQualityHourly;
  latitude: number;
  longitude: number;
  timezone: string;
}

export type AqiStandard = "european" | "us";

export interface AqiLevel {
  label: string;
  color: string;
  min: number;
  max: number;
  description: string;
}

export const US_AQI_LEVELS: AqiLevel[] = [
  {
    label: "Good",
    color: "#22c55e",
    min: 0,
    max: 50,
    description: "Air quality is satisfactory",
  },
  {
    label: "Moderate",
    color: "#eab308",
    min: 51,
    max: 100,
    description: "Acceptable air quality",
  },
  {
    label: "Unhealthy for Sensitive",
    color: "#f97316",
    min: 101,
    max: 150,
    description: "Sensitive groups may be affected",
  },
  {
    label: "Unhealthy",
    color: "#ef4444",
    min: 151,
    max: 200,
    description: "Everyone may experience effects",
  },
  {
    label: "Very Unhealthy",
    color: "#a855f7",
    min: 201,
    max: 300,
    description: "Health alert",
  },
  {
    label: "Hazardous",
    color: "#991b1b",
    min: 301,
    max: 500,
    description: "Emergency conditions",
  },
];

export const EU_AQI_LEVELS: AqiLevel[] = [
  {
    label: "Good",
    color: "#22c55e",
    min: 0,
    max: 20,
    description: "Air quality is satisfactory",
  },
  {
    label: "Fair",
    color: "#84cc16",
    min: 21,
    max: 40,
    description: "Acceptable air quality",
  },
  {
    label: "Moderate",
    color: "#eab308",
    min: 41,
    max: 60,
    description: "Moderate air quality",
  },
  {
    label: "Poor",
    color: "#f97316",
    min: 61,
    max: 80,
    description: "Poor air quality",
  },
  {
    label: "Very Poor",
    color: "#ef4444",
    min: 81,
    max: 100,
    description: "Very poor air quality",
  },
  {
    label: "Extremely Poor",
    color: "#991b1b",
    min: 101,
    max: 500,
    description: "Extremely poor",
  },
];
