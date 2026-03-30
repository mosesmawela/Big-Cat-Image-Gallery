export type ImageQuality = 'low' | 'standard' | 'high' | 'ultra';

export const getOptimizedUrl = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif';
} = {}) => {
  if (!url.includes('unsplash.com')) return url;

  const {
    width = 1920,
    quality = 80,
    format = 'auto'
  } = options;

  // Remove existing params and rebuild
  const baseUrl = url.split('?')[0];
  const params = new URLSearchParams();
  
  params.set('auto', 'format');
  params.set('fit', 'crop');
  params.set('w', width.toString());
  params.set('q', quality.toString());
  
  if (options.height) {
    params.set('h', options.height.toString());
  }

  return `${baseUrl}?${params.toString()}`;
};

export const getGalleryThumb = (url: string) => getOptimizedUrl(url, { width: 800, quality: 60 });
export const getHeroImage = (url: string) => getOptimizedUrl(url, { width: 2560, quality: 85 });
export const getPreviewImage = (url: string) => getOptimizedUrl(url, { width: 100, quality: 20 }); // For blur-up
