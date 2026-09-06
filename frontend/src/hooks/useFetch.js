import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

/**
 * Custom hook to fetch data from backend API
 * @param {string} url - API endpoint path (e.g. '/subjects')
 * @returns {object} { data, loading, error, refetch }
 */
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(url);
      if (response.data && response.data.success) {
        setData(response.data.data);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch data from backend");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export default useFetch;
