import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Phone, ArrowRight, Star, Video, Share2, BookOpen, TrendingUp, ShoppingBag } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useLanguage, type Language } from '../hooks/useLanguage';

const SITE_URL = 'https://cheapernexus.com';

const t: Record<Language, {
  hero: { tag: string; title: string; subtitle: string };
  packagesTitle: string; packagesSub: string;
  enterprise: string; enterpriseDesc: string;
  singleTitle: string; singleSub: string;
  ctaTitle: string; ctaSubtitle: string; viewServices: string;
  getStarted: string; mostPopular: string;
  tiers: { name: string; tagline: string; features: { category: string; value: string }[] }[];
  singleServices: { title: string; price: string; unit: string; desc: string }[];
}> = {
  zh: {
    hero: { tag: '价格透明', title: '马来西亚数码营销套餐', subtitle: '无隐藏费用，无模糊月费。每个套餐都清楚列明您所获得的内容，让您做出明智的决定。' },
    packagesTitle: '选择您的增长套餐', packagesSub: '针对业务各发展阶段的捆绑解决方案。',
    enterprise: '企业定制方案', enterpriseDesc: '专为高速增长企业和IPO准备中品牌量身定制。',
    singleTitle: '单项服务价格', singleSub: '五大核心服务，价格透明，可单独订购或自由组合。',
    ctaTitle: '准备好开始了吗？', ctaSubtitle: '联系我们——帮您选择最适合预算和目标的套餐。',
    viewServices: '查看所有服务', getStarted: '立即开始', mostPopular: '最受欢迎',
    tiers: [
      { name: 'Meta 广告与内容', tagline: '内容 + 广告一体化', features: [
        { category: '内容文案', value: 'Meta 帖文文案撰写' },
        { category: '内容排期', value: '每周内容规划与发布' },
        { category: '广告管理', value: '广告投放定向与优化' },
        { category: '平台', value: 'Facebook & Instagram' },
        { category: '支持服务', value: 'WhatsApp 直接对接' },
      ]},
      { name: 'Growth Booster', tagline: '主动增长', features: [
        { category: '视频内容', value: '4 支短视频' },
        { category: '图文帖子', value: '8 篇创意帖子' },
        { category: '平台', value: 'FB / IG / TikTok' },
        { category: '广告管理', value: '广告设置与主动监控' },
        { category: '内容文案', value: '内容规划、文案撰写、限时动态发布' },
        { category: '策略', value: '月度营销活动规划' },
        { category: '报告', value: '月度绩效报告' },
      ]},
      { name: 'Ultimate', tagline: '战略主导', features: [
        { category: '视频内容', value: '12 支专业视频' },
        { category: '图文帖子', value: '10 篇创意帖子' },
        { category: '平台', value: 'FB / IG / TikTok / 小红书' },
        { category: '广告管理', value: '完整广告策略与漏斗搭建' },
        { category: '内容文案', value: '内容规划、活动创意、品牌定位' },
        { category: '策略', value: '销售漏斗规划' },
        { category: '支持服务', value: '营销讨论与优先支持' },
      ]},
    ],
    singleServices: [
      { title: 'UGC 短视频制作', price: 'RM 500', unit: '/ 支', desc: '拍摄、剪接、写剧本一站包办' },
      { title: 'Meta 广告与内容管理', price: 'RM 2,000', unit: '/ 月', desc: 'Meta 帖文文案 + 广告投放一体化' },
      { title: '小红书 KOC 种草', price: 'RM 4,500', unit: '/ 10 篇', desc: 'KOC 批量种草铺量，触达华人市场' },
      { title: 'Google 广告与 SEO', price: 'RM 1,200', unit: '/ 月起', desc: '广告投放 + 长期搜索优化' },
      { title: '电商全案与直播', price: 'RM 1,888', unit: '起', desc: '多平台开店、全托管与直播带货' },
    ],
  },
  en: {
    hero: { tag: 'Transparent Pricing', title: 'Digital Marketing Packages for Malaysian SMEs', subtitle: 'No hidden fees. No vague retainers. Every package clearly defines what you get — so you can make a confident decision.' },
    packagesTitle: 'Choose Your Growth Package', packagesSub: 'Bundled solutions for every stage of your business.',
    enterprise: 'Enterprise & Custom', enterpriseDesc: 'Tailored for high-growth corporate entities and IPO-ready brands.',
    singleTitle: 'Individual Service Pricing', singleSub: 'Our five core services — transparent pricing, order individually or mix and match.',
    ctaTitle: 'Ready to Get Started?', ctaSubtitle: "Chat with us — we'll help you pick the right package for your budget and goals.",
    viewServices: 'View All Services', getStarted: 'Get Started', mostPopular: 'Most Popular',
    tiers: [
      { name: 'Meta Ads & Content', tagline: 'Content + Ads Combined', features: [
        { category: 'Content & Copy', value: 'Meta Post Copywriting' },
        { category: 'Scheduling', value: 'Weekly Content Planning & Posting' },
        { category: 'Ads Management', value: 'Ad Targeting & Optimisation' },
        { category: 'Platforms', value: 'Facebook & Instagram' },
        { category: 'Support', value: 'Direct WhatsApp Access' },
      ]},
      { name: 'Growth Booster', tagline: 'Active Engagement', features: [
        { category: 'Video Content', value: '4 Short Videos' },
        { category: 'Graphic Posts', value: '8 Creative Posts' },
        { category: 'Platforms', value: 'FB / IG / TikTok' },
        { category: 'Ads Management', value: 'Ads Setting & Active Monitoring' },
        { category: 'Content & Copy', value: 'Content Planning, Caption Copywriting, Story Posting' },
        { category: 'Strategy', value: 'Monthly Campaign Planning' },
        { category: 'Reports', value: 'Monthly Performance Report' },
      ]},
      { name: 'Ultimate', tagline: 'Strategic Dominance', features: [
        { category: 'Video Content', value: '12 Professional Videos' },
        { category: 'Graphic Posts', value: '10 Creative Posts' },
        { category: 'Platforms', value: 'FB / IG / TikTok / XHS (小红书)' },
        { category: 'Ads Management', value: 'Full Ads Strategy Setup & Funnels' },
        { category: 'Content & Copy', value: 'Content Planning, Campaign Ideas, Brand Positioning' },
        { category: 'Strategy', value: 'Sales Funnel Planning' },
        { category: 'Support', value: 'Marketing Discussions & Priority Support' },
      ]},
    ],
    singleServices: [
      { title: 'UGC Short-Video Production', price: 'RM 500', unit: '/ video', desc: 'Filming, editing & scriptwriting handled end-to-end' },
      { title: 'Meta Ads & Content Management', price: 'RM 2,000', unit: '/ month', desc: 'Meta post copywriting + ads management combined' },
      { title: 'Xiaohongshu KOC Seeding', price: 'RM 4,500', unit: '/ 10 posts', desc: 'Mass KOC seeding to reach Chinese-speaking consumers' },
      { title: 'Google Ads & SEO', price: 'RM 1,200', unit: '/ month+', desc: 'Ad placement + long-term search optimisation' },
      { title: 'E-Commerce & Live Streaming', price: 'RM 1,888', unit: '+', desc: 'Multi-platform setup, full management & live commerce' },
    ],
  },
  ms: {
    hero: { tag: 'Harga Telus', title: 'Pakej Pemasaran Digital untuk PKS Malaysia', subtitle: 'Tiada caj tersembunyi. Tiada yuran samar. Setiap pakej dengan jelas menentukan apa yang anda perolehi.' },
    packagesTitle: 'Pilih Pakej Pertumbuhan Anda', packagesSub: 'Penyelesaian berpakej untuk setiap peringkat perniagaan anda.',
    enterprise: 'Perusahaan & Tersuai', enterpriseDesc: 'Disesuaikan untuk entiti korporat pertumbuhan tinggi dan jenama sedia IPO.',
    singleTitle: 'Harga Perkhidmatan Individu', singleSub: 'Lima perkhidmatan teras kami — harga telus, tempah secara berasingan atau gabungkan mengikut keperluan.',
    ctaTitle: 'Bersedia Untuk Bermula?', ctaSubtitle: 'Berbual dengan kami — kami akan membantu anda memilih pakej yang tepat untuk bajet dan matlamat anda.',
    viewServices: 'Lihat Semua Perkhidmatan', getStarted: 'Mulakan', mostPopular: 'Paling Popular',
    tiers: [
      { name: 'Iklan & Kandungan Meta', tagline: 'Kandungan + Iklan Bersepadu', features: [
        { category: 'Kandungan & Teks', value: 'Penulisan Kandungan Meta' },
        { category: 'Penjadualan', value: 'Perancangan & Hantaran Mingguan' },
        { category: 'Pengurusan Iklan', value: 'Penyasaran & Pengoptimuman Iklan' },
        { category: 'Platform', value: 'Facebook & Instagram' },
        { category: 'Sokongan', value: 'Akses WhatsApp Terus' },
      ]},
      { name: 'Growth Booster', tagline: 'Penglibatan Aktif', features: [
        { category: 'Kandungan Video', value: '4 Video Pendek' },
        { category: 'Hantaran Grafik', value: '8 Hantaran Kreatif' },
        { category: 'Platform', value: 'FB / IG / TikTok' },
        { category: 'Pengurusan Iklan', value: 'Tetapan Iklan & Pemantauan Aktif' },
        { category: 'Kandungan & Teks', value: 'Perancangan Kandungan, Penulisan Kapsyen, Hantaran Cerita' },
        { category: 'Strategi', value: 'Perancangan Kempen Bulanan' },
        { category: 'Laporan', value: 'Laporan Prestasi Bulanan' },
      ]},
      { name: 'Ultimate', tagline: 'Dominasi Strategik', features: [
        { category: 'Kandungan Video', value: '12 Video Profesional' },
        { category: 'Hantaran Grafik', value: '10 Hantaran Kreatif' },
        { category: 'Platform', value: 'FB / IG / TikTok / XHS (小红书)' },
        { category: 'Pengurusan Iklan', value: 'Persediaan Strategi Iklan Penuh & Corong' },
        { category: 'Kandungan & Teks', value: 'Perancangan Kandungan, Idea Kempen, Peletakan Jenama' },
        { category: 'Strategi', value: 'Perancangan Corong Jualan' },
        { category: 'Sokongan', value: 'Perbincangan Pemasaran & Sokongan Keutamaan' },
      ]},
    ],
    singleServices: [
      { title: 'Penerbitan Video Pendek UGC', price: 'RM 500', unit: '/ video', desc: 'Penggambaran, penyuntingan & skrip diuruskan sepenuhnya' },
      { title: 'Pengurusan Iklan & Kandungan Meta', price: 'RM 2,000', unit: '/ bulan', desc: 'Penulisan kandungan Meta + pengurusan iklan bersepadu' },
      { title: 'Penanaman KOC Xiaohongshu', price: 'RM 4,500', unit: '/ 10 catatan', desc: 'Penanaman KOC besar-besaran menjangkau pengguna Cina' },
      { title: 'Iklan Google & SEO', price: 'RM 1,200', unit: '/ bulan+', desc: 'Penempatan iklan + pengoptimuman carian jangka panjang' },
      { title: 'E-Dagang & Siaran Langsung', price: 'RM 1,888', unit: '+', desc: 'Persediaan pelbagai platform, pengurusan penuh & siaran langsung' },
    ],
  },
};

