import { Category, Wallpaper } from './types';

export const CATEGORIES: { name: Category; image: string }[] = [
  { name: 'Nature', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Minimal', image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80' },
  { name: 'Futuristic', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' },
  { name: 'Multi-Monitor', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Abstract', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80' },
  { name: 'Live Wallpaper', image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=800&q=80' }
];

export const WALLPAPERS: Wallpaper[] = [
  { 
    id: '1', 
    title: 'Mountain Peak', 
    category: 'Nature', 
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80', 
    resolution: '1080p',
    description: 'A breathtaking view of a snow-capped mountain peak at sunrise.',
    tags: ['mountain', 'snow', 'nature', 'sunrise'],
    software: ['Lightroom', 'Photoshop'],
    downloadUrls: {
      '1080p': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
      '4K': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=3840&q=80',
      'Ultrawide': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=3440&q=80'
    }
  },
  { 
    id: 'explicit-1', 
    title: 'Explicit Content Test', 
    category: 'Abstract', 
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80', 
    resolution: '1080p',
    description: 'A test image for explicit content filtering.',
    tags: ['abstract', 'explicit'],
    software: ['Photoshop'],
    downloadUrls: {
      '1080p': 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80',
      '4K': 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=3840&q=80',
      'Ultrawide': 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=3440&q=80'
    }
  },
  { 
    id: '2', 
    title: 'Forest Path', 
    category: 'Nature', 
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=3840&q=80', 
    isPro: true, 
    resolution: '4K',
    description: 'A serene path through a dense, sun-drenched forest.',
    tags: ['forest', 'trees', 'nature', 'sunlight'],
    software: ['Capture One', 'Photoshop'],
    downloadUrls: {
      '1080p': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80',
      '4K': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=3840&q=80',
      'Ultrawide': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=3440&q=80'
    }
  },
  { 
    id: '13', 
    title: 'Alpine Lake', 
    category: 'Nature', 
    url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1920&q=80', 
    resolution: '1080p',
    description: 'A crystal clear alpine lake reflecting the surrounding peaks.',
    tags: ['lake', 'reflection', 'nature', 'mountains'],
    software: ['Lightroom']
  },
  { 
    id: '14', 
    title: 'Green Valley', 
    category: 'Nature', 
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1920&q=80', 
    resolution: '1080p',
    description: 'A lush green valley under a dramatic sky.',
    tags: ['valley', 'green', 'nature', 'sky'],
    software: ['Photoshop']
  },
  { 
    id: '3', 
    title: 'Clean Lines', 
    category: 'Minimal', 
    url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1920&q=80', 
    resolution: '1080p',
    description: 'A minimalist composition featuring clean architectural lines.',
    tags: ['minimal', 'architecture', 'white', 'clean'],
    software: ['Blender', 'Illustrator']
  },
  { 
    id: '4', 
    title: 'Soft Gradient', 
    category: 'Minimal', 
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=3840&q=80', 
    isPro: true, 
    resolution: '4K',
    description: 'A smooth, calming gradient transition between soft colors.',
    tags: ['gradient', 'minimal', 'soft', 'colors'],
    software: ['Figma', 'Photoshop']
  },
  { 
    id: '15', 
    title: 'Abstract Arch', 
    category: 'Minimal', 
    url: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1920&q=80', 
    resolution: '1080p',
    description: 'Minimalist architectural arch in black and white.',
    tags: ['minimal', 'architecture', 'arch', 'bw'],
    software: ['Blender']
  },
  { 
    id: '16', 
    title: 'Zen Space', 
    category: 'Minimal', 
    url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1920&q=80', 
    resolution: '1080p',
    description: 'A peaceful zen space with minimal elements.',
    tags: ['minimal', 'zen', 'peaceful', 'interior'],
    software: ['Figma']
  },
  { 
    id: '17', 
    title: 'Astronaut Voyager', 
    category: 'Futuristic', 
    url: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=1920&q=80', 
    resolution: '1080p',
    description: 'A futuristic voyager exploring the deep reaches of space.',
    tags: ['astronaut', 'space', 'future', 'voyager'],
    software: ['Cinema 4D', 'Octane']
  },
  { 
    id: '5', 
    title: 'Cyber City', 
    category: 'Futuristic', 
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80', 
    resolution: '1080p',
    description: 'A neon-lit futuristic cityscape with high-tech elements.',
    tags: ['cyberpunk', 'city', 'neon', 'future'],
    software: ['Cinema 4D', 'After Effects']
  },
  { 
    id: '6', 
    title: 'Neon Pulse', 
    category: 'Futuristic', 
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=3840&q=80', 
    isPro: true, 
    resolution: '4K',
    description: 'Abstract neon pulses flowing through a digital grid.',
    tags: ['neon', 'pulse', 'digital', 'abstract'],
    software: ['Houdini', 'Octane Render']
  },
  { 
    id: '18', 
    title: 'Digital Matrix', 
    category: 'Futuristic', 
    url: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=1920&q=80', 
    resolution: '1080p',
    description: 'A complex digital matrix of data and light.',
    tags: ['data', 'matrix', 'digital', 'future'],
    software: ['After Effects']
  },
  { 
    id: '7', 
    title: 'Wide Horizon', 
    category: 'Multi-Monitor', 
    url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=3840&q=80', 
    resolution: 'Ultrawide',
    description: 'An expansive landscape perfect for multi-monitor setups.',
    tags: ['landscape', 'wide', 'panorama', 'nature'],
    software: ['Lightroom', 'Photoshop']
  },
  { 
    id: '8', 
    title: 'Dual Flow', 
    category: 'Multi-Monitor', 
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=3840&q=80', 
    resolution: 'Ultrawide',
    description: 'A continuous abstract flow designed for dual monitors.',
    tags: ['abstract', 'dual', 'flow', 'colors'],
    software: ['Blender', 'After Effects']
  },
  { 
    id: '19', 
    title: 'Panoramic Peak', 
    category: 'Multi-Monitor', 
    url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=3840&q=80', 
    resolution: 'Ultrawide',
    description: 'A panoramic view of mountain peaks for wide setups.',
    tags: ['panorama', 'wide', 'mountains', 'nature'],
    software: ['Lightroom']
  },
  { 
    id: '20', 
    title: 'Yosemite Wide', 
    category: 'Multi-Monitor', 
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=3840&q=80', 
    resolution: 'Ultrawide',
    description: 'The majestic Yosemite Valley in ultrawide resolution.',
    tags: ['yosemite', 'wide', 'nature', 'landscape'],
    software: ['Photoshop']
  },
  { 
    id: '9', 
    title: 'Swirling Colors', 
    category: 'Abstract', 
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1920&q=80', 
    resolution: '1080p',
    description: 'Vibrant colors swirling in a dynamic abstract composition.',
    tags: ['abstract', 'colors', 'swirl', 'vibrant'],
    software: ['Photoshop', 'Illustrator']
  },
  { 
    id: '10', 
    title: 'Geometric Void', 
    category: 'Abstract', 
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=3840&q=80', 
    isPro: true, 
    resolution: '4K',
    description: 'A deep dive into geometric shapes and infinite voids.',
    tags: ['geometric', 'void', 'shapes', 'dark'],
    software: ['Cinema 4D', 'ZBrush']
  },
  { 
    id: '21', 
    title: 'Color Flow', 
    category: 'Abstract', 
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80', 
    resolution: '1080p',
    description: 'A smooth flow of vibrant colors.',
    tags: ['abstract', 'colors', 'flow'],
    software: ['Blender']
  },
  { 
    id: '22', 
    title: 'Digital Swirl', 
    category: 'Abstract', 
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1920&q=80', 
    resolution: '1080p',
    description: 'A digital interpretation of swirling energy.',
    tags: ['abstract', 'digital', 'energy'],
    software: ['After Effects']
  },
  { 
    id: '11', 
    title: 'Rainy Window', 
    category: 'Live Wallpaper', 
    url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1920&q=80', 
    isPro: true, 
    resolution: '1080p', 
    isLive: true,
    description: 'A calming live view of raindrops on a window pane.',
    tags: ['rain', 'window', 'calm', 'live'],
    software: ['After Effects', 'Premiere Pro']
  },
  { 
    id: '12', 
    title: 'Floating Particles', 
    category: 'Live Wallpaper', 
    url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1920&q=80', 
    isPro: true, 
    resolution: '1080p', 
    isLive: true,
    description: 'Ethereal particles floating in a soft, dreamy space.',
    tags: ['particles', 'floating', 'dreamy', 'live'],
    software: ['Houdini', 'Unreal Engine']
  },
  { 
    id: '23', 
    title: 'Ocean Waves', 
    category: 'Live Wallpaper', 
    url: 'https://images.unsplash.com/photo-1505113135035-f87a9c507779?auto=format&fit=crop&w=1920&q=80', 
    isPro: true, 
    resolution: '1080p', 
    isLive: true,
    description: 'Gentle ocean waves rolling onto a shore.',
    tags: ['ocean', 'waves', 'beach', 'live'],
    software: ['Unreal Engine']
  },
  { 
    id: '24', 
    title: 'Starry Night', 
    category: 'Live Wallpaper', 
    url: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=1920&q=80', 
    isPro: true, 
    resolution: '1080p', 
    isLive: true,
    description: 'A dynamic starry night sky with twinkling stars.',
    tags: ['stars', 'night', 'sky', 'live'],
    software: ['Houdini']
  },
];

export const LATEST_WALLPAPER = WALLPAPERS.find(w => w.id === '17') || WALLPAPERS[0];
