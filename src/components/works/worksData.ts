import { type Language } from '../../hooks/useLanguage';

/** The site ships zh/en/ms, but case-study copy is authored in zh + en only.
 *  Malay visitors read the English copy rather than seeing an empty page. */
export type CopyLang = 'zh' | 'en';
export const copyLang = (lang: Language): CopyLang => (lang === 'zh' ? 'zh' : 'en');

export interface Bilingual {
  zh: string;
  en: string;
}

export interface WorkMedia {
  type: 'image' | 'video';
  src: string;
  /** 600px WebP used for grid tiles; `src`/`poster` stay full-size for the lightbox. */
  thumb: string;
  width: number | null;
  height: number | null;
  ratio: string;
  poster?: string;
  duration?: number | null;
}

export interface Work {
  slug: string;
  client_name: string;
  industry: Bilingual;
  services: string[];
  cover_image: string;
  /** 600px WebP of the cover, used by the card grid. cover_image stays JPG for og:image. */
  cover_thumb: string;
  /** One-line angle for this case — describes the work, never a claimed business outcome. */
  highlight: Bilingual;
  summary: Bilingual;
  challenge: Bilingual;
  approach: Bilingual;
  deliverables: { zh: string[]; en: string[] };
  media: WorkMedia[];
  featured: boolean;
  order: number;
}

/** Deliverable counts are derived from the media list, so no case study hardcodes them. */
export function mediaCounts(media: WorkMedia[]) {
  return {
    videos: media.filter(m => m.type === 'video').length,
    images: media.filter(m => m.type === 'image').length,
  };
}

export function countLabel(n: number, kind: 'video' | 'design', lang: Language): string {
  if (lang === 'zh') return kind === 'video' ? `${n} 支影片` : `${n} 张设计`;
  if (lang === 'ms') return kind === 'video' ? `${n} video` : `${n} reka bentuk`;
  return kind === 'video' ? `${n} video${n === 1 ? '' : 's'}` : `${n} design${n === 1 ? '' : 's'}`;
}

/** Service filter taxonomy. `id` values must match the strings used in works.json. */
export const SERVICE_FILTERS: { id: string; label: Record<Language, string> }[] = [
  { id: 'video',  label: { zh: '短视频制作', en: 'Video Production', ms: 'Produksi Video' } },
  { id: 'design', label: { zh: '平面设计',   en: 'Graphic Design',   ms: 'Reka Bentuk Grafik' } },
  { id: 'ads',    label: { zh: '广告投放',   en: 'Paid Ads',         ms: 'Iklan Berbayar' } },
];

export const worksT: Record<Language, {
  navLabel: string;
  metaTitle: string;
  metaDesc: string;
  heroTitle: string;
  heroSub: string;
  filterService: string;
  filterIndustry: string;
  clearFilters: string;
  resultCount: (n: number) => string;
  empty: string;
  viewCase: string;
  backToWorks: string;
  overview: string;
  challenge: string;
  approach: string;
  deliverables: string;
  gallery: string;
  nextCase: string;
  ctaTitle: string;
  ctaSub: string;
  ctaButton: string;
  playVideo: string;
  closeLightbox: string;
  prevMedia: string;
  nextMedia: string;
}> = {
  zh: {
    navLabel: '客户作品',
    metaTitle: '客户作品案例 | Cheaper Nexus 马来西亚数码营销公司',
    metaDesc: '浏览 Cheaper Nexus 为马来西亚各行各业客户制作的短视频、社媒设计与广告素材：贷款、餐饮、婚礼活动、手机零售、美业等真实作品案例。',
    heroTitle: '我们做过的作品',
    heroSub: '短视频、社媒设计、广告素材——这些都是我们实际交付给马来西亚客户的作品。',
    filterService: '服务类型',
    filterIndustry: '行业',
    clearFilters: '清除筛选',
    resultCount: n => `共 ${n} 个案例`,
    empty: '没有符合筛选条件的案例，试试放宽条件。',
    viewCase: '查看案例',
    backToWorks: '返回作品列表',
    overview: '案例概览',
    challenge: '客户面对的问题',
    approach: '我们怎么做',
    deliverables: '交付内容',
    gallery: '作品展示',
    nextCase: '下一个案例',
    ctaTitle: '想要同样品质的内容？',
    ctaSub: '免费 30 分钟策略咨询，直接 WhatsApp 聊，无任何承诺。',
    ctaButton: 'WhatsApp 咨询',
    playVideo: '播放影片',
    closeLightbox: '关闭',
    prevMedia: '上一个',
    nextMedia: '下一个',
  },
  en: {
    navLabel: 'Works',
    metaTitle: 'Client Work & Case Studies | Cheaper Nexus Malaysia',
    metaDesc: 'Browse short-form videos, social media designs and ad creatives Cheaper Nexus has produced for Malaysian businesses across loans, F&B, weddings, mobile retail, beauty and more.',
    heroTitle: 'Work We’ve Delivered',
    heroSub: 'Short-form video, social design and ad creative — real work delivered for Malaysian businesses.',
    filterService: 'Service',
    filterIndustry: 'Industry',
    clearFilters: 'Clear filters',
    resultCount: n => `${n} case ${n === 1 ? 'study' : 'studies'}`,
    empty: 'No case studies match these filters. Try widening your selection.',
    viewCase: 'View case study',
    backToWorks: 'Back to works',
    overview: 'Overview',
    challenge: 'The Challenge',
    approach: 'What We Did',
    deliverables: 'Deliverables',
    gallery: 'The Work',
    nextCase: 'Next case study',
    ctaTitle: 'Want work like this for your business?',
    ctaSub: 'Free 30-minute strategy chat on WhatsApp. No commitment.',
    ctaButton: 'Chat on WhatsApp',
    playVideo: 'Play video',
    closeLightbox: 'Close',
    prevMedia: 'Previous',
    nextMedia: 'Next',
  },
  ms: {
    navLabel: 'Kerja Kami',
    metaTitle: 'Kerja Klien & Kajian Kes | Cheaper Nexus Malaysia',
    metaDesc: 'Lihat video pendek, reka bentuk media sosial dan bahan iklan yang dihasilkan Cheaper Nexus untuk perniagaan Malaysia — pinjaman, F&B, perkahwinan, peruncitan telefon, kecantikan dan lain-lain.',
    heroTitle: 'Kerja Yang Kami Hasilkan',
    heroSub: 'Video pendek, reka bentuk sosial dan bahan iklan — kerja sebenar untuk perniagaan Malaysia.',
    filterService: 'Perkhidmatan',
    filterIndustry: 'Industri',
    clearFilters: 'Kosongkan penapis',
    resultCount: n => `${n} kajian kes`,
    empty: 'Tiada kajian kes yang sepadan. Cuba longgarkan penapis.',
    viewCase: 'Lihat kajian kes',
    backToWorks: 'Kembali ke kerja kami',
    overview: 'Gambaran Keseluruhan',
    challenge: 'Cabaran',
    approach: 'Apa Yang Kami Buat',
    deliverables: 'Penghantaran',
    gallery: 'Hasil Kerja',
    nextCase: 'Kajian kes seterusnya',
    ctaTitle: 'Mahu kerja seperti ini untuk perniagaan anda?',
    ctaSub: 'Perbincangan strategi 30 minit percuma melalui WhatsApp. Tiada komitmen.',
    ctaButton: 'WhatsApp Kami',
    playVideo: 'Main video',
    closeLightbox: 'Tutup',
    prevMedia: 'Sebelumnya',
    nextMedia: 'Seterusnya',
  },
};

export const WHATSAPP_URL = 'https://wa.me/60172915754';
