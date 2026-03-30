import { Category, Wallpaper } from './types';

export const CATEGORIES: { name: Category; image: string }[] = [
  { name: 'Nature', image: 'https://ik.imagekit.io/BigCat/IMAGES/Flower%20Head2%20copy.jpg?updatedAt=1774707101891' },
  { name: 'Minimal', image: 'https://ik.imagekit.io/BigCat/IMAGES/Destop%20wallpaper.jpg?updatedAt=1774707099934' },
  { name: 'Futuristic', image: 'https://ik.imagekit.io/BigCat/IMAGES/Book%20Cover%20(2).png?updatedAt=1774707955630' },
  { name: 'Multi-Monitor', image: 'https://ik.imagekit.io/BigCat/IMAGES/Desk2.png?updatedAt=1774707257119' },
  { name: 'Abstract', image: 'https://ik.imagekit.io/BigCat/IMAGES/Bubble.png?updatedAt=1774707388340' },
  { name: 'Live Wallpaper', image: 'https://ik.imagekit.io/BigCat/IMAGES/Royal.jpg?updatedAt=1774707348235' }
];

export const WALLPAPERS: Wallpaper[] = [
  { 
    id: 'bc-1', 
    title: 'Flower Head Essence', 
    category: 'Nature', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Flower%20Head2%20copy.jpg?updatedAt=1774707101891', 
    resolution: '4K',
    description: 'A study in organic symmetry and floral complexity.',
    tags: ['flower', 'nature', 'floral', 'macro'],
    software: ['Photoshop', 'Lightroom'],
    downloadCount: 0,
    rating: 5.0,
    isFeatured: true
  },
  { 
    id: 'bc-2', 
    title: 'Digital Horizon', 
    category: 'Minimal', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Destop%20wallpaper.jpg?updatedAt=1774707099934', 
    resolution: '4K',
    description: 'Clean lines and expansive vistas for the focused mind.',
    tags: ['minimal', 'desktop', 'clean', 'horizon'],
    software: ['Illustrator'],
    isFeatured: true
  },
  { 
    id: 'bc-3', 
    title: 'Neural Cover', 
    category: 'Futuristic', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Book%20Cover%20(2).png?updatedAt=1774707955630', 
    resolution: '4K',
    description: 'The structural blueprint of future knowledge.',
    tags: ['futuristic', 'blue', 'tech', 'structure'],
    isPro: true
  },
  { 
    id: 'bc-4', 
    title: 'Atmospheric Bubble', 
    category: 'Abstract', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Bubble.png?updatedAt=1774707388340', 
    resolution: '4K',
    description: 'A moment of perfect spherical tension.',
    tags: ['abstract', 'bubble', 'glass', 'light']
  },
  { 
    id: 'bc-5', 
    title: 'Royal Presence', 
    category: 'Nature', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Royal.jpg?updatedAt=1774707348235', 
    resolution: '4K',
    description: 'Majestic character study in natural light.',
    tags: ['royal', 'character', 'gold', 'light'],
    isFeatured: true
  },
  { 
    id: 'bc-6', 
    title: 'Breath Control II', 
    category: 'Minimal', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Breath%20Control2.jpg?updatedAt=1774707344329', 
    resolution: '4K',
    description: 'Rhythmic patterns and breathing space.',
    tags: ['breath', 'control', 'white', 'minimal']
  },
  { 
    id: 'bc-7', 
    title: 'Lollipop Spectrum', 
    category: 'Abstract', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Lollipop3_.jpg?updatedAt=1774707339059', 
    resolution: '4K',
    description: 'Sweet distortions and colorful refraction.',
    tags: ['lollipop', 'color', 'swirl', 'sweet'],
    isPro: true
  },
  { 
    id: 'bc-8', 
    title: 'Orbital Symmetry', 
    category: 'Abstract', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Balls3.png?updatedAt=1774707324960', 
    resolution: '4K',
    description: 'Perfect alignment of digital spheres.',
    tags: ['balls', 'spheres', '3d', 'render']
  },
  { 
    id: 'bc-9', 
    title: 'Breath Control I', 
    category: 'Minimal', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Breath%20Control1.jpg?updatedAt=1774707317643', 
    resolution: '4K',
    tags: ['breath', 'minimal', 'focus']
  },
  { 
    id: 'bc-10', 
    title: 'Neural Promo Red', 
    category: 'Futuristic', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Promo2.png?updatedAt=1774707316326', 
    resolution: '4K',
    isPro: true
  },
  { 
    id: 'bc-11', 
    title: 'Neural Promo Blue', 
    category: 'Futuristic', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Promo1.png?updatedAt=1774707315654', 
    resolution: '4K'
  },
  { 
    id: 'bc-12', 
    title: 'Royal Noir', 
    category: 'Nature', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Royal%20B&W.jpg?updatedAt=1774707266811', 
    resolution: '4K',
    tags: ['bw', 'monochrome', 'royal']
  },
  { 
    id: 'bc-13', 
    title: 'Studio Workspace I', 
    category: 'Minimal', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Desk1.png?updatedAt=1774707265690', 
    resolution: '4K'
  },
  { 
    id: 'bc-14', 
    title: 'Studio Workspace II', 
    category: 'Multi-Monitor', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Desk2.png?updatedAt=1774707257119', 
    resolution: 'Ultrawide'
  },
  { 
    id: 'bc-15', 
    title: 'Prism Bubble', 
    category: 'Abstract', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Bubble%20copy.jpg?updatedAt=1774707227371', 
    resolution: '4K'
  },
  { 
    id: 'bc-16', 
    title: 'Candy Refraction', 
    category: 'Abstract', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Lollipop2.jpg?updatedAt=1774707211057', 
    resolution: '4K',
    isPro: true
  },
  { 
    id: 'bc-17', 
    title: 'Sugar Flow', 
    category: 'Abstract', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Lollipop1_.jpg?updatedAt=1774707200476', 
    resolution: '4K'
  },
  { 
    id: 'bc-18', 
    title: 'Web Interface Blueprint', 
    category: 'Minimal', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Website%20Page%20copy.jpg?updatedAt=1774707195934', 
    resolution: '4K'
  },
  { 
    id: 'bc-19', 
    title: 'Pulmonary Vision II', 
    category: 'Abstract', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Breath%20Control%20Wallpaper2.jpg?updatedAt=1774707167655', 
    resolution: '4K'
  },
  { 
    id: 'bc-20', 
    title: 'Pulmonary Vision I', 
    category: 'Abstract', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Breath%20Control%20Wallpaper.jpg?updatedAt=1774707152280', 
    resolution: '4K'
  },
  { 
    id: 'bc-21', 
    title: 'Blue Ether', 
    category: 'Minimal', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Blue%20Wallpaper.jpg?updatedAt=1774707146697', 
    resolution: '4K'
  },
  { 
    id: 'bc-22', 
    title: 'Guardian Lock', 
    category: 'Futuristic', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Lock%20wallpaper.jpg?updatedAt=1774707137316', 
    resolution: '4K'
  },
  { 
    id: 'bc-23', 
    title: 'Flower Head Bloom', 
    category: 'Nature', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Flower%20Head3%20copy.jpg?updatedAt=1774707132115', 
    resolution: '4K'
  },
  { 
    id: 'bc-24', 
    title: 'Panther Shadow II', 
    category: 'Nature', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Panther%20Wallpaper2%20(2).jpg?updatedAt=1774707129366', 
    resolution: '4K',
    isPro: true
  },
  { 
    id: 'bc-25', 
    title: 'Panther Shadow I', 
    category: 'Nature', 
    url: 'https://ik.imagekit.io/BigCat/IMAGES/Panther%20Wallpaper1.jpg?updatedAt=1774707122410', 
    resolution: '4K',
    isFeatured: true
  }
];

export const LATEST_WALLPAPER = WALLPAPERS.find(w => w.id === 'bc-25') || WALLPAPERS[0];
