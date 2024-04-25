/**
 * This file is generated by chatGPT based on the openWeatherMap API docs.
 */

import { z } from "zod";

const WeatherConditionSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

const CurrentWeatherDataSchema = z.object({
  dt: z.number(),
  sunrise: z.number(),
  sunset: z.number(),
  temp: z.number(),
  feels_like: z.number(),
  pressure: z.number(),
  humidity: z.number(),
  dew_point: z.number(),
  uvi: z.number(),
  clouds: z.number(),
  visibility: z.number(),
  wind_speed: z.number(),
  wind_deg: z.number(),
  weather: z.array(WeatherConditionSchema),
  rain: z.record(z.string(), z.number()).optional(),
  snow: z.record(z.string(), z.number()).optional(),
});

const MinutelyForecastDataSchema = z.object({
  dt: z.number(),
  precipitation: z.number(),
});

const HourlyForecastDataSchema = z.object({
  dt: z.number(),
  temp: z.number(),
  feels_like: z.number(),
  pressure: z.number(),
  humidity: z.number(),
  dew_point: z.number(),
  uvi: z.number(),
  clouds: z.number(),
  visibility: z.number(),
  wind_speed: z.number(),
  wind_deg: z.number(),
  weather: z.array(WeatherConditionSchema),
  pop: z.number(),
  rain: z.record(z.string(), z.number()).optional(),
  snow: z.record(z.string(), z.number()).optional(),
});

const DailyForecastDataSchema = z.object({
  dt: z.number(),
  sunrise: z.number(),
  sunset: z.number(),
  moonrise: z.number(),
  moonset: z.number(),
  moon_phase: z.number(),
  temp: z.object({
    day: z.number(),
    min: z.number(),
    max: z.number(),
    night: z.number(),
    eve: z.number(),
    morn: z.number(),
  }),
  feels_like: z.object({
    day: z.number(),
    night: z.number(),
    eve: z.number(),
    morn: z.number(),
  }),
  pressure: z.number(),
  humidity: z.number(),
  dew_point: z.number(),
  wind_speed: z.number(),
  wind_deg: z.number(),
  weather: z.array(WeatherConditionSchema),
  clouds: z.number(),
  pop: z.number(),
  rain: z.number().optional(),
  snow: z.number().optional(),
  uvi: z.number(),
});

const WeatherAlertDataSchema = z.object({
  sender_name: z.string(),
  event: z.string(),
  start: z.number(),
  end: z.number(),
  description: z.string(),
  tags: z.array(z.string()),
});

// Define schema for local names
const localNamesSchema = z.record(z.string());

export const OneCallApiResponseSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  timezone: z.string(),
  timezone_offset: z.number(),
  current: CurrentWeatherDataSchema.optional(),
  minutely: z.array(MinutelyForecastDataSchema).optional(),
  hourly: z.array(HourlyForecastDataSchema).optional(),
  daily: z.array(DailyForecastDataSchema).optional(),
  alerts: z.array(WeatherAlertDataSchema).optional(),
});

// Define schema for a location
export const LocationResponseSchema = z.array(
  z.object({
    name: z.string(),
    local_names: localNamesSchema,
    lat: z.number(),
    lon: z.number(),
    country: z.string(),
    state: z.string().optional(),
  }),
);

export type LocationResponse = z.infer<typeof LocationResponseSchema>;
export type OneCallApiResponse = z.infer<typeof OneCallApiResponseSchema>;
export type DailyForecastData = z.infer<typeof DailyForecastDataSchema>;
export type CurrentWeatherData = z.infer<typeof CurrentWeatherDataSchema>;