const prices = ['RM 2,000', 'RM 4,688', 'RM 10,888'];
const units: Record<Language, string[]> = {
  zh: ['/ 月', '/ 月', '/ 3 个月'],
  en: ['/ month', '/ month', '/ 3 months'],
  ms: ['/ bulan', '/ bulan', '/ 3 bulan'],
};

const icons = [
  <Video className="w-6 h-6" />,
  <Share2 className="w-6 h-6" />,
  <BookOpen className="w-6 h-6" />,
  <TrendingUp className="w-6 h-6" />,
  <ShoppingBag className="w-6 h-6" />,
];

const metaT: Record<Language, { title: string; desc: string }> = {
  zh: { title: '数码营销价格套餐马来西亚 | 从RM500起 | Cheaper Nexus', desc: '马来西亚数码营销透明定价。UGC短视频 RM500/支，Meta广告与内容管理 RM2,000/月，Growth Booster、Ultimate 及企业定制方案。' },
  en: { title: 'Digital Marketing Pricing Malaysia | Packages from RM 500 | Cheaper Nexus', desc: 'Transparent digital marketing pricing in Malaysia. UGC video from RM500, Meta Ads & Content, Growth Booster, Ultimate and Enterprise packages for SMEs.' },
  ms: { title: 'Harga Pemasaran Digital Malaysia | Pakej dari RM 500 | Cheaper Nexus', desc: 'Harga pemasaran digital telus di Malaysia. Video UGC dari RM500, Iklan & Kandungan Meta, Growth Booster dan Ultimate untuk PKS Malaysia.' },
};

