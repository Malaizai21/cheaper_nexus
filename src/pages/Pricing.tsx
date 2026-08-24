import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Phone, ArrowRight, Star, Megaphone, Users, Palette, Video } from 'lucide-react';
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
    packagesTitle: '选择您的增长套餐', packagesSub: '从首次体验到全面业务增长，针对业务各发展阶段的捆绑解决方案。',
    enterprise: '企业定制方案', enterpriseDesc: '专为高速增长企业和IPO准备中品牌量身定制。',
    singleTitle: '独立服务价格', singleSub: '广告投放、网红营销与单点设计视频，价格透明，可单独订购。',
    ctaTitle: '准备好开始了吗？', ctaSubtitle: '联系我们——帮您选择最适合预算和目标的套餐。',
    viewServices: '查看所有服务', getStarted: '立即开始', mostPopular: '最受欢迎',
    tiers: [
      { name: '首次体验套餐', tagline: '限量体验，每间公司仅限一次', features: [
        { category: '视频内容', value: '1 支短视频（拍摄 + 剪接 + 脚本 + 文案）' },
        { category: '设计', value: '2 份专业设计' },
        { category: '广告', value: 'Meta 广告基础搭建（1 专页）' },
        { category: '原价值', value: 'RM3,100（省 RM2,212）' },
      ]},
      { name: '社媒管理套餐', tagline: '内容 + 代运营 + 广告一体化', features: [
        { category: '视频内容', value: '2 支短视频' },
        { category: '设计', value: '5 份专业设计 + IG Feed' },
        { category: '社媒代运营', value: 'FB / IG / TikTok / 小红书（各 1 专页）' },
        { category: '广告管理', value: 'Meta 广告投放与优化' },
        { category: '原价值', value: 'RM5,738（省 RM2,850）' },
      ]},
      { name: '全面业务增长套餐', tagline: '规模化内容 + 全渠道代运营', features: [
        { category: '视频内容', value: '6 支短视频' },
        { category: '设计', value: '18 份专业设计 + IG Feed' },
        { category: '全渠道代运营', value: 'FB / IG / TikTok / 小红书 / Google 商家 / Waze / Telegram / Lemon8' },
        { category: '广告管理', value: 'Meta 广告投放与优化' },
        { category: '原价值', value: 'RM10,888（省 RM2,000）' },
      ]},
    ],
    singleServices: [
      { title: '广告投放管理', price: 'RM 2,000', unit: '/ 月起', desc: 'TikTok/IG/FB/小红书/Google 等平台广告代投' },
      { title: 'KOC / KOL 网红营销', price: 'RM 3,888', unit: '起', desc: '全平台通用达人合作，10 位起' },
      { title: '单点设计', price: 'RM 150', unit: '起', desc: '无需绑定套餐，按件订购专业设计' },
      { title: '单点视频', price: 'RM 800', unit: '起', desc: '拍摄、剪接、脚本、内容一支起订' },
    ],
  },
  en: {
    hero: { tag: 'Transparent Pricing', title: 'Digital Marketing Packages for Malaysian SMEs', subtitle: 'No hidden fees. No vague retainers. Every package clearly defines what you get — so you can make a confident decision.' },
    packagesTitle: 'Choose Your Growth Package', packagesSub: 'From your first trial to full-scale growth — bundled solutions for every stage of your business.',
    enterprise: 'Enterprise & Custom', enterpriseDesc: 'Tailored for high-growth corporate entities and IPO-ready brands.',
    singleTitle: 'Standalone Service Pricing', singleSub: 'Ads management, influencer marketing, and ala carte design & video — transparent pricing, order individually.',
    ctaTitle: 'Ready to Get Started?', ctaSubtitle: "Chat with us — we'll help you pick the right package for your budget and goals.",
    viewServices: 'View All Services', getStarted: 'Get Started', mostPopular: 'Most Popular',
    tiers: [
      { name: 'First Trial Package', tagline: 'Limited trial, once per company', features: [
        { category: 'Video Content', value: '1 short video (filming + editing + script + copywriting)' },
        { category: 'Design', value: '2 professional designs' },
        { category: 'Ads', value: 'Meta Ads foundation setup (1 page)' },
        { category: 'Original Value', value: 'RM3,100 (save RM2,212)' },
      ]},
      { name: 'Social Media Management Package', tagline: 'Content + Management + Ads Combined', features: [
        { category: 'Video Content', value: '2 short videos' },
        { category: 'Design', value: '5 professional designs + IG feed' },
        { category: 'Social Media Management', value: 'FB / IG / TikTok / XHS (1 page each)' },
        { category: 'Ads Management', value: 'Meta ads management & optimisation' },
        { category: 'Original Value', value: 'RM5,738 (save RM2,850)' },
      ]},
      { name: 'Full Business Growth Package', tagline: 'Scaled Content + Full-Channel Management', features: [
        { category: 'Video Content', value: '6 short videos' },
        { category: 'Design', value: '18 professional designs + IG feed' },
        { category: 'Full-Channel Management', value: 'FB / IG / TikTok / XHS / Google / Waze / Telegram / Lemon8' },
        { category: 'Ads Management', value: 'Meta ads management & optimisation' },
        { category: 'Original Value', value: 'RM10,888 (save RM2,000)' },
      ]},
    ],
    singleServices: [
      { title: 'Ads Management', price: 'RM 2,000', unit: '/ month+', desc: 'Paid ads across TikTok/IG/FB/XHS/Google and more' },
      { title: 'KOC / KOL Influencer Marketing', price: 'RM 3,888', unit: '+', desc: 'Cross-platform influencer collaborations from 10 creators' },
      { title: 'Ala Carte Design', price: 'RM 150', unit: '+', desc: 'No package needed — order professional designs per unit' },
      { title: 'Ala Carte Video', price: 'RM 800', unit: '+', desc: 'Filming, editing, script & content from 1 video' },
    ],
  },
  ms: {
    hero: { tag: 'Harga Telus', title: 'Pakej Pemasaran Digital untuk PKS Malaysia', subtitle: 'Tiada caj tersembunyi. Tiada yuran samar. Setiap pakej dengan jelas menentukan apa yang anda perolehi.' },
    packagesTitle: 'Pilih Pakej Pertumbuhan Anda', packagesSub: 'Dari percubaan pertama hingga pertumbuhan menyeluruh — penyelesaian berpakej untuk setiap peringkat perniagaan anda.',
    enterprise: 'Perusahaan & Tersuai', enterpriseDesc: 'Disesuaikan untuk entiti korporat pertumbuhan tinggi dan jenama sedia IPO.',
    singleTitle: 'Harga Perkhidmatan Berasingan', singleSub: 'Pengurusan iklan, pemasaran influencer, dan reka bentuk & video ala carte — harga telus, tempah secara berasingan.',
    ctaTitle: 'Bersedia Untuk Bermula?', ctaSubtitle: 'Berbual dengan kami — kami akan membantu anda memilih pakej yang tepat untuk bajet dan matlamat anda.',
    viewServices: 'Lihat Semua Perkhidmatan', getStarted: 'Mulakan', mostPopular: 'Paling Popular',
    tiers: [
      { name: 'Pakej Percubaan Pertama', tagline: 'Percubaan terhad, sekali sahaja setiap syarikat', features: [
        { category: 'Kandungan Video', value: '1 video pendek (penggambaran + penyuntingan + skrip + penulisan)' },
        { category: 'Reka Bentuk', value: '2 reka bentuk profesional' },
        { category: 'Iklan', value: 'Persediaan asas Iklan Meta (1 halaman)' },
        { category: 'Nilai Asal', value: 'RM3,100 (jimat RM2,212)' },
      ]},
      { name: 'Pakej Pengurusan Media Sosial', tagline: 'Kandungan + Pengurusan + Iklan Bersepadu', features: [
        { category: 'Kandungan Video', value: '2 video pendek' },
        { category: 'Reka Bentuk', value: '5 reka bentuk profesional + IG feed' },
        { category: 'Pengurusan Media Sosial', value: 'FB / IG / TikTok / XHS (1 halaman setiap satu)' },
        { category: 'Pengurusan Iklan', value: 'Pengurusan & pengoptimuman iklan Meta' },
        { category: 'Nilai Asal', value: 'RM5,738 (jimat RM2,850)' },
      ]},
      { name: 'Pakej Pertumbuhan Perniagaan Penuh', tagline: 'Kandungan Berskala + Pengurusan Penuh Saluran', features: [
        { category: 'Kandungan Video', value: '6 video pendek' },
        { category: 'Reka Bentuk', value: '18 reka bentuk profesional + IG feed' },
        { category: 'Pengurusan Penuh Saluran', value: 'FB / IG / TikTok / XHS / Google / Waze / Telegram / Lemon8' },
        { category: 'Pengurusan Iklan', value: 'Pengurusan & pengoptimuman iklan Meta' },
        { category: 'Nilai Asal', value: 'RM10,888 (jimat RM2,000)' },
      ]},
    ],
    singleServices: [
      { title: 'Pengurusan Iklan', price: 'RM 2,000', unit: '/ bulan+', desc: 'Iklan berbayar merentasi TikTok/IG/FB/XHS/Google dan lain-lain' },
      { title: 'Pemasaran Influencer KOC / KOL', price: 'RM 3,888', unit: '+', desc: 'Kerjasama influencer merentasi platform dari 10 pencipta' },
      { title: 'Reka Bentuk Ala Carte', price: 'RM 150', unit: '+', desc: 'Tiada pakej diperlukan — tempah reka bentuk profesional setiap unit' },
      { title: 'Video Ala Carte', price: 'RM 800', unit: '+', desc: 'Penggambaran, penyuntingan, skrip & kandungan dari 1 video' },
    ],
  },
};

