import type { OneCallApiResponse } from "@/utils/openWeatherMap";
import { OneCallApiResponseSchema } from "@/utils/openWeatherMap";
import { z } from "zod";

const querySchema = z.object({
  lat: z.string(),
  lon: z.string(),
});

export default defineEventHandler(async (event) => {
  const { owmApiSecret } = useRuntimeConfig(event);
  const validatedQuery = await getValidatedQuery(event, (body) =>
    querySchema.safeParse(body),
  );
  if (validatedQuery.success === false) {
    console.error(validatedQuery.error);
    return validatedQuery.error;
  }
  const { lat, lon } = validatedQuery.data;

  const excludeParts = "minutely,hourly,alerts";
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${excludeParts}&appid=${owmApiSecret}&units=metric`;

  try {
    const response = await $fetch(url);
    const validatedResponse: OneCallApiResponse =
      OneCallApiResponseSchema.parse(response);
    return validatedResponse;
  } catch (error) {
    console.error(error);
  }
});
