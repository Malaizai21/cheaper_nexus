import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Phone, ArrowRight, Star } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useLanguage, type Language } from '../hooks/useLanguage';

const SITE_URL = 'https://cheapernexus.com';

const t: Record<Language, {
  hero: { tag: string; title: string; subtitle: string };
  packagesTitle: string; packagesSub: string;
  enterprise: string; enterpriseDesc: string;
  tableTitle: string; tableSub: string;
  tableHeaders: [string, string, string];
  tableNote: string;
  ctaTitle: string; ctaSubtitle: string; viewServices: string;
  getStarted: string; mostPopular: string;
  tiers: { name: string; tagline: string; features: { category: string; value: string }[] }[];
  tableRows: { service: string; price: string; billing: string }[];
}> = {
  zh: {
    hero: { tag: '价格透明', title: '马来西亚数码营销套餐', subtitle: '无隐藏费用，无模糊月费。每个套餐都清楚列明您所获得的内容，让您做出明智的决定。' },
    packagesTitle: '选择您的增长套餐', packagesSub: '针对业务各发展阶段的捆绑解决方案。',
    enterprise: '企业定制方案', enterpriseDesc: '专为高速增长企业和IPO准备中品牌量身定制。',
    tableTitle: '完整价格一览', tableSub: '所有单项服务价格，可根据需求自由组合。',
    tableHeaders: ['服务项目', '价格', '计费方式'],
    tableNote: '* 可定制套餐。广告投放费用不含在管理费内。',
    ctaTitle: '准备好开始了吗？', ctaSubtitle: '联系我们——帮您选择最适合预算和目标的套餐。',
    viewServices: '查看所有服务', getStarted: '立即开始', mostPopular: '最受欢迎',
    tiers: [
      { name: 'Basic Starter', tagline: '基础建立', features: [
        { category: '视频内容', value: '1 支短视频' },
        { category: '图文帖子', value: '1 篇创意帖子' },
        { category: '平台', value: 'Facebook & Instagram' },
        { category: '广告管理', value: '基础广告配置' },
        { category: '内容文案', value: '基础美工编辑' },
        { category: '支持服务', value: 'WhatsApp 咨询按钮设置' },
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
    tableRows: [
      { service: 'UGC / KOC 视频矩阵', price: 'RM 1,250', billing: '/ 5 支' },
      { service: 'TikTok / IG 达人开箱矩阵', price: 'RM 3,500', billing: '/ 10 支' },
      { service: '全网视觉框架搭建（基础）', price: 'RM 1,000', billing: '单次' },
      { service: '社媒套餐 A', price: 'RM 1,800', billing: '/ 月' },
      { service: '社媒套餐 B（视频增长引擎）', price: 'RM 3,888', billing: '/ 月' },
      { service: '小红书蓝V认证及入驻', price: 'RM 3,500', billing: '单次' },
      { service: '小红书官方账号全托管', price: 'RM 2,500', billing: '/ 月' },
      { service: '小红书 KOC 种草铺量', price: 'RM 3,500', billing: '/ 10 篇' },
      { service: '数字广告：基础版', price: 'RM 1,200', billing: '/ 月' },
      { service: '数字广告：标准版', price: 'RM 2,000', billing: '/ 月' },
      { service: 'GEO & SEO 搜索优化（最少 6 个月）', price: 'RM 2,500', billing: '/ 月' },
      { service: '高转化落地页', price: '从 RM 1,000', billing: '/ 页' },
      { service: '电商多平台开店及装修', price: 'RM 1,888', billing: '单次' },
      { service: '电商 360° 全托管', price: 'RM 5,000', billing: '/ 月' },
      { service: '直播 / 播出服务', price: 'RM 2,500', billing: '/ 月' },
    ],
  },
  en: {
    hero: { tag: 'Transparent Pricing', title: 'Digital Marketing Packages for Malaysian SMEs', subtitle: 'No hidden fees. No vague retainers. Every package clearly defines what you get — so you can make a confident decision.' },
    packagesTitle: 'Choose Your Growth Package', packagesSub: 'Bundled solutions for every stage of your business.',
    enterprise: 'Enterprise & Custom', enterpriseDesc: 'Tailored for high-growth corporate entities and IPO-ready brands.',
    tableTitle: 'Full Pricing Summary', tableSub: 'All individual service prices. Mix and match based on your needs.',
    tableHeaders: ['Service', 'Price', 'Billing'],
    tableNote: '* Custom packages available. Ad spend not included in management fees.',
    ctaTitle: 'Ready to Get Started?', ctaSubtitle: "Chat with us — we'll help you pick the right package for your budget and goals.",
    viewServices: 'View All Services', getStarted: 'Get Started', mostPopular: 'Most Popular',
    tiers: [
      { name: 'Basic Starter', tagline: 'Foundation Building', features: [
        { category: 'Video Content', value: '1 Short Video' },
        { category: 'Graphic Posts', value: '1 Creative Post' },
        { category: 'Platforms', value: 'Facebook & Instagram' },
        { category: 'Ads Management', value: 'Basic Ads Configuration' },
        { category: 'Content & Copy', value: 'Basic Artwork Editing' },
        { category: 'Support', value: 'WhatsApp Inquiry Button Setup' },
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
    tableRows: [
      { service: 'UGC / KOC Video Matrix', price: 'RM 1,250', billing: '/ 5 videos' },
      { service: 'TikTok / IG Influencer Unboxing Matrix', price: 'RM 3,500', billing: '/ 10 videos' },
      { service: 'Social Media Full-Network Setup', price: 'RM 1,000', billing: 'one-time' },
      { service: 'Social Media Package A', price: 'RM 1,800', billing: '/ month' },
      { service: 'Social Media Package B (Video Growth)', price: 'RM 3,888', billing: '/ month' },
      { service: 'XHS Blue V Verification & Onboarding', price: 'RM 3,500', billing: 'one-time' },
      { service: 'XHS Official Account Management', price: 'RM 2,500', billing: '/ month' },
      { service: 'XHS Organic KOC Seeding', price: 'RM 3,500', billing: '/ 10 posts' },
      { service: 'Digital Ads Starter Edition', price: 'RM 1,200', billing: '/ month' },
      { service: 'Digital Ads Standard Edition', price: 'RM 2,000', billing: '/ month' },
      { service: 'GEO & SEO Optimization (Min. 6 months)', price: 'RM 2,500', billing: '/ month' },
      { service: 'High-Conversion Landing Page', price: 'From RM 1,000', billing: '/ page' },
      { service: 'E-Commerce Multi-Platform Setup', price: 'RM 1,888', billing: 'one-time' },
      { service: 'E-Commerce 360° Full Management', price: 'RM 5,000', billing: '/ month' },
      { service: 'Live Streaming / Broadcasting Service', price: 'RM 2,500', billing: '/ month' },
    ],
  },
  ms: {
    hero: { tag: 'Harga Telus', title: 'Pakej Pemasaran Digital untuk PKS Malaysia', subtitle: 'Tiada caj tersembunyi. Tiada yuran samar. Setiap pakej dengan jelas menentukan apa yang anda perolehi.' },
    packagesTitle: 'Pilih Pakej Pertumbuhan Anda', packagesSub: 'Penyelesaian berpakej untuk setiap peringkat perniagaan anda.',
    enterprise: 'Perusahaan & Tersuai', enterpriseDesc: 'Disesuaikan untuk entiti korporat pertumbuhan tinggi dan jenama sedia IPO.',
    tableTitle: 'Ringkasan Harga Penuh', tableSub: 'Semua harga perkhidmatan individu. Gabung dan padankan mengikut keperluan.',
    tableHeaders: ['Perkhidmatan', 'Harga', 'Pengebilan'],
    tableNote: '* Pakej tersuai tersedia. Belanja iklan tidak termasuk dalam yuran pengurusan.',
    ctaTitle: 'Bersedia Untuk Bermula?', ctaSubtitle: 'Berbual dengan kami — kami akan membantu anda memilih pakej yang tepat untuk bajet dan matlamat anda.',
    viewServices: 'Lihat Semua Perkhidmatan', getStarted: 'Mulakan', mostPopular: 'Paling Popular',
    tiers: [
      { name: 'Basic Starter', tagline: 'Pembinaan Asas', features: [
        { category: 'Kandungan Video', value: '1 Video Pendek' },
        { category: 'Hantaran Grafik', value: '1 Hantaran Kreatif' },
        { category: 'Platform', value: 'Facebook & Instagram' },
        { category: 'Pengurusan Iklan', value: 'Konfigurasi Iklan Asas' },
        { category: 'Kandungan & Teks', value: 'Penyuntingan Karya Seni Asas' },
        { category: 'Sokongan', value: 'Persediaan Butang Pertanyaan WhatsApp' },
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
    tableRows: [
      { service: 'Matriks Video UGC / KOC', price: 'RM 1,250', billing: '/ 5 video' },
      { service: 'Matriks Unboxing Influencer TikTok / IG', price: 'RM 3,500', billing: '/ 10 video' },
      { service: 'Persediaan Rangkaian Penuh Media Sosial', price: 'RM 1,000', billing: 'sekali' },
      { service: 'Pakej Media Sosial A', price: 'RM 1,800', billing: '/ bulan' },
      { service: 'Pakej Media Sosial B (Pertumbuhan Video)', price: 'RM 3,888', billing: '/ bulan' },
      { service: 'Pengesahan Blue V XHS & Onboarding', price: 'RM 3,500', billing: 'sekali' },
      { service: 'Pengurusan Akaun Rasmi XHS', price: 'RM 2,500', billing: '/ bulan' },
      { service: 'Penanaman KOC Organik XHS', price: 'RM 3,500', billing: '/ 10 catatan' },
      { service: 'Iklan Digital Edisi Pemula', price: 'RM 1,200', billing: '/ bulan' },
      { service: 'Iklan Digital Edisi Standard', price: 'RM 2,000', billing: '/ bulan' },
      { service: 'Pengoptimuman GEO & SEO (Min. 6 bulan)', price: 'RM 2,500', billing: '/ bulan' },
      { service: 'Halaman Pendaratan Penukaran Tinggi', price: 'Dari RM 1,000', billing: '/ halaman' },
      { service: 'Persediaan E-Dagang Pelbagai Platform', price: 'RM 1,888', billing: 'sekali' },
      { service: 'Pengurusan Penuh E-Dagang 360°', price: 'RM 5,000', billing: '/ bulan' },
      { service: 'Perkhidmatan Penstriman Langsung', price: 'RM 2,500', billing: '/ bulan' },
    ],
  },
};

const prices = ['RM 1,688', 'RM 4,688', 'RM 10,888'];
const units: Record<Language, string[]> = {
  zh: ['/ 月', '/ 月', '/ 3 个月'],
  en: ['/ month', '/ month', '/ 3 months'],
  ms: ['/ bulan', '/ bulan', '/ 3 bulan'],
};

const metaT: Record<Language, { title: string; desc: string }> = {
  zh: { title: '数码营销价格套餐马来西亚 | 从RM1,688/月 | Cheaper Nexus', desc: '马来西亚数码营销透明定价。套餐从 RM 1,688/月起。Basic Starter、Growth Booster、Ultimate 及企业定制方案。' },
  en: { title: 'Digital Marketing Pricing Malaysia | Packages from RM 1,688 | Cheaper Nexus', desc: 'Transparent digital marketing pricing in Malaysia. Packages from RM 1,688/month. Basic Starter, Growth Booster, Ultimate and Enterprise packages for SMEs.' },
  ms: { title: 'Harga Pemasaran Digital Malaysia | Pakej dari RM 1,688 | Cheaper Nexus', desc: 'Harga pemasaran digital telus di Malaysia. Pakej dari RM 1,688/bulan untuk PKS Malaysia.' },
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
                <a href="https://wa.me/60134391541" target="_blank" rel="noopener noreferrer"
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

          {/* Full table */}
          <div>
            <h2 className="text-2xl font-bold text-brand-blue mb-3">{content.tableTitle}</h2>
            <p className="text-brand-blue/60 mb-8">{content.tableSub}</p>
            <div className="overflow-x-auto rounded-2xl border border-brand-blue/8">
              <table className="w-full">
                <thead>
                  <tr className="bg-brand-blue text-white">
                    {content.tableHeaders.map(h => (
                      <th key={h} className={`px-6 py-4 text-sm font-semibold ${h === content.tableHeaders[0] ? 'text-left' : 'text-right'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.tableRows.map((row, i) => (
                    <tr key={i} className={`border-t border-brand-blue/5 ${i % 2 === 0 ? 'bg-white' : 'bg-brand-blue/2'}`}>
                      <td className="px-6 py-4 text-sm text-brand-blue/80">{row.service}</td>
                      <td className="px-6 py-4 text-sm font-bold text-brand-blue text-right">{row.price}</td>
                      <td className="px-6 py-4 text-sm text-brand-blue/40 text-right">{row.billing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-brand-blue/40 mt-4">{content.tableNote}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-brand-blue text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{content.ctaTitle}</h2>
            <p className="text-white/60 mb-8">{content.ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/60134391541" target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 bg-brand-cyan text-brand-blue rounded-full font-bold hover:opacity-90">
                WhatsApp Calvin — 013-439 1541
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
