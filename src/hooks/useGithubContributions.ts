import { useState, useEffect } from 'react';
import {
  githubFallbackContributions,
  githubFallbackTotal,
} from '@/data/githubActivity';
import type { ContributionDay } from '@/components/ui/contribution-skyline';

export function useGithubContributions(username: string = 'Ghufrnainun') {
  const [data, setData] = useState<ContributionDay[]>(githubFallbackContributions);
  const [total, setTotal] = useState<number>(githubFallbackTotal);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveContributions() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
        );
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json?.contributions) && json.contributions.length > 0) {
          setData(json.contributions);
          if (typeof json.total?.lastYear === 'number') {
            setTotal(json.total.lastYear);
          }
        }
      } catch (err) {
        // Silently keep static fallback
        if (process.env.NODE_ENV === 'development') {
          console.info('Live GitHub contributions fetch skipped/fallback active:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchLiveContributions();

    return () => {
      isMounted = false;
    };
  }, [username]);

  return { data, total, isLoading };
}