const prices = ['RM 888', 'RM 2,888', 'RM 8,888'];
const units: Record<Language, string[]> = {
  zh: ['/ 月（限一次）', '/ 月', '/ 3 个月'],
  en: ['/ month (one-time)', '/ month', '/ 3 months'],
  ms: ['/ bulan (sekali sahaja)', '/ bulan', '/ 3 bulan'],
};

const icons = [
  <Megaphone className="w-6 h-6" />,
  <Users className="w-6 h-6" />,
  <Palette className="w-6 h-6" />,
  <Video className="w-6 h-6" />,
];

const metaT: Record<Language, { title: string; desc: string }> = {
  zh: { title: '数码营销价格套餐马来西亚 | 首次体验RM888起 | Cheaper Nexus', desc: '马来西亚数码营销透明定价。首次体验套餐 RM888（限一次），社媒管理套餐 RM2,888/月，全面业务增长套餐，广告投放管理，KOC/KOL 网红营销及企业定制方案。' },
  en: { title: 'Digital Marketing Pricing Malaysia | Trial from RM 888 | Cheaper Nexus', desc: 'Transparent digital marketing pricing in Malaysia. First Trial Package RM888 (one-time), Social Media Management RM2,888/month, Full Business Growth Package, Ads Management, KOC/KOL influencer marketing and Enterprise packages.' },
  ms: { title: 'Harga Pemasaran Digital Malaysia | Percubaan dari RM 888 | Cheaper Nexus', desc: 'Harga pemasaran digital telus di Malaysia. Pakej Percubaan Pertama RM888 (sekali sahaja), Pengurusan Media Sosial RM2,888/bulan, Pakej Pertumbuhan Perniagaan Penuh, Pengurusan Iklan, pemasaran influencer KOC/KOL dan pakej Perusahaan.' },
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
