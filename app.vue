<template>
  <div class="flex flex-col h-svh bg-gray-900 text-gray-50">
    <nav class="flex p-4 items-center gap-4">
      <div v-if="cityData">
        <span>📍</span> {{ cityData.name }}, {{ cityData.country }}
      </div>
      <div>
        <CitySearch @select="getForecast" />
      </div>
    </nav>
    <main class="flex-grow px-4">
      <section
        class="flex gap-4 items-start flex-col md:flex-row items-stretch"
      >
        <template v-for="(day, i) in days" :key="day.dt">
          <DayCard
            v-if="i === 0 && current"
            :timestamp="current.dt"
            :icon-id="current.weather[0].icon"
            :temperature="current.temp"
            :active="activeDay === i"
            :is-current="true"
            :wind-speed="current.wind_speed"
            @click="activeDay = i"
          />
          <DayCard
            v-else
            :timestamp="day.dt"
            :icon-id="day.weather[0].icon"
            :temperature="day.temp.day"
            :active="activeDay === i"
            :is-current="false"
            :wind-speed="current.wind_speed"
            @click="activeDay = i"
          />
        </template>
      </section>
      {{ coords }}
    </main>
  </div>
</template>

<script setup lang="ts">
import type {
  CurrentWeatherData,
  DailyForecastData,
  LocationResponse,
} from "./utils/openWeatherMap";
import { useGeolocation, watchOnce } from "@vueuse/core";

const activeDay = ref(0);

const cityData = ref<LocationResponse[number]>();
const days = ref<DailyForecastData[]>([]);
const current = ref<CurrentWeatherData>();

async function getForecast(city: LocationResponse[number]) {
  const data = await $fetch("/api/forecast", {
    query: { lat: city.lat, lon: city.lon },
  });

  if (!data.daily || !data.current) return;

  cityData.value = city;
  days.value = data.daily;
  current.value = data.current;
}

const { coords, locatedAt, error, resume, pause } = useGeolocation();

watchOnce(coords, async (newCoords) => {
  if (newCoords.latitude !== Infinity) {
    const data = await $fetch("/api/forecast", {
      query: { lat: coords.value.latitude, lon: coords.value.longitude },
    });

    if (!data?.daily || !data?.current) return;

    days.value = data.daily;
    current.value = data.current;

    const city = await $fetch("/api/reverse", {
      query: { lat: coords.value.latitude, lon: coords.value.longitude },
    });

    cityData.value = city[0]; // TODO: fix typing
    console.log("city:", city);
  }
});

// const now = new Date().getTime()
// const isToday = current ? (current?.dt * 1000 - now) <= 1000 * 60 * 60 * 24 : false
</script>
