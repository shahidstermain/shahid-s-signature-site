import { siteConfig } from "./site-config";

const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export const toAbsoluteUrl = (pathOrUrl: string): string => {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  const normalized = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteConfig.siteUrl}${normalized}`;
};

export const buildCanonicalUrl = (path?: string): string => {
  if (!path) {
    return siteConfig.siteUrl;
  }

  return toAbsoluteUrl(path);
};

export const parseArticleDate = (dateStr: string): Date => {
  const [month, year] = dateStr.split(" ");
  const monthIndex = MONTHS[month] ?? 0;
  const yearNumber = Number.parseInt(year ?? "", 10);

  if (Number.isNaN(yearNumber)) {
    return new Date();
  }

  return new Date(Date.UTC(yearNumber, monthIndex, 1));
};

export const formatArticleDateIso = (dateStr: string): string =>
  parseArticleDate(dateStr).toISOString();

export const formatArticleDateOnly = (dateStr: string): string =>
  parseArticleDate(dateStr).toISOString().split("T")[0];
