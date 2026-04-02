import { Product } from './types';

export const SERVICES: Product[] = [
  // 1. Brand Visual & Content
  { id: 'ugc-5', category: 'Content', name: 'UGC / KOC Matrix (5 Videos)', price: 1250, unit: 'pkg' },
  { id: 'tiktok-10', category: 'Content', name: 'TikTok / IG Unboxing (10 Videos)', price: 3500, unit: 'pkg' },
  { id: 'whitelist', category: 'Content', name: 'Whitelisting (Ad Access)', price: 500, unit: 'video' },
  { id: 'photo', category: 'Content', name: 'Creative Lifestyle Photography', price: 150, unit: 'photo' },

  // 2. Social Media
  { id: 'sm-setup', category: 'Social Media', name: 'Full Network Visual Setup', price: 1000, unit: 'once' },
  { id: 'sm-plan-a', category: 'Social Media', name: 'Plan A: Digital Infrastructure', price: 1800, unit: 'month' },
  { id: 'sm-plan-b', category: 'Social Media', name: 'Plan B: Video Growth Engine', price: 3500, unit: 'month' },

  // 3. XHS
  { id: 'xhs-blue-v', category: 'XHS', name: 'XHS Blue V Verification', price: 3500, unit: 'once' },
  { id: 'xhs-mgmt', category: 'XHS', name: 'XHS Full Account Mgmt', price: 2500, unit: 'month' },
  { id: 'xhs-koc', category: 'XHS', name: 'XHS KOC Seeding (10 Reviews)', price: 3500, unit: 'pkg' },

  // 4. Ads & SEO
  { id: 'ads-starter', category: 'Ads & SEO', name: 'Digital Ads Starter', price: 1200, unit: 'month' },
  { id: 'ads-std', category: 'Ads & SEO', name: 'Digital Ads Standard', price: 2000, unit: 'month' },
  { id: 'landing-page', category: 'Ads & SEO', name: 'High-Conversion Landing Page', price: 1000, unit: 'page' },
  { id: 'seo-geo', category: 'Ads & SEO', name: 'GEO & SEO (Min 6 Months)', price: 2500, unit: 'month' },

  // 5. E-Commerce
  { id: 'ec-setup', category: 'E-Commerce', name: 'Multi-Platform E-Com Setup', price: 1888, unit: 'once' },
  { id: 'ec-360', category: 'E-Commerce', name: 'E-Commerce 360 Full Mgmt', price: 5000, unit: 'month' },
  { id: 'live-stream', category: 'E-Commerce', name: 'Official Live Streaming (10 Sessions)', price: 2500, unit: 'month' },
];
