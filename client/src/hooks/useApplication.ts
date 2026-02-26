// Example Logic for useApplications.ts
import { useState, useEffect } from "react";
import { getMyApplications } from "../services/application.service";
import type{ Application } from "../auth-types/application.types";

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data.applications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, []);

  return { applications, loading, refresh: fetchApps };
};