const STORE_ADDRESS = "Rua das Flores, Saens Pena, Tijuca, Rio de Janeiro, RJ, Brasil";
const BASE_FEE = 15;

type Coordinates = { lat: number; lon: number };

async function geocode(address: string): Promise<Coordinates> {
  const params = new URLSearchParams({ q: address, format: "jsonv2", limit: "1", countrycodes: "br" });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { "User-Agent": "PatyFlores/1.0 (delivery quote)" },
  });
  if (!response.ok) throw new Error("Não foi possível localizar o endereço para calcular o frete.");
  const results = (await response.json()) as Array<{ lat: string; lon: string }>;
  if (!results[0]) throw new Error("Endereço não encontrado. Confira os dados e o CEP.");
  return { lat: Number(results[0].lat), lon: Number(results[0].lon) };
}

function distanceInMeters(from: Coordinates, to: Coordinates) {
  const earthRadius = 6371000;
  const latitudeDelta = ((to.lat - from.lat) * Math.PI) / 180;
  const longitudeDelta = ((to.lon - from.lon) * Math.PI) / 180;
  const latitudeFrom = (from.lat * Math.PI) / 180;
  const latitudeTo = (to.lat * Math.PI) / 180;
  const value = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(latitudeFrom) * Math.cos(latitudeTo) * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * earthRadius * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export async function calculateShipping(address: string, coordinates?: Coordinates | null) {
  const store = await geocode(STORE_ADDRESS);
  const destination = coordinates ?? await geocode(address);
  const distanceMeters = Math.round(distanceInMeters(store, destination));
  const extraBlocks = Math.max(0, Math.ceil((distanceMeters - 1000) / 100));
  return { distanceMeters, fee: BASE_FEE + extraBlocks * 3 };
}

export function formatAddress(address: { street: string; number: string; complement?: string | null | undefined; neighborhood: string; city: string; state: string; postalCode: string }) {
  return [`${address.street}, ${address.number}${address.complement ? `, ${address.complement}` : ""}`, address.neighborhood, `${address.city} - ${address.state}`, address.postalCode].join(", ");
}