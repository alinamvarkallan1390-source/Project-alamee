'use client';
import { useEffect, useState } from 'react';
import { getSettings, getProjects, getServices, getSections } from './api';

export function useSiteData() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    getSettings().then(setSettings);
    getProjects().then(setProjects);
    getServices().then(setServices);
    getSections().then(setSections);
  }, []);

  const enabled = (key: string) => {
    if (!sections.length) return true;
    const s = sections.find((x) => x.key === key);
    return s ? s.enabled !== false : true;
  };
  const sec = (key: string) => sections.find((x) => x.key === key) || {};

  return { settings, projects, services, sections, enabled, sec };
}
