/**
 * Helper to ensure assets (images, icons) resolve correctly
 * both locally (basePath = "") and on GitHub Pages (basePath = "/mercury-cmr").
 */
export const getAssetPath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
};
