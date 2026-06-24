/**
 * Lightweight built-in geocoding so the app works with zero external APIs.
 * Selecting a city fills lat/lng for distance + map. Extend freely.
 */
export interface City {
  name: string;
  lat: number;
  lng: number;
}

export const CITIES: City[] = [
  { name: "Accra, Ghana", lat: 5.6037, lng: -0.187 },
  { name: "Kumasi, Ghana", lat: 6.6885, lng: -1.6244 },
  { name: "Tamale, Ghana", lat: 9.4008, lng: -0.8393 },
  { name: "Takoradi, Ghana", lat: 4.8845, lng: -1.7554 },
  { name: "Cape Coast, Ghana", lat: 5.1053, lng: -1.2466 },
  { name: "Tema, Ghana", lat: 5.6698, lng: -0.0166 },
  { name: "Lagos, Nigeria", lat: 6.5244, lng: 3.3792 },
  { name: "Abuja, Nigeria", lat: 9.0765, lng: 7.3986 },
  { name: "Abidjan, Côte d'Ivoire", lat: 5.36, lng: -4.0083 },
  { name: "Lomé, Togo", lat: 6.1725, lng: 1.2314 },
  { name: "Nairobi, Kenya", lat: -1.2921, lng: 36.8219 },
  { name: "Johannesburg, South Africa", lat: -26.2041, lng: 28.0473 },
  { name: "London, UK", lat: 51.5072, lng: -0.1276 },
  { name: "New York, USA", lat: 40.7128, lng: -74.006 },
  { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708 },
  { name: "Guangzhou, China", lat: 23.1291, lng: 113.2644 },
];

export function findCity(name: string): City | undefined {
  return CITIES.find((c) => c.name === name);
}