export default function Pricing() {
  const [lang, setLang] = useLanguage();
  const content = t[lang];
  const meta = metaT[lang];

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.desc} />
        <link rel="canonical" href={`${SITE_URL}/pricing`} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.desc} />
        <meta property="og:url" content={`${SITE_URL}/pricing`} />
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
            <p className="text-white/60 text-lg max-w-2xl">{content.hero.subtitle}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          {/* Package tiers */}
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-brand-blue mb-3">{content.packagesTitle}</h2>
            <p className="text-brand-blue/60">{content.packagesSub}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {content.tiers.map((tier, idx) => (
              <div key={tier.name} className={`relative rounded-[28px] p-8 flex flex-col ${
                idx === 1 ? 'bg-brand-blue text-white shadow-2xl shadow-brand-blue/30 scale-105' : 'bg-white border border-brand-blue/8'
              }`}>
                {idx === 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 bg-brand-cyan text-brand-blue rounded-full text-xs font-bold">
                    <Star className="w-3 h-3" /> {content.mostPopular}
                  </div>
                )}
                <div className="text-xs font-bold uppercase tracking-widest mb-2 text-brand-cyan">{tier.tagline}</div>
                <div className={`text-2xl font-bold mb-1 ${idx === 1 ? 'text-white' : 'text-brand-blue'}`}>{tier.name}</div>
                <div className="mb-6">
                  <span className={`text-3xl font-bold ${idx === 1 ? 'text-brand-cyan' : 'text-brand-blue'}`}>{prices[idx]}</span>
                  <span className={`text-sm ml-1 ${idx === 1 ? 'text-white/60' : 'text-brand-blue/40'}`}>{units[lang][idx]}</span>
                </div>
                <ul className="space-y-3 flex-grow mb-8">
                  {tier.features.map(f => (
                    <li key={f.category} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-brand-cyan" />
                      <div>
                        <span className={`text-xs font-semibold block ${idx === 1 ? 'text-white/50' : 'text-brand-blue/40'}`}>{f.category}</span>
                        <span className={`text-sm ${idx === 1 ? 'text-white' : 'text-brand-blue/80'}`}>{f.value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <a href="https://wa.me/60172915754" target="_blank" rel="noopener noreferrer"
                  className={`w-full text-center py-3 rounded-full font-bold text-sm transition-all ${
                    idx === 1 ? 'bg-brand-cyan text-brand-blue hover:opacity-90' : 'border-2 border-brand-blue/15 text-brand-blue hover:border-brand-cyan hover:text-brand-cyan'
                  }`}>
                  {content.getStarted}
                </a>
              </div>
            ))}
          </div>

          {/* Enterprise */}
          <div className="bg-brand-blue rounded-[28px] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
            <div>
              <div className="text-brand-cyan font-bold text-sm mb-2">{content.enterprise}</div>
              <h3 className="text-2xl font-bold mb-2">RM 15,000+ / {lang === 'zh' ? '项目' : lang === 'ms' ? 'projek' : 'project'}</h3>
              <p className="text-white/60 max-w-xl">{content.enterpriseDesc}</p>
            </div>
            <a href="https://wa.me/60172915754" target="_blank" rel="noopener noreferrer"
              className="shrink-0 px-8 py-4 bg-brand-cyan text-brand-blue rounded-full font-bold hover:opacity-90 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Henry
            </a>
          </div>

          {/* Individual services */}
          <div>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-brand-blue mb-3">{content.singleTitle}</h2>
              <p className="text-brand-blue/60">{content.singleSub}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.singleServices.map((s, i) => (
                <Link
                  key={s.title}
                  to="/services"
                  className="group flex flex-col p-7 rounded-[28px] border border-brand-blue/8 bg-white hover:border-brand-cyan/30 hover:shadow-xl hover:shadow-brand-blue/5 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue text-brand-cyan flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    {icons[i]}
                  </div>
                  <h3 className="text-base font-bold text-brand-blue mb-1">{s.title}</h3>
                  <p className="text-sm text-brand-blue/50 mb-6 flex-grow">{s.desc}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xl font-bold text-brand-blue">{s.price}</span>
                      <span className="text-xs text-brand-blue/40 ml-1">{s.unit}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-cyan opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-brand-blue text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{content.ctaTitle}</h2>
            <p className="text-white/60 mb-8">{content.ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/60172915754" target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 bg-brand-cyan text-brand-blue rounded-full font-bold hover:opacity-90">
                WhatsApp Henry — 017-291 5754
              </a>
              <Link to="/services" className="px-8 py-4 border-2 border-white/20 text-white rounded-full font-bold hover:bg-white/10 flex items-center gap-2 justify-center">
                {content.viewServices} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
