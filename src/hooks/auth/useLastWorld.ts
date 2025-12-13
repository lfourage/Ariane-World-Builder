import { useEffect, useState } from "react";

/**
 * Fetches the user's most recently created world
 *
 * @param {string} status - Authentication status from useSession
 * @returns {Object} Last world state
 * @returns {Object | null} lastWorld - Most recent world object with id and name
 * @returns {boolean} isLoading - Whether the fetch is in progress
 * @returns {string | null} error - Error message if fetch failed
 *
 * @example
 * const { lastWorld, isLoading, error } = useLastWorld(authStatus);
 *
 * if (!isLoading && lastWorld) {
 *   router.push(`/${lastWorld.id}/schematizer`);
 * }
 */
export function useLastWorld(status: string) {
  const [lastWorld, setLastWorld] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastWorld = async () => {
      if (status === "authenticated") {
        try {
          setError(null);
          const res = await fetch("/api/worlds");

          if (!res.ok) {
            throw new Error(`Failed to fetch worlds: ${res.status}`);
          }

          const data = await res.json();
          const worlds = data.data;

          // Get first world (most recent) if any exist
          if (worlds && worlds.length > 0) {
            setLastWorld({ id: worlds[0].id, name: worlds[0].name });
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to load last world";
          setError(message);
        }
      }
      setIsLoading(false);
    };

    if (status !== "loading") {
      fetchLastWorld();
    }
  }, [status]);

  return { lastWorld, isLoading, error };
}
