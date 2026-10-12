import type { Hotel } from '../types/hotel';
import type { Period } from '../types/period';
import type { Category } from '../types/category';

export const HOTELS: Hotel[] = [
  {
    id: 'hotel_semarang',
    name: 'Hotel Horison Inn Antawirya Semarang',
    city: 'Semarang',
    type: 'Training Center II Undip & Urban Hotel',
    tagline: 'Inn Antawirya Semarang',
    address: 'Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah 50275',
    accentColor: '#a73918',
    secondaryColor: '#fe7952',
    deliverablesCount: 0,
    imageUri: '/horison-semarang.jpg',
    description: 'Berlokasi di Gedung BTB Training Center II kawasan kampus Undip Tembalang, memadukan akomodasi perhotelan profesional dengan pusat training hospitality modern.',
  },
  {
    id: 'hotel_jepara',
    name: 'Hotel Horison Resort Antawirya Jepara',
    city: 'Jepara',
    type: 'Coastal Leisure Resort',
    tagline: 'Resort Antawirya Jepara',
    address: 'Jl. Tlk. Awur, Telukawur, Kec. Tahunan, Kabupaten Jepara, Jawa Tengah 59427',
    accentColor: '#001b3d',
    secondaryColor: '#6584ba',
    deliverablesCount: 0,
    imageUri: '/horison-jepara.jpg',
    description: 'Resor tepi pantai eksotis di pesisir Pantai Teluk Awur, Tahunan, Jepara dengan fasilitas paviliun santai dan pemandangan langsung ke Laut Jawa.',
  },
  {
    id: 'hotel_both',
    name: 'Kedua Hotel (Dual Unit - Semarang & Jepara)',
    city: 'Semarang & Jepara',
    type: 'Shared Cluster Collateral (2 Unit)',
    tagline: 'Horison Semarang & Jepara',
    address: 'Central Java Cluster (Semarang & Jepara)',
    accentColor: '#6366f1',
    secondaryColor: '#818cf8',
    deliverablesCount: 0,
    imageUri: '/horison-semarang.jpg',
    description: 'Karya desain grafis bersama yang digunakan serentak untuk kedua unit properti (Horison Inn Antawirya Semarang dan Horison Resort Antawirya Jepara).',
  },
];

export const PERIODS: Period[] = [
  {
    id: 'period_2026_1',
    name: 'April–Juni 2026',
    status: 'completed',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    cohort: 'Cohort I (Retrospective)',
    deliverablesCount: 0,
  },
  {
    id: 'period_2026_2',
    name: 'Oktober–Desember 2026',
    status: 'active',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    cohort: 'Cohort II (Active Track)',
    deliverablesCount: 0,
  },
];

export const CATEGORIES: Category[] = [
  { id: 'cat_hari_nasional', name: 'Hari Nasional', color: '#191c21', deliverablesCount: 0 },
  { id: 'cat_promo', name: 'Promo', color: '#a73918', deliverablesCount: 0 },
  { id: 'cat_event', name: 'Event', color: '#6584ba', deliverablesCount: 0 },
  { id: 'cat_greeting', name: 'Greeting', color: '#76777b', deliverablesCount: 0 },
  { id: 'cat_social_media', name: 'Social Media', color: '#46464b', deliverablesCount: 0 },
  { id: 'cat_video_reels', name: 'Video & Reels', color: '#8b5cf6', deliverablesCount: 0 },
  { id: 'cat_backdrop', name: 'Backdrop/Banner', color: '#c7c6cb', deliverablesCount: 0 },
  { id: 'cat_marketing', name: 'Marketing', color: '#862201', deliverablesCount: 0 },
  { id: 'cat_lainnya', name: 'Lainnya', color: '#5e5e62', deliverablesCount: 0 },
];
