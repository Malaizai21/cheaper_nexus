import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle2, Phone, Video, Share2, TrendingUp, ShoppingBag, BookOpen } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useLanguage, type Language } from '../hooks/useLanguage';

const SITE_URL = 'https://cheapernexus.com';

const t: Record<Language, {
  hero: { tag: string; title: string; subtitle: string };
  included: string; pricingOptions: string; getQuote: string;
  faqTitle: string; ctaTitle: string; ctaSubtitle: string;
  viewPackages: string;
  services: { title: string; subtitle: string; description: string; includes: string[]; options: { name: string; price: string; unit: string }[]; note?: string }[];
  faqs: { q: string; a: string }[];
}> = {
  zh: {
    hero: {
      tag: '我们的服务',
      title: '马来西亚数码营销全套服务',
      subtitle: '从内容创作、社媒管理到付费广告和 SEO——一切您的业务在马来西亚线上增长所需的服务。价格透明，无隐藏费用。',
    },
    included: '服务内容包含',
    pricingOptions: '价格选项',
    getQuote: '获取报价',
    viewPackages: '查看套餐',
    faqTitle: '常见问题',
    ctaTitle: '不确定选哪个服务？',
    ctaSubtitle: '通过 WhatsApp 联系我们——我们会根据您的业务目标和预算推荐最合适的策略，完全免费。',
    services: [
      {
        title: 'UGC 短视频制作',
        subtitle: '拍摄、剪接、写剧本一站包办，按支计价',
        description: '为 TikTok 和 Instagram 算法深度优化的原生风格短视频。从脚本撰写、实地拍摄到后期剪接，全程由我们的团队一手包办，价格透明，按支计费。',
        includes: ['专业拍摄', '后期剪接', '脚本撰写'],
        options: [
          { name: 'UGC 短视频（含拍摄、剪接、写剧本）', price: 'RM 500', unit: '/ 支' },
        ],
      },
      {
        title: 'Meta 广告与内容管理',
        subtitle: 'Facebook / Instagram 帖文文案与广告投放一体化管理',
        description: '统一负责您的 Meta 内容与广告——从帖文文案撰写、内容排期，到广告投放定向与优化，全部整合为一个月费方案，让您的品牌在 Facebook 和 Instagram 上持续曝光并转化。',
        includes: ['Meta 帖文文案撰写', '内容排期发布', '广告投放与优化'],
        options: [
          { name: 'Meta Post 文案 + 广告管理', price: 'RM 2,000', unit: '/ 月' },
        ],
      },
      {
        title: '小红书企业营销',
        subtitle: 'KOC 种草铺量，触达华人消费市场',
        description: '通过大规模 KOC 种草活动，主导中国最大种草平台的品牌曝光。对于面向马来西亚华人消费者的品牌来说，这是不可或缺的渠道。',
        includes: ['KOC 达人筛选与对接', '种草内容铺量发布', '效果数据追踪'],
        options: [
          { name: 'KOC 种草铺量', price: 'RM 4,500', unit: '/ 10 篇' },
        ],
      },
      {
        title: 'Google 广告与 SEO 优化',
        subtitle: 'Google 广告投放、GEO & SEO 搜索优化',
        description: '精准广告定向和长期搜索引擎主导地位，在漏斗每个阶段捕获高意向客户。我们像管理自己的预算一样管理您的投入。',
        includes: ['Google 广告投放', 'GEO & SEO 搜索优化', '高转化落地页', '数据效果追踪'],
        note: 'SEO 最少 6 个月周期，广告投放费用由客户直接支付至平台。',
        options: [
          { name: 'Google 广告投放：基础版', price: 'RM 1,200', unit: '/ 月' },
          { name: 'Google 广告投放：标准版', price: 'RM 2,000', unit: '/ 月' },
          { name: 'GEO & SEO 搜索优化（最少 6 个月）', price: 'RM 2,500', unit: '/ 月' },
          { name: '高转化落地页', price: '从 RM 1,000', unit: '/ 页' },
        ],
      },
      {
        title: '电商与直播运营',
        subtitle: '多平台店铺搭建、360° 全托管及直播服务',
        description: '从多平台店铺搭建到全面运营管理和专业直播的端到端电商解决方案。我们帮助您在 Shopee、Lazada 和 TikTok Shop 上实现销售突破。',
        includes: ['多平台开店及店铺装修', '电商 360° 全托管', '官方直播 / 播出服务'],
        options: [
          { name: '多平台开店及基础装修', price: 'RM 1,888', unit: '单次' },
          { name: '电商 360° 全托管', price: 'RM 5,000', unit: '/ 月' },
          { name: '官方直播 / 播出服务', price: 'RM 2,500', unit: '/ 月' },
        ],
      },
    ],
    faqs: [
      { q: 'Cheaper Nexus 在马来西亚提供哪些数码营销服务？', a: 'Cheaper Nexus 提供 UGC 短视频制作、Meta 广告与内容管理、小红书 KOC 种草、Google 广告与 SEO，以及电商与直播服务。' },
      { q: '马来西亚数码营销的费用是多少？', a: 'Cheaper Nexus 服务从 UGC 短视频 RM 500/支起，Meta 内容与广告管理 RM 2,000/月，Google 广告管理 RM 1,200/月起，SEO RM 2,500/月。' },
      { q: 'Cheaper Nexus 是否提供小红书营销服务？', a: '是的。我们专注于小红书 KOC 种草铺量服务，帮助马来西亚品牌快速触达华人消费市场，RM 4,500 起可获 10 篇种草内容。' },
    ],
  },
  en: {
    hero: {
      tag: 'Our Services',
      title: 'Digital Marketing Services for Malaysian Businesses',
      subtitle: 'From content creation to paid ads and SEO — everything your business needs to grow online in Malaysia. Transparent pricing, no hidden fees.',
    },
    included: "What's Included",
    pricingOptions: 'Pricing Options',
    getQuote: 'Get a Quote',
    viewPackages: 'View Packages',
    faqTitle: 'Frequently Asked Questions',
    ctaTitle: "Not Sure Which Service You Need?",
    ctaSubtitle: "Chat with us on WhatsApp — we'll recommend the right strategy based on your business goals and budget. Completely free.",
    services: [
      {
        title: 'UGC Short-Video Production',
        subtitle: 'Filming, editing & scriptwriting handled end-to-end, priced per video',
        description: "Native-style short-video content optimised for TikTok and Instagram algorithms. From scriptwriting to on-location filming to post-production editing, our team handles everything — transparent per-video pricing.",
        includes: ['Professional Filming', 'Post-Production Editing', 'Scriptwriting'],
        options: [
          { name: 'UGC Short Video (Filming + Editing + Script)', price: 'RM 500', unit: '/ video' },
        ],
      },
      {
        title: 'Meta Ads & Content Management',
        subtitle: 'Unified Facebook/Instagram post copywriting and ad management',
        description: "One team, one price, both sides of Meta covered — post copywriting, content scheduling, and ad targeting & optimisation combined into a single monthly plan, keeping your brand consistently visible and converting on Facebook and Instagram.",
        includes: ['Meta Post Copywriting', 'Content Scheduling', 'Ads Management & Optimisation'],
        options: [
          { name: 'Meta Post Copywriting + Ads Management', price: 'RM 2,000', unit: '/ month' },
        ],
      },
      {
        title: 'XHS / Xiaohongshu Marketing',
        subtitle: 'Organic KOC seeding to reach Chinese-speaking consumers',
        description: "Dominate China's leading discovery platform through mass organic KOC seeding campaigns. Essential for brands targeting Malaysian Chinese consumers.",
        includes: ['KOC Sourcing & Coordination', 'Mass Seeding Content Placement', 'Performance Tracking'],
        options: [
          { name: 'KOC Seeding', price: 'RM 4,500', unit: '/ 10 posts' },
        ],
      },
      {
        title: 'Google Ads & SEO',
        subtitle: 'Google ad placement, GEO & SEO optimization',
        description: "Precision ad targeting and long-term search engine dominance to capture high-intent customers at every stage of the funnel. We manage your budget like it's our own.",
        includes: ['Google Ad Placement', 'GEO & SEO Optimization', 'High-Conversion Landing Page', 'Performance Analytics'],
        note: 'SEO requires minimum 6-month commitment. Ad spend paid directly to platform.',
        options: [
          { name: 'Google Ad Placement: Starter Edition', price: 'RM 1,200', unit: '/ month' },
          { name: 'Google Ad Placement: Standard Edition', price: 'RM 2,000', unit: '/ month' },
          { name: 'GEO & SEO Optimization (Min. 6 Months)', price: 'RM 2,500', unit: '/ month' },
          { name: 'High-Conversion Landing Page', price: 'From RM 1,000', unit: '/ page' },
        ],
      },
      {
        title: 'E-Commerce & Live Streaming',
        subtitle: 'Multi-platform shop setup, 360° management & live broadcasting',
        description: "End-to-end e-commerce solution from multi-platform shop setup to full-scale management and professional live streaming. We help you sell on Shopee, Lazada, and TikTok Shop.",
        includes: ['Multi-Platform Setup & Store Decoration', 'E-Commerce 360° Full Management', 'Official Live Streaming / Broadcasting'],
        options: [
          { name: 'Multi-Platform Setup & Basic Store Decoration', price: 'RM 1,888', unit: 'one-time' },
          { name: 'E-Commerce 360° Full Management', price: 'RM 5,000', unit: '/ month' },
          { name: 'Official Live Streaming / Broadcasting Service', price: 'RM 2,500', unit: '/ month' },
        ],
      },
    ],
    faqs: [
      { q: 'What digital marketing services does Cheaper Nexus offer in Malaysia?', a: 'Cheaper Nexus offers UGC short-video production, Meta ads & content management, Xiaohongshu KOC seeding, Google ads & SEO, and e-commerce & live streaming services.' },
      { q: 'How much does digital marketing cost in Malaysia?', a: 'Services start from RM 500 per UGC video, RM 2,000/month for combined Meta content and ads management, RM 1,200/month for Google ad management, and RM 2,500/month for SEO.' },
      { q: 'Does Cheaper Nexus offer Xiaohongshu marketing in Malaysia?', a: 'Yes. We focus on organic KOC seeding to help Malaysian brands reach Chinese-speaking consumers quickly — RM 4,500 gets you 10 seeded posts.' },
    ],
  },
  ms: {
    hero: {
      tag: 'Perkhidmatan Kami',
      title: 'Perkhidmatan Pemasaran Digital untuk Perniagaan Malaysia',
      subtitle: 'Dari penciptaan kandungan hingga iklan berbayar dan SEO — semua yang perniagaan anda perlukan untuk berkembang dalam talian di Malaysia. Harga telus, tiada caj tersembunyi.',
    },
    included: 'Apa Yang Disertakan',
    pricingOptions: 'Pilihan Harga',
    getQuote: 'Dapatkan Sebut Harga',
    viewPackages: 'Lihat Pakej',
    faqTitle: 'Soalan Lazim',
    ctaTitle: 'Tidak Pasti Perkhidmatan Yang Diperlukan?',
    ctaSubtitle: 'Hubungi kami melalui WhatsApp — kami akan mengesyorkan strategi yang tepat berdasarkan matlamat dan bajet perniagaan anda. Percuma sepenuhnya.',
    services: [
      {
        title: 'Penerbitan Video Pendek UGC',
        subtitle: 'Penggambaran, penyuntingan & penulisan skrip diuruskan sepenuhnya, dikenakan bayaran setiap video',
        description: 'Kandungan video pendek gaya natif yang dioptimumkan untuk algoritma TikTok dan Instagram. Dari penulisan skrip, penggambaran di lokasi, hingga penyuntingan pasca-produksi — pasukan kami uruskan semuanya dengan harga telus setiap video.',
        includes: ['Penggambaran Profesional', 'Penyuntingan Pasca-Produksi', 'Penulisan Skrip'],
        options: [
          { name: 'Video Pendek UGC (Penggambaran + Penyuntingan + Skrip)', price: 'RM 500', unit: '/ video' },
        ],
      },
      {
        title: 'Pengurusan Iklan & Kandungan Meta',
        subtitle: 'Penulisan kandungan dan pengurusan iklan Facebook/Instagram bersepadu',
        description: 'Satu pasukan, satu harga, kedua-dua bahagian Meta diuruskan — penulisan kandungan hantaran, penjadualan kandungan, serta penyasaran dan pengoptimuman iklan digabungkan dalam satu pakej bulanan, memastikan jenama anda kelihatan konsisten dan menukar prospek di Facebook dan Instagram.',
        includes: ['Penulisan Kandungan Meta', 'Penjadualan Kandungan', 'Pengurusan & Pengoptimuman Iklan'],
        options: [
          { name: 'Penulisan Kandungan Meta + Pengurusan Iklan', price: 'RM 2,000', unit: '/ bulan' },
        ],
      },
      {
        title: 'Pemasaran XHS / Xiaohongshu',
        subtitle: 'Penanaman KOC organik untuk menjangkau pengguna berbahasa Cina',
        description: 'Dominasi platform penemuan terkemuka China melalui kempen penanaman KOC organik besar-besaran. Penting untuk jenama yang menyasarkan pengguna Cina Malaysia.',
        includes: ['Pencarian & Penyelarasan KOC', 'Penempatan Kandungan Besar-besaran', 'Penjejakan Prestasi'],
        options: [
          { name: 'Penanaman KOC', price: 'RM 4,500', unit: '/ 10 catatan' },
        ],
      },
      {
        title: 'Iklan Google & SEO',
        subtitle: 'Penempatan iklan Google, pengoptimuman GEO & SEO',
        description: 'Penyasaran iklan tepat dan dominasi enjin carian jangka panjang untuk menangkap pelanggan berhasrat tinggi di setiap peringkat.',
        includes: ['Penempatan Iklan Google', 'Pengoptimuman GEO & SEO', 'Halaman Pendaratan Penukaran Tinggi', 'Analitik Prestasi'],
        note: 'SEO memerlukan komitmen minimum 6 bulan. Belanja iklan dibayar terus ke platform.',
        options: [
          { name: 'Penempatan Iklan Google: Edisi Permulaan', price: 'RM 1,200', unit: '/ bulan' },
          { name: 'Penempatan Iklan Google: Edisi Standard', price: 'RM 2,000', unit: '/ bulan' },
          { name: 'Pengoptimuman GEO & SEO (Min. 6 Bulan)', price: 'RM 2,500', unit: '/ bulan' },
          { name: 'Halaman Pendaratan Penukaran Tinggi', price: 'Dari RM 1,000', unit: '/ halaman' },
        ],
      },
      {
        title: 'E-Dagang & Penstriman Langsung',
        subtitle: 'Persediaan kedai pelbagai platform, pengurusan 360° & siaran langsung',
        description: 'Penyelesaian e-dagang hujung ke hujung dari persediaan kedai pelbagai platform hingga pengurusan berskala penuh dan penstriman langsung profesional.',
        includes: ['Persediaan Pelbagai Platform & Hiasan Kedai', 'Pengurusan Penuh E-Dagang 360°', 'Perkhidmatan Siaran Langsung Rasmi'],
        options: [
          { name: 'Persediaan Pelbagai Platform & Hiasan Asas', price: 'RM 1,888', unit: 'sekali' },
          { name: 'Pengurusan Penuh E-Dagang 360°', price: 'RM 5,000', unit: '/ bulan' },
          { name: 'Perkhidmatan Siaran Langsung Rasmi', price: 'RM 2,500', unit: '/ bulan' },
        ],
      },
    ],
    faqs: [
      { q: 'Apakah perkhidmatan pemasaran digital yang ditawarkan Cheaper Nexus di Malaysia?', a: 'Cheaper Nexus menawarkan penerbitan video pendek UGC, pengurusan iklan & kandungan Meta, penanaman KOC Xiaohongshu, iklan Google & SEO, serta e-dagang & penstriman langsung.' },
      { q: 'Berapakah kos pemasaran digital di Malaysia?', a: 'Perkhidmatan bermula dari RM 500 setiap video UGC, RM 2,000/bulan untuk kandungan dan pengurusan iklan Meta bersepadu, RM 1,200/bulan untuk pengurusan iklan Google, dan RM 2,500/bulan untuk SEO.' },
      { q: 'Adakah Cheaper Nexus menawarkan pemasaran Xiaohongshu di Malaysia?', a: 'Ya. Kami menumpukan kepada penanaman KOC organik untuk membantu jenama Malaysia menjangkau pengguna berbahasa Cina dengan pantas — RM 4,500 untuk 10 catatan penanaman.' },
    ],
  },
};

