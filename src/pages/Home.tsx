/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight, MessageSquare, CheckCircle2,
  Video, Share2, TrendingUp, Globe, ShoppingBag,
  Zap, Shield,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { Navbar } from '../components/Navbar';
import { useLanguage, type Language } from '../hooks/useLanguage';

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
      sub: '从 TikTok 到小红书，从 Meta 广告到 Google SEO，我们帮马来西亚中小企业一站式攻占全平台。',
      cta1: '免费咨询',
      cta2: '查看服务',
      chips: ['品牌视觉', '社媒管理', 'Meta 广告', 'Google SEO', '电商方案'],
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
      sub: '我们用透明的价格、实战的策略，帮您的业务真正产生销售增长。',
      points: [
        { t: '价格透明，无隐藏费用', d: '每项服务标准明确，您清楚知道自己在为什么付费。' },
        { t: '效果导向，关注真实转化', d: '我们不只看数据，更关注您的实际销售增长与客户获取。' },
        { t: '全平台整合策略', d: 'SEO、社媒、电商、直播——统一品牌策略，全渠道协同。' },
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
      sub: 'From TikTok to Xiaohongshu, Meta Ads to Google SEO — we help Malaysian SMEs dominate digital, all in one place.',
      cta1: 'Free Consultation',
      cta2: 'Our Services',
      chips: ['Brand Identity', 'Social Media', 'Meta Ads', 'Google SEO', 'E-Commerce'],
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
        { t: 'Cross-Platform Integration', d: 'SEO, social, e-commerce, live streaming — one unified brand strategy across all channels.' },
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
      sub: 'Dari TikTok ke Xiaohongshu, Meta Ads ke Google SEO — kami bantu PKS Malaysia dominasi dunia digital.',
      cta1: 'Konsultasi Percuma',
      cta2: 'Perkhidmatan Kami',
      chips: ['Identiti Jenama', 'Media Sosial', 'Iklan Meta', 'Google SEO', 'E-Dagang'],
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
        { t: 'Integrasi Pelbagai Platform', d: 'SEO, media sosial, e-dagang, siaran langsung — strategi jenama bersatu merentasi semua saluran.' },
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
    { icon: <Video className="w-6 h-6" />, title: 'UGC / KOC 视频矩阵', desc: '达人真实测评视频，精准触达 TikTok & Instagram 受众，驱动高互动与转化。' },
    { icon: <Share2 className="w-6 h-6" />, title: '全网社媒运营', desc: '统一品牌形象，专业内容日历，Facebook / IG / TikTok 全平台持续增长。' },
    { icon: <TrendingUp className="w-6 h-6" />, title: '数字广告 & SEO', desc: 'Meta / Google 精准投放 + 长期搜索霸屏，双轮驱动高意向客户。' },
    { icon: <Globe className="w-6 h-6" />, title: '小红书企业营销', desc: '蓝V认证入驻、官方账号全案托管，KOC 批量种草触达华人市场。' },
    { icon: <ShoppingBag className="w-6 h-6" />, title: '电商全案 & 直播', desc: '多平台店铺搭建、360° 电商托管与专业直播带货，一站式覆盖。' },
  ],
  en: [
    { icon: <Video className="w-6 h-6" />, title: 'UGC / KOC Video Matrix', desc: 'Authentic creator videos optimised for TikTok & Instagram algorithms — driving real engagement.' },
    { icon: <Share2 className="w-6 h-6" />, title: 'Social Media Management', desc: 'Unified brand presence, professional content calendar, consistent growth across all platforms.' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Digital Ads & SEO', desc: 'Precision Meta/Google ads + long-term search dominance — dual engine for high-intent customers.' },
    { icon: <Globe className="w-6 h-6" />, title: 'Xiaohongshu Marketing', desc: 'Blue V verification, full account management, and mass KOC seeding for the Chinese market.' },
    { icon: <ShoppingBag className="w-6 h-6" />, title: 'E-Commerce & Live Streaming', desc: 'Multi-platform shop setup, 360° e-commerce management, and professional live broadcasting.' },
  ],
  ms: [
    { icon: <Video className="w-6 h-6" />, title: 'Matriks Video UGC / KOC', desc: 'Video pencipta autentik dioptimumkan untuk TikTok & Instagram — penglibatan dan penukaran nyata.' },
    { icon: <Share2 className="w-6 h-6" />, title: 'Pengurusan Media Sosial', desc: 'Kehadiran jenama bersatu, kalendar kandungan profesional, pertumbuhan berterusan merentasi semua platform.' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Iklan Digital & SEO', desc: 'Iklan Meta/Google yang tepat + dominasi carian jangka panjang — enjin pertumbuhan dua hala.' },
    { icon: <Globe className="w-6 h-6" />, title: 'Pemasaran Xiaohongshu', desc: 'Pengesahan Blue V, pengurusan akaun penuh, dan penanaman KOC berskala besar untuk pasaran Cina.' },
    { icon: <ShoppingBag className="w-6 h-6" />, title: 'E-Dagang & Siaran Langsung', desc: 'Persediaan kedai berbilang platform, pengurusan e-dagang 360°, dan siaran langsung profesional.' },
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
  const c = t[lang];
  const cards = serviceCards[lang];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef   = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero   = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COLOR = '#4ADE80', COUNT = 90;
    type Particle = { x: number; y: number; r: number; vy: number; vx: number; a: number };
    let ps: Particle[] = [];
    let W = 0, H = 0, animId = 0;

    function fit() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = hero!.clientWidth;
      H = hero!.clientHeight;
      canvas!.width  = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      ps = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2 + 0.6,
        vy: -(Math.random() * 0.5 + 0.12),
        vx: (Math.random() - 0.5) * 0.22,
        a: Math.random() * 0.6 + 0.18,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      ctx!.globalCompositeOperation = 'lighter';
      ctx!.fillStyle   = COLOR;
      ctx!.shadowColor = COLOR;
      ctx!.shadowBlur  = 8;
      for (const p of ps) {
        p.y += p.vy; p.x += p.vx;
        if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
        ctx!.globalAlpha = p.a;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    fit(); seed(); draw();
    const onResize = () => fit();
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
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
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'radial-gradient(1100px 700px at 75% 30%, #102742 0%, #0A1628 55%, #070f1c 100%)' }}
      >
        {/* Ambient drifting orbs */}
        <div aria-hidden className="hero-orb1" />
        <div aria-hidden className="hero-orb2" />

        {/* Rising particle canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%', opacity: 0.75, zIndex: 2 }}
        />

        {/* 3D scrolling grid */}
        <div aria-hidden className="hero-grid" />

        {/* Main content */}
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-28" style={{ zIndex: 3 }}>

          {/* Badge pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold"
            style={{ border: '1px solid rgba(74,222,128,.45)', background: 'rgba(74,222,128,.08)', color: '#BFF4CC' }}
          >
            <span aria-hidden className="hero-dot" />
            {c.hero.badge}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="font-black leading-[1.06] tracking-tight mb-6"
            style={{
              fontSize: 'clamp(38px, 6vw, 76px)',
              color: '#EAF2FF',
              textShadow: '0 0 30px rgba(74,222,128,.18)',
            }}
          >
            {c.hero.line1}
            <br />
            <span className="hero-accent">{c.hero.line2}</span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="text-lg max-w-[540px] mb-8 leading-[1.75]"
            style={{ color: '#9DB2CE' }}
          >
            {c.hero.sub}
          </motion.p>

          {/* Service chips */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="flex flex-wrap gap-2.5 mb-10"
          >
            {c.hero.chips.map((chip, i) => (
              <span key={i} className="hero-chip" style={{ animationDelay: `${i * 0.8}s` }}>
                {chip}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.42 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Link to="/contact" className="hero-btn-primary">
              {c.hero.cta1} →
            </Link>
            <Link to="/services" className="hero-btn-ghost">
              {c.hero.cta2}
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-wrap gap-x-10 gap-y-5 pt-8"
            style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}
          >
            {c.stats.map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-bold" style={{ color: '#4ADE80' }}>{s.value}</div>
                <div className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,.35)' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Spinning rings with logo — desktop only */}
        <div aria-hidden className="hero-ring hidden lg:flex">
          <div className="hero-ring-outer" />
          <div className="hero-ring-dash" />
          <div className="hero-ring-glow" />
          <div className="hero-ring-core">
            <img
              src="/logo.png"
              alt=""
              className="w-[184px]"
              style={{ filter: 'drop-shadow(0 0 16px rgba(74,222,128,.55))' }}
            />
          </div>
        </div>

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

          {/* 5 service cards */}
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
              href="https://wa.me/60134391541"
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
      <footer className="py-10 border-t border-brand-blue/6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/">
            <img src="/logo.png" alt="Cheaper Nexus" className="h-10 w-auto object-contain" />
          </Link>
          <p className="text-brand-blue/35 text-sm">
            © {new Date().getFullYear()} Cheaper Nexus. {c.footer.copy}.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            {[
              { to: '/services', label: c.footer.services },
              { to: '/pricing',  label: c.footer.pricing  },
              { to: '/blog',     label: 'Blog'            },
              { to: '/contact',  label: c.footer.contact  },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-brand-blue/35 hover:text-brand-cyan transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
