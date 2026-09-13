import { getCountryCounts } from "../server/queries";
import { LazyGlobe } from "./LazyGlobe";

// Server wrapper: reads the seed's creator countries and hands them to the
// client globe. Drop it anywhere a server component renders.
export async function CountryGlobe({ size, className }: { size: number; className?: string }) {
  const countries = await getCountryCounts();
  return <LazyGlobe size={size} countries={countries} className={className} />;
}
