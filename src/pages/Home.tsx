/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight, MessageSquare, CheckCircle2,
  Sparkles, Share2, Rocket, Megaphone, Users, Palette, TrendingUp,
  Zap, Shield,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { Navbar } from '../components/Navbar';
import { useLanguage, type Language } from '../hooks/useLanguage';
import { Footer } from '../components/Footer';
import { WorkWall } from '../components/works/WorkWall';
import { type Work } from '../components/works/worksData';

// ─── Types ────────────────────────────────────────────────────────────────────

type BlogPost = {
  id: number; slug: string; language: string;
  title: string; meta_description: string;
  created_at: string; image_url?: string;
};

// ─── Translations ─────────────────────────────────────────────────────────────

const t: Record<Language, {
  hero: { badge: string; line1: string; line2: string; sub: string; cta1: string; cta2: string; chips: string[] };
  stats: { value: string; label: string }[];
  services: { eyebrow: string; title: string; sub: string; cta: string };
  whyUs: { eyebrow: string; line1: string; line2: string; sub: string; points: { t: string; d: string }[] };
  blog: { eyebrow: string; title: string; sub: string; cta: string; read: string };
  final: { title: string; sub: string; btn: string };
  footer: { copy: string; services: string; pricing: string; contact: string };
}> = {
  zh: {
    hero: {
      badge: '马来西亚数码营销专家',
      line1: '让您的业务',
      line2: '在全网发光',
      sub: 'Cheaper Nexus 是马来西亚数码营销公司，从 TikTok 到小红书，从短视频制作到 Meta 广告投放，我们帮马来西亚中小企业一站式攻占全平台。',
      cta1: '免费咨询',
      cta2: '查看服务',
      chips: ['短视频制作', '社媒管理', 'Meta 广告', '平面设计', 'KOC 网红营销'],
    },
    stats: [
      { value: '5+', label: '覆盖平台' },
      { value: '1小时', label: '工作响应' },
      { value: '30分钟', label: '免费策略咨询' },
      { value: '全国', label: '马来西亚服务' },
    ],
    services: {
      eyebrow: '我们的服务',
      title: '我们提供什么？',
      sub: '从视频内容到广告投放，覆盖每一个让业务增长的渠道。',
      cta: '查看全部服务',
    },
    whyUs: {
      eyebrow: '为什么选择我们',
      line1: '不只是广告公司，',
      line2: '是您的增长伙伴',
      sub: '作为马来西亚数码营销公司，我们用透明的价格、实战的策略，帮您的业务真正产生销售增长。',
      points: [
        { t: '价格透明，无隐藏费用', d: '每项服务标准明确，您清楚知道自己在为什么付费。' },
        { t: '效果导向，关注真实转化', d: '我们不只看数据，更关注您的实际销售增长与客户获取。' },
        { t: '全平台整合策略', d: '短视频、社媒、广告投放、网红营销——统一品牌策略，全渠道协同。' },
        { t: '1小时内响应，专属对接', d: '通过 WhatsApp 直接对接团队，即时沟通，绝无客服转接。' },
      ],
    },
    blog: {
      eyebrow: '营销知识库',
      title: '最新干货',
      sub: '实用的数码营销指南，助您在马来西亚市场脱颖而出。',
      cta: '查看全部文章',
      read: '阅读全文',
    },
    final: {
      title: '准备开始增长了吗？',
      sub: '免费 30 分钟策略咨询，零承诺。让我们看看能为您做什么。',
      btn: '通过 WhatsApp 联系',
    },
    footer: { copy: '版权所有', services: '服务项目', pricing: '价格方案', contact: '联系我们' },
  },

  en: {
    hero: {
      badge: 'Malaysia Digital Marketing Agency',
      line1: 'Grow Your Business',
      line2: 'Across Every Platform',
      sub: 'From TikTok to Xiaohongshu, short-form video to Meta Ads — we help Malaysian SMEs dominate digital, all in one place.',
      cta1: 'Free Consultation',
      cta2: 'Our Services',
      chips: ['Short-Form Video', 'Social Media', 'Meta Ads', 'Graphic Design', 'KOC Marketing'],
    },
    stats: [
      { value: '5+', label: 'Platforms Covered' },
      { value: '1 Hour', label: 'Response Time' },
      { value: '30 Min', label: 'Free Strategy Call' },
      { value: 'All MY', label: 'Malaysia-Wide' },
    ],
    services: {
      eyebrow: 'What We Do',
      title: 'Our Services',
      sub: 'From video content to paid ads, we cover every growth channel your business needs.',
      cta: 'View All Services',
    },
    whyUs: {
      eyebrow: 'Why Choose Us',
      line1: "More than an agency —",
      line2: 'your growth partner',
      sub: 'Transparent pricing, battle-tested strategy, and real results for Malaysian businesses.',
      points: [
        { t: 'Transparent Pricing, No Hidden Fees', d: 'Clear standards for every service — you always know exactly what you\'re paying for.' },
        { t: 'Result-Driven, Real Conversions', d: "We don't just chase metrics. We focus on your actual sales growth and customer acquisition." },
        { t: 'Cross-Platform Integration', d: 'Short-form video, social, paid ads, influencer marketing — one unified brand strategy across all channels.' },
        { t: '1-Hour Response, Dedicated Support', d: 'Direct WhatsApp access to our team. No call centres, no tickets — just fast, real answers.' },
      ],
    },
    blog: {
      eyebrow: 'Marketing Insights',
      title: 'Latest Articles',
      sub: 'Practical digital marketing guides to help your business stand out in Malaysia.',
      cta: 'View All Articles',
      read: 'Read More',
    },
    final: {
      title: 'Ready to Start Growing?',
      sub: 'Free 30-minute strategy session, zero commitment. Let\'s see what we can do for your business.',
      btn: 'Contact via WhatsApp',
    },
    footer: { copy: 'All rights reserved', services: 'Services', pricing: 'Pricing', contact: 'Contact' },
  },

  ms: {
    hero: {
      badge: 'Agensi Pemasaran Digital Malaysia',
      line1: 'Kembangkan Bisnes Anda',
      line2: 'Di Semua Platform',
      sub: 'Dari TikTok ke Xiaohongshu, video pendek ke Meta Ads — kami bantu PKS Malaysia dominasi dunia digital.',
      cta1: 'Konsultasi Percuma',
      cta2: 'Perkhidmatan Kami',
      chips: ['Video Pendek', 'Media Sosial', 'Iklan Meta', 'Reka Bentuk', 'Pemasaran KOC'],
    },
    stats: [
      { value: '5+', label: 'Platform Diliputi' },
      { value: '1 Jam', label: 'Masa Respons' },
      { value: '30 Min', label: 'Sesi Strategi Percuma' },
      { value: 'Seluruh MY', label: 'Seluruh Malaysia' },
    ],
    services: {
      eyebrow: 'Perkhidmatan Kami',
      title: 'Apa Yang Kami Buat?',
      sub: 'Dari kandungan video hingga iklan berbayar — semua saluran pertumbuhan yang bisnes anda perlukan.',
      cta: 'Lihat Semua Perkhidmatan',
    },
    whyUs: {
      eyebrow: 'Kenapa Pilih Kami',
      line1: 'Lebih dari sekadar agensi —',
      line2: 'rakan pertumbuhan anda',
      sub: 'Harga telus, strategi terbukti, dan hasil nyata untuk perniagaan Malaysia.',
      points: [
        { t: 'Harga Telus, Tiada Caj Tersembunyi', d: 'Standard yang jelas untuk setiap perkhidmatan — anda sentiasa tahu apa yang dibayar.' },
        { t: 'Berasaskan Keputusan, Penukaran Nyata', d: 'Kami bukan sekadar kejar angka — kami fokus pada pertumbuhan jualan sebenar anda.' },
        { t: 'Integrasi Pelbagai Platform', d: 'Video pendek, media sosial, iklan berbayar, pemasaran influencer — strategi jenama bersatu merentasi semua saluran.' },
        { t: 'Respons 1 Jam, Sokongan Langsung', d: 'Akses terus ke pasukan kami melalui WhatsApp. Tiada pusat panggilan — hanya jawapan pantas.' },
      ],
    },
    blog: {
      eyebrow: 'Panduan Pemasaran',
      title: 'Artikel Terkini',
      sub: 'Panduan pemasaran digital praktikal untuk membantu bisnes anda menonjol di Malaysia.',
      cta: 'Lihat Semua Artikel',
      read: 'Baca Lagi',
    },
    final: {
      title: 'Bersedia Untuk Membesar?',
      sub: 'Sesi strategi percuma 30 minit, tiada komitmen. Mari lihat apa yang boleh kami buat.',
      btn: 'Hubungi melalui WhatsApp',
    },
    footer: { copy: 'Hak cipta terpelihara', services: 'Perkhidmatan', pricing: 'Harga', contact: 'Hubungi' },
  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const platforms = [
  'TikTok', 'Instagram', 'Facebook', 'Google', '小红书 XHS',
  'Shopee', 'Lazada', 'YouTube', 'WhatsApp Business', 'Meta Ads',
];

const serviceCards: Record<Language, { icon: React.ReactNode; title: string; desc: string }[]> = {
  zh: [
    { icon: <Sparkles className="w-6 h-6" />, title: '首次体验套餐', desc: '限量体验价 RM888，视频 + 设计 + 广告基础搭建，每间公司仅限一次。' },
    { icon: <Share2 className="w-6 h-6" />, title: '社媒管理套餐', desc: '内容制作 + 社媒代运营 + 广告投放一体化，FB / IG / TikTok / 小红书全覆盖。' },
    { icon: <Rocket className="w-6 h-6" />, title: '全面业务增长套餐', desc: '规模化内容产出 + 全渠道代运营，为稳定客户打造的进阶增长方案。' },
    { icon: <Megaphone className="w-6 h-6" />, title: '广告投放管理', desc: '独立广告代投服务，覆盖 TikTok / IG / FB / 小红书 / Google 等平台。' },
    { icon: <Users className="w-6 h-6" />, title: 'KOC / KOL 网红营销', desc: '全平台通用达人合作，10 位起，快速建立品牌口碑与信任。' },
    { icon: <Palette className="w-6 h-6" />, title: '单点设计与视频', desc: '无需绑定套餐，按件订购专业设计或视频制作，灵活按需使用。' },
  ],
  en: [
    { icon: <Sparkles className="w-6 h-6" />, title: 'First Trial Package', desc: 'Exclusive trial price RM888 — video, design & Meta Ads setup, once per company.' },
    { icon: <Share2 className="w-6 h-6" />, title: 'Social Media Management Package', desc: 'Content production, social media management & ads management combined — FB/IG/TikTok/XHS.' },
    { icon: <Rocket className="w-6 h-6" />, title: 'Full Business Growth Package', desc: 'Scaled content output and full-channel management — the advanced tier for established clients.' },
    { icon: <Megaphone className="w-6 h-6" />, title: 'Ads Management', desc: 'Standalone paid ads service across TikTok, IG, FB, XHS, and Google.' },
    { icon: <Users className="w-6 h-6" />, title: 'KOC / KOL Influencer Marketing', desc: 'Cross-platform influencer partnerships from 10 creators — build trust fast.' },
    { icon: <Palette className="w-6 h-6" />, title: 'Ala Carte Design & Video', desc: 'No package needed — order professional design or video production individually.' },
  ],
  ms: [
    { icon: <Sparkles className="w-6 h-6" />, title: 'Pakej Percubaan Pertama', desc: 'Harga percubaan eksklusif RM888 — video, reka bentuk & persediaan Iklan Meta, sekali setiap syarikat.' },
    { icon: <Share2 className="w-6 h-6" />, title: 'Pakej Pengurusan Media Sosial', desc: 'Penerbitan kandungan, pengurusan media sosial & pengurusan iklan digabungkan — FB/IG/TikTok/XHS.' },
    { icon: <Rocket className="w-6 h-6" />, title: 'Pakej Pertumbuhan Perniagaan Penuh', desc: 'Output kandungan berskala dan pengurusan penuh saluran — peringkat lanjutan untuk pelanggan sedia ada.' },
    { icon: <Megaphone className="w-6 h-6" />, title: 'Pengurusan Iklan', desc: 'Perkhidmatan iklan berbayar berasingan merentasi TikTok, IG, FB, XHS, dan Google.' },
    { icon: <Users className="w-6 h-6" />, title: 'Pemasaran Influencer KOC / KOL', desc: 'Kerjasama influencer merentasi platform dari 10 pencipta — bina kepercayaan dengan pantas.' },
    { icon: <Palette className="w-6 h-6" />, title: 'Reka Bentuk & Video Ala Carte', desc: 'Tiada pakej diperlukan — tempah reka bentuk profesional atau penerbitan video secara individu.' },
  ],
};

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 } as Record<string, unknown>,
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
};

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 } as Record<string, unknown>,
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const [lang, setLang] = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const c = t[lang];
  const cards = serviceCards[lang];

  // Same file the /works page reads, so the hero wall shows real client work.
  useEffect(() => {
    fetch('/works/works.json')
      .then(r => r.json())
      .then(setWorks)
      .catch(() => { /* wall simply renders nothing */ });
  }, []);

  useEffect(() => {
    fetch('/blog/articles.json')
      .then(r => r.json())
      .then((data: BlogPost[]) => setPosts(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-brand-white">
      <SEO lang={lang} />
      <Navbar lang={lang} setLang={setLang} />

      {/* ─────────────────────────────────────────────────────── HERO ── */}
      <section
        /* Column, not a row: the headline and the work wall are siblings here
           and must stack rather than compete for width.
           Near-black, lit only by a soft vignette. The reference gets its
           weight from restraint: four elements, one accent, a lot of dark. */
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ background: 'radial-gradient(1200px 780px at 50% 22%, #10141c 0%, #0a0c11 55%, #07080b 100%)' }}
      >
        {/* Main content */}
        <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 pt-32 pb-14 flex flex-col items-center text-center" style={{ zIndex: 3 }}>

          {/* Eyebrow — plain letterspaced type, no pill */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.42em] mb-8 sm:mb-10"
            style={{ color: 'rgba(255,255,255,.38)' }}
          >
            {c.hero.badge}
          </motion.p>

          {/* Headline — sized to run nearly the full width, like the reference */}
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-black tracking-[-0.045em] bg-linear-[195deg,#ffffff_22%,#8fa3b8_92%] bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(44px, 11.5vw, 158px)', lineHeight: 0.98 }}
          >
            {c.hero.line1}
            <br />
            {c.hero.line2}
          </motion.h1>

          {/* One quiet line — small against the headline, as the reference does */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 sm:mt-11 max-w-[520px] text-[13px] sm:text-sm leading-[1.9] uppercase tracking-[0.06em]"
            style={{ color: 'rgba(255,255,255,.42)' }}
          >
            {c.hero.sub}
          </motion.p>

          {/* A single understated CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.42 }}
            className="mt-10 flex flex-wrap justify-center items-center gap-7"
          >
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-white text-[#0a0c11] text-sm font-bold hover:bg-brand-cyan transition-colors"
            >
              {c.hero.cta1}
            </Link>
            <Link
              to="/services"
              className="text-sm font-semibold text-white/45 hover:text-white transition-colors border-b border-white/20 pb-0.5"
            >
              {c.hero.cta2}
            </Link>
          </motion.div>
        </div>

        {/* The work itself, drifting across under the headline. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="relative w-full"
          style={{ zIndex: 3 }}
        >
          <WorkWall works={works} count={10} />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-35"
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{ zIndex: 3 }}
        >
          <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, transparent, #4ADE80)' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ADE80' }} />
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────── STATS BAND ── */}
      {/* Moved out of the hero so the first screen carries only the headline
          and the work, as the reference does. */}
      <div className="bg-[#07080b] border-t border-white/8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex flex-wrap justify-center gap-x-14 gap-y-6 text-center">
          {c.stats.map((s, i) => (
            <motion.div key={i} {...stagger(i)}>
              <div className="text-2xl sm:text-3xl font-bold text-white">{s.value}</div>
              <div className="text-[11px] mt-1 uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,.32)' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────── PLATFORM MARQUEE ── */}
      <div className="border-y border-brand-blue/6 py-4 overflow-hidden bg-white">
        <div className="flex animate-marquee">
          {[...platforms, ...platforms].map((name, i) => (
            <div key={i} className="flex items-center gap-3 px-7 shrink-0">
              <span className="text-xs font-bold text-brand-blue/30 uppercase tracking-widest whitespace-nowrap">
                {name}
              </span>
              <span className="w-1 h-1 rounded-full bg-brand-blue/15 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────── SERVICES OVERVIEW ── */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Header row */}
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
            {...fadeUp}
          >
            <div>
              <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest block mb-3">
                {c.services.eyebrow}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-brand-blue leading-tight">
                {c.services.title}
              </h2>
              <p className="text-brand-blue/55 mt-4 max-w-lg leading-relaxed">
                {c.services.sub}
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-brand-cyan font-bold whitespace-nowrap hover:gap-3 transition-all shrink-0 group"
            >
              {c.services.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* 6 service cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, i) => (
              <motion.div key={i} {...stagger(i)}>
                <Link
                  to="/services"
                  className="group flex flex-col h-full p-8 rounded-[28px] border border-brand-blue/8 bg-white hover:border-brand-cyan/30 hover:shadow-2xl hover:shadow-brand-blue/5 transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue text-brand-cyan flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md shadow-brand-blue/20">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-bold text-brand-blue mb-3 group-hover:text-brand-cyan transition-colors leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-brand-blue/55 text-sm leading-relaxed flex-grow">
                    {card.desc}
                  </p>
                  <div className="mt-5 flex items-center gap-1 text-brand-cyan text-xs font-bold translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    {lang === 'zh' ? '了解更多' : lang === 'ms' ? 'Ketahui lagi' : 'Learn more'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────── WHY US ── */}
      <section className="py-28 bg-brand-blue overflow-hidden relative">

        {/* Background accent */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-cyan/8 blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left — claim */}
            <motion.div {...fadeUp}>
              <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest block mb-4">
                {c.whyUs.eyebrow}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                {c.whyUs.line1}
                <br />
                <span className="text-brand-cyan">{c.whyUs.line2}</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-10">
                {c.whyUs.sub}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan text-brand-blue rounded-full font-bold hover:bg-brand-cyan/90 transition-all"
                >
                  {c.hero.cta1} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-full font-bold hover:bg-white/8 transition-all"
                >
                  {lang === 'zh' ? '查看价格' : lang === 'ms' ? 'Lihat Harga' : 'View Pricing'}
                </Link>
              </div>
            </motion.div>

            {/* Right — checkpoints */}
            <div className="space-y-4">
              {c.whyUs.points.map((p, i) => (
                <motion.div
                  key={i}
                  {...stagger(i)}
                  className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/8 hover:border-brand-cyan/20 hover:bg-white/8 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm mb-1">{p.t}</div>
                    <div className="text-sm text-white/45 leading-relaxed">{p.d}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────── BLOG PREVIEW ── */}
      {posts.length > 0 && (
        <section className="py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">

            <motion.div
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
              {...fadeUp}
            >
              <div>
                <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest block mb-3">
                  {c.blog.eyebrow}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-brand-blue">{c.blog.title}</h2>
                <p className="text-brand-blue/55 mt-4 max-w-lg leading-relaxed">{c.blog.sub}</p>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-brand-cyan font-bold whitespace-nowrap hover:gap-3 transition-all shrink-0 group"
              >
                {c.blog.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.div key={post.id} {...stagger(i)}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group flex flex-col h-full rounded-[28px] border border-brand-blue/8 overflow-hidden bg-white hover:border-brand-cyan/30 hover:shadow-2xl hover:shadow-brand-blue/5 transition-all duration-300"
                  >
                    {post.image_url ? (
                      <div className="h-48 overflow-hidden shrink-0">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-32 bg-brand-blue/3 shrink-0 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-brand-cyan/30" />
                      </div>
                    )}
                    <div className="p-7 flex flex-col flex-grow">
                      <span className={`self-start mb-3 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        post.language === 'zh' ? 'bg-red-50 text-red-600' :
                        post.language === 'ms' ? 'bg-green-50 text-green-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {post.language === 'zh' ? '中文' : post.language === 'ms' ? 'BM' : 'EN'}
                      </span>
                      <h3 className="text-base font-bold text-brand-blue mb-3 leading-snug line-clamp-2 group-hover:text-brand-cyan transition-colors flex-grow">
                        {post.title}
                      </h3>
                      <p className="text-sm text-brand-blue/45 line-clamp-2 mb-5 leading-relaxed">
                        {post.meta_description}
                      </p>
                      <span className="text-xs font-bold text-brand-cyan flex items-center gap-1 group-hover:gap-2 transition-all">
                        {c.blog.read} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────── CTA BAND ── */}
      <section className="py-24 bg-brand-blue relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,212,255,0.10) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
              {c.final.title}
            </h2>
            <p className="text-white/55 text-lg mb-10 leading-relaxed">{c.final.sub}</p>
            <a
              href="https://wa.me/60172915754"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-brand-cyan text-brand-blue rounded-full font-bold text-base hover:bg-brand-cyan/90 transition-all shadow-xl shadow-brand-cyan/15"
            >
              <MessageSquare className="w-5 h-5" />
              {c.final.btn}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────── FOOTER ── */}
      <Footer lang={lang} />
    </div>
  );
}