const icons = [
  <Video className="w-7 h-7" />,
  <Share2 className="w-7 h-7" />,
  <BookOpen className="w-7 h-7" />,
  <TrendingUp className="w-7 h-7" />,
  <ShoppingBag className="w-7 h-7" />,
];

const metaT: Record<Language, { title: string; desc: string }> = {
  zh: { title: '马来西亚数码营销服务 | Cheaper Nexus', desc: '马来西亚全套数码营销服务：UGC视频、社媒管理、小红书营销、Meta & Google广告、SEO、电商。从 RM 1,000 起。' },
  en: { title: 'Digital Marketing Services Malaysia | Cheaper Nexus', desc: 'Comprehensive digital marketing services in Malaysia: UGC videos, social media management, Xiaohongshu, Meta & Google ads, SEO, and e-commerce. Starting from RM 1,000.' },
  ms: { title: 'Perkhidmatan Pemasaran Digital Malaysia | Cheaper Nexus', desc: 'Perkhidmatan pemasaran digital komprehensif di Malaysia: video UGC, pengurusan media sosial, Xiaohongshu, iklan Meta & Google, SEO, dan e-dagang. Bermula dari RM 1,000.' },
};

export default function Services() {
  const [lang, setLang] = useLanguage();
  const content = t[lang];
  const meta = metaT[lang];

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.desc} />
        <link rel="canonical" href={`${SITE_URL}/services`} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.desc} />
        <meta property="og:url" content={`${SITE_URL}/services`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: content.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-brand-white">
        <Navbar lang={lang} setLang={setLang} />

        {/* Header */}
        <div className="bg-brand-blue text-white pt-32 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full text-brand-cyan text-sm font-semibold mb-6">
              {content.hero.tag}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-2xl">{content.hero.title}</h1>
            <p className="text-white/60 text-lg max-w-2xl mb-8">{content.hero.subtitle}</p>
            <div className="flex flex-wrap gap-4">
              <a href="https://wa.me/60172915754" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan text-brand-blue rounded-full font-bold hover:opacity-90 transition-opacity">
                <Phone className="w-4 h-4" /> WhatsApp Henry
              </a>
              <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-all">
                {content.viewPackages} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 space-y-20">
          {content.services.map((s, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="w-14 h-14 bg-brand-blue text-brand-cyan rounded-2xl flex items-center justify-center mb-6">{icons[i]}</div>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-blue mb-2">{s.title}</h2>
                <p className="text-brand-cyan font-semibold mb-4">{s.subtitle}</p>
                <p className="text-brand-blue/60 leading-relaxed mb-6">{s.description}</p>
                <p className="text-sm font-bold text-brand-blue mb-3">{content.included}:</p>
                <ul className="space-y-2 mb-6">
                  {s.includes.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-brand-blue/70">
                      <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
                {s.note && <p className="text-xs text-brand-blue/40 italic mb-4">* {s.note}</p>}
                <a href="https://wa.me/60172915754" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-cyan font-bold text-sm hover:gap-3 transition-all">
                  {content.getQuote} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="bg-brand-blue/3 border border-brand-blue/8 rounded-[28px] p-8">
                <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-6">{content.pricingOptions}</p>
                <div className="space-y-4">
                  {s.options.map((opt, j) => (
                    <div key={j} className="flex items-center justify-between py-4 border-b border-brand-blue/5 last:border-0">
                      <span className="text-sm text-brand-blue/70 pr-4">{opt.name}</span>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-brand-blue">{opt.price}</div>
                        <div className="text-xs text-brand-blue/40">{opt.unit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-brand-blue/3 border-t border-brand-blue/5">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
            <h2 className="text-2xl font-bold text-brand-blue mb-10 text-center">{content.faqTitle}</h2>
            <div className="space-y-6">
              {content.faqs.map((faq, i) => (
                <div key={i} className="p-6 bg-white rounded-2xl border border-brand-blue/5">
                  <h3 className="font-bold text-brand-blue mb-2">{faq.q}</h3>
                  <p className="text-brand-blue/60 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-brand-blue text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{content.ctaTitle}</h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">{content.ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/60172915754" target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 bg-brand-cyan text-brand-blue rounded-full font-bold hover:opacity-90 transition-opacity">
                WhatsApp Henry — 017-291 5754
              </a>
              <a href="https://wa.me/60172915754" target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-all">
                WhatsApp Henry — 017-291 5754
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
