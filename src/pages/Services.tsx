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
        title: 'UGC / KOC 视频矩阵',
        subtitle: '达人真实测评视频，精准触达 TikTok 和 Instagram 受众',
        description: '通过真实达人内容驱动高互动率，内容经过 TikTok 和 Instagram 算法深度优化。我们负责寻找、brief 和管理完整的达人矩阵，规模化建立品牌信任。',
        includes: ['UGC / KOC 视频矩阵（5 支）', 'TikTok / IG 达人开箱视频矩阵（10 支）', '脚本策划与创意指导'],
        options: [
          { name: 'UGC / KOC 视频矩阵', price: 'RM 1,250', unit: '/ 5 支' },
          { name: 'TikTok / IG 达人开箱矩阵', price: 'RM 3,500', unit: '/ 10 支' },
        ],
      },
      {
        title: '全网社媒运营管理',
        subtitle: '全平台视觉框架搭建及月度增长套餐',
        description: '统一所有社交平台的品牌形象，配备专业内容日历和互动管理团队。我们全权负责，让您专注于经营业务。',
        includes: ['全网视觉框架搭建', '内容日常更新与排期', '社群管理与私信回复'],
        options: [
          { name: '全网视觉框架搭建（基础版）', price: 'RM 1,000', unit: '单次' },
          { name: '套餐 A：数字基础设施方案', price: 'RM 1,800', unit: '/ 月' },
          { name: '套餐 B：视频增长引擎', price: 'RM 3,888', unit: '/ 月' },
        ],
      },
      {
        title: '小红书企业营销',
        subtitle: '蓝V认证、账号全托管及 KOC 种草矩阵',
        description: '通过认证品牌身份和大规模 KOC 种草活动，主导中国最大种草平台的品牌曝光。对于面向马来西亚华人消费者的品牌来说，这是不可或缺的渠道。',
        includes: ['企业蓝V认证及生态入驻', '官方账号全托管', '有机 KOC 种草（大规模铺量）'],
        options: [
          { name: '企业蓝V认证及生态入驻', price: 'RM 3,500', unit: '单次' },
          { name: '官方账号全托管', price: 'RM 2,500', unit: '/ 月' },
          { name: '有机 KOC 种草（大规模铺量）', price: 'RM 3,500', unit: '/ 10 篇' },
        ],
      },
      {
        title: '数字广告与 SEO 优化',
        subtitle: 'Meta/Google 广告投放、GEO & SEO 搜索优化',
        description: '精准广告定向和长期搜索引擎主导地位，在漏斗每个阶段捕获高意向客户。我们像管理自己的预算一样管理您的投入。',
        includes: ['Meta & Google 广告投放', 'GEO & SEO 搜索优化', '高转化落地页', '数据效果追踪'],
        note: 'SEO 最少 6 个月周期，广告投放费用由客户直接支付至平台。',
        options: [
          { name: '广告投放：基础版', price: 'RM 1,200', unit: '/ 月' },
          { name: '广告投放：标准版', price: 'RM 2,000', unit: '/ 月' },
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
      { q: 'Cheaper Nexus 在马来西亚提供哪些数码营销服务？', a: 'Cheaper Nexus 提供 UGC/KOC 视频内容、社媒管理、小红书营销、数字广告与 SEO（Meta、Google），以及电商与直播服务。' },
      { q: '马来西亚数码营销的费用是多少？', a: 'Cheaper Nexus 服务从 RM 1,000 的社媒基础搭建起，广告管理 RM 1,200/月，SEO RM 2,500/月。完整套餐从 RM 1,688/月起。' },
      { q: 'Cheaper Nexus 是否提供小红书营销服务？', a: '是的。我们提供完整的小红书服务，包括蓝V企业认证、官方账号全托管，以及针对马来西亚本地品牌的 KOC 种草活动。' },
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
        title: 'UGC & KOC Video Content',
        subtitle: 'Authentic creator video matrix for TikTok & Instagram',
        description: "Drive authentic engagement with real-creator content optimised for TikTok and Instagram algorithms. We source, brief, and manage a full creator matrix that builds trust at scale.",
        includes: ['UGC / KOC Video Matrix (5 videos)', 'TikTok / IG Influencer Unboxing Matrix (10 videos)', 'Script & Creative Direction'],
        options: [
          { name: 'UGC / KOC Video Matrix', price: 'RM 1,250', unit: '/ 5 videos' },
          { name: 'TikTok / IG Influencer Unboxing Matrix', price: 'RM 3,500', unit: '/ 10 videos' },
        ],
      },
      {
        title: 'Social Media Management',
        subtitle: 'Full-network visual framework and monthly growth packages',
        description: "Unified brand presence across all social platforms with a dedicated content calendar and engagement team. We handle everything so you can focus on running your business.",
        includes: ['Full-Network Visual Framework Setup', 'Daily Content & Scheduling', 'Community Management & Reply'],
        options: [
          { name: 'Full-Network Visual Framework (Basic Setup)', price: 'RM 1,000', unit: 'one-time' },
          { name: 'Package A: Digital Infrastructure Plan', price: 'RM 1,800', unit: '/ month' },
          { name: 'Package B: Video Growth Engine', price: 'RM 3,888', unit: '/ month' },
        ],
      },
      {
        title: 'XHS / Xiaohongshu Marketing',
        subtitle: 'Blue V verification, full account management & KOC seeding',
        description: "Dominate China's leading discovery platform with certified brand presence and mass organic KOC seeding campaigns. Essential for brands targeting Malaysian Chinese consumers.",
        includes: ['Enterprise Blue V Verification & Onboarding', 'Official Account Full Management', 'Organic KOC Seeding (Mass Placement)'],
        options: [
          { name: 'Enterprise Blue V Verification & Ecosystem Onboarding', price: 'RM 3,500', unit: 'one-time' },
          { name: 'Official Account Full Account Management', price: 'RM 2,500', unit: '/ month' },
          { name: 'Organic KOC Seeding (Mass Placement)', price: 'RM 3,500', unit: '/ 10 posts' },
        ],
      },
      {
        title: 'Digital Ads & SEO',
        subtitle: 'Meta/Google ad placement, GEO & SEO optimization',
        description: "Precision ad targeting and long-term search engine dominance to capture high-intent customers at every stage of the funnel. We manage your budget like it's our own.",
        includes: ['Meta & Google Ad Placement', 'GEO & SEO Optimization', 'High-Conversion Landing Page', 'Performance Analytics'],
        note: 'SEO requires minimum 6-month commitment. Ad spend paid directly to platform.',
        options: [
          { name: 'Ad Placement: Starter Edition', price: 'RM 1,200', unit: '/ month' },
          { name: 'Ad Placement: Standard Edition', price: 'RM 2,000', unit: '/ month' },
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
      { q: 'What digital marketing services does Cheaper Nexus offer in Malaysia?', a: 'Cheaper Nexus offers UGC & KOC video content, social media management, Xiaohongshu (XHS) marketing, digital ads & SEO (Meta, Google), and e-commerce & live streaming services.' },
      { q: 'How much does digital marketing cost in Malaysia?', a: 'Services start from RM 1,000 for social media setup, RM 1,200/month for ad management, and RM 2,500/month for SEO. Full packages start from RM 1,688/month.' },
      { q: 'Does Cheaper Nexus offer Xiaohongshu marketing in Malaysia?', a: 'Yes. We offer full XHS services including Blue V enterprise verification, official account management, and organic KOC seeding for Malaysian brands targeting the Chinese consumer market.' },
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
        title: 'Kandungan Video UGC & KOC',
        subtitle: 'Matriks video pencipta autentik untuk TikTok & Instagram',
        description: 'Picu penglibatan tulen dengan kandungan pencipta sebenar yang dioptimumkan untuk algoritma TikTok dan Instagram. Kami mencari, membriefkan dan menguruskan matriks pencipta penuh.',
        includes: ['Matriks Video UGC / KOC (5 video)', 'Matriks Unboxing Influencer TikTok / IG (10 video)', 'Skrip & Hala Tuju Kreatif'],
        options: [
          { name: 'Matriks Video UGC / KOC', price: 'RM 1,250', unit: '/ 5 video' },
          { name: 'Matriks Unboxing Influencer TikTok / IG', price: 'RM 3,500', unit: '/ 10 video' },
        ],
      },
      {
        title: 'Pengurusan Media Sosial',
        subtitle: 'Rangka kerja visual seluruh rangkaian dan pakej pertumbuhan bulanan',
        description: 'Kehadiran jenama bersatu merentasi semua platform sosial dengan kalendar kandungan khusus dan pasukan penglibatan. Kami uruskan segalanya.',
        includes: ['Persediaan Rangka Kerja Visual Seluruh Rangkaian', 'Kandungan Harian & Penjadualan', 'Pengurusan Komuniti & Balas'],
        options: [
          { name: 'Persediaan Rangka Kerja Visual (Asas)', price: 'RM 1,000', unit: 'sekali' },
          { name: 'Pakej A: Pelan Infrastruktur Digital', price: 'RM 1,800', unit: '/ bulan' },
          { name: 'Pakej B: Enjin Pertumbuhan Video', price: 'RM 3,888', unit: '/ bulan' },
        ],
      },
      {
        title: 'Pemasaran XHS / Xiaohongshu',
        subtitle: 'Pengesahan Blue V, pengurusan akaun penuh & penanaman KOC',
        description: 'Dominasi platform penemuan terkemuka China dengan kehadiran jenama bertauliah dan kempen penanaman KOC organik besar-besaran.',
        includes: ['Pengesahan Blue V Perusahaan & Onboarding', 'Pengurusan Penuh Akaun Rasmi', 'Penanaman KOC Organik (Penempatan Besar-besaran)'],
        options: [
          { name: 'Pengesahan Blue V & Onboarding Ekosistem', price: 'RM 3,500', unit: 'sekali' },
          { name: 'Pengurusan Penuh Akaun Rasmi', price: 'RM 2,500', unit: '/ bulan' },
          { name: 'Penanaman KOC Organik (Besar-besaran)', price: 'RM 3,500', unit: '/ 10 catatan' },
        ],
      },
      {
        title: 'Iklan Digital & SEO',
        subtitle: 'Penempatan iklan Meta/Google, pengoptimuman GEO & SEO',
        description: 'Penyasaran iklan tepat dan dominasi enjin carian jangka panjang untuk menangkap pelanggan berhasrat tinggi di setiap peringkat.',
        includes: ['Penempatan Iklan Meta & Google', 'Pengoptimuman GEO & SEO', 'Halaman Pendaratan Penukaran Tinggi', 'Analitik Prestasi'],
        note: 'SEO memerlukan komitmen minimum 6 bulan. Belanja iklan dibayar terus ke platform.',
        options: [
          { name: 'Penempatan Iklan: Edisi Permulaan', price: 'RM 1,200', unit: '/ bulan' },
          { name: 'Penempatan Iklan: Edisi Standard', price: 'RM 2,000', unit: '/ bulan' },
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
      { q: 'Apakah perkhidmatan pemasaran digital yang ditawarkan Cheaper Nexus di Malaysia?', a: 'Cheaper Nexus menawarkan kandungan video UGC & KOC, pengurusan media sosial, pemasaran Xiaohongshu, iklan digital & SEO (Meta, Google), serta e-dagang & penstriman langsung.' },
      { q: 'Berapakah kos pemasaran digital di Malaysia?', a: 'Perkhidmatan bermula dari RM 1,000 untuk persediaan media sosial, RM 1,200/bulan untuk pengurusan iklan, dan RM 2,500/bulan untuk SEO. Pakej penuh bermula dari RM 1,688/bulan.' },
      { q: 'Adakah Cheaper Nexus menawarkan pemasaran Xiaohongshu di Malaysia?', a: 'Ya. Kami menawarkan perkhidmatan XHS penuh termasuk pengesahan Blue V perusahaan, pengurusan akaun rasmi, dan kempen penanaman KOC organik.' },
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
