import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle2, Phone, Sparkles, Share2, Rocket, Megaphone, Users, Palette } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
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
      subtitle: '从内容制作、社媒代运营到广告投放与网红营销——一站式帮您的业务在马来西亚线上增长。价格透明，无隐藏费用。',
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
        title: '首次体验套餐',
        subtitle: '限量体验价，每间公司仅限一次',
        description: '专为首次合作的客户设计的体验套餐，用超值价格试用我们的视频制作、设计与广告基础建设服务，了解我们的专业水准后再决定长期合作方案。',
        includes: ['1 支短视频制作（拍摄 + 剪接 + 脚本 + 文案）', '2 份专业设计', 'Meta 广告基础搭建（1 个专页）'],
        note: '原价值 RM3,100，一间公司的负责人仅限使用一次。不含社媒代运营、广告投放费用、模特/达人费用。',
        options: [
          { name: '首次体验套餐', price: 'RM 888', unit: '/ 月（限一次）' },
        ],
      },
      {
        title: '社媒管理套餐',
        subtitle: '体验套餐后的延续方案，内容制作 + 社媒代运营 + 广告一体化',
        description: '涵盖内容制作、多平台社媒代运营与广告投放优化的完整月费方案，帮您的品牌在 Facebook、Instagram、TikTok 和小红书持续曝光并稳定增长。',
        includes: ['2 支短视频制作', '5 份专业设计 + IG Feed', 'FB / IG / TikTok / 小红书代运营（各 1 个专页）', 'Meta 广告投放与优化'],
        note: '原价值 RM5,738。不含广告投放费用、模特/达人费用；可使用客户自备或我们提供的达人。',
        options: [
          { name: '社媒管理套餐', price: 'RM 2,888', unit: '/ 月' },
        ],
      },
      {
        title: '全面业务增长套餐',
        subtitle: '社媒管理套餐后的进阶方案，规模化内容 + 全渠道代运营',
        description: '为已稳定合作的客户打造的规模化增长方案，大幅提升内容产出量并扩展至更多平台（Google 商家、Waze、Telegram、Lemon8），配合广告投放实现全面业务增长。',
        includes: ['6 支短视频制作', '18 份专业设计 + IG Feed', '全渠道代运营（FB / IG / TikTok / 小红书 / Google 商家 / Waze / Telegram / Lemon8）', 'Meta 广告投放与优化'],
        note: '原价值 RM10,888。不含广告投放费用、模特/达人费用。',
        options: [
          { name: '全面业务增长套餐', price: 'RM 8,888', unit: '/ 3 个月' },
        ],
      },
      {
        title: '广告投放管理',
        subtitle: '独立广告代投服务，覆盖 TikTok / IG / FB / 小红书 / Google 等平台',
        description: '专注广告投放的独立服务，涵盖广告搭建、投放管理、主页文案优化与专人监控建议，适合已有内容团队、只需要广告代投的客户。',
        includes: ['广告搭建与投放管理', '2 个专页额度（可加购）', '主页与文案优化', '专人监控与顾问建议'],
        note: '每月方案 RM2,000 起（含 2 个专页，加购每页 RM500/月）；半年方案 RM9,000（原价 RM12,000，加购每页 RM300/月）。',
        options: [
          { name: '广告投放管理（2 专页）', price: 'RM 2,000', unit: '/ 月' },
          { name: '广告投放管理套餐（6 个月，2 专页）', price: 'RM 9,000', unit: '/ 6 个月' },
        ],
      },
      {
        title: 'KOC / KOL 网红营销',
        subtitle: '全平台通用达人合作，不限特定社交平台',
        description: '对接真实达人和网红资源，通过口碑内容帮您的品牌快速建立信任，适用于 TikTok、Instagram、小红书等各大平台。',
        includes: ['达人筛选与对接', '内容合作协调', '效果追踪'],
        options: [
          { name: '小型套餐（10 位达人）', price: 'RM 3,888', unit: '' },
          { name: '大型套餐（30 位达人）', price: 'RM 10,888', unit: '' },
        ],
      },
      {
        title: '单点服务',
        subtitle: '无需绑定套餐，单独订购设计或视频',
        description: '不想签订月费套餐？可以单独购买设计或视频制作服务，按件计价，灵活按需使用。',
        includes: ['专业设计', '视频制作（含拍摄、剪接、脚本、内容）'],
        note: '设计不含修改次数；视频不含模特/达人费用。巴生谷地区建议单次拍摄 5 支起；吉隆坡/雪兰莪以外的外地拍摄，住宿、油费及额外附加费由客户承担。',
        options: [
          { name: '专业设计 × 1', price: 'RM 150', unit: '' },
          { name: '专业设计 × 10', price: 'RM 800', unit: '省 RM700' },
          { name: '视频制作 × 1', price: 'RM 800', unit: '' },
          { name: '视频制作 × 10', price: 'RM 5,000', unit: '省 RM3,000' },
        ],
      },
    ],
    faqs: [
      { q: 'Cheaper Nexus 在马来西亚提供哪些数码营销服务？', a: 'Cheaper Nexus 提供首次体验套餐（RM888）、社媒管理套餐（RM2,888/月）、全面业务增长套餐（RM8,888/3个月）、独立广告投放管理、KOC/KOL 网红营销，以及单点设计与视频服务。' },
      { q: '马来西亚数码营销的费用是多少？', a: '首次体验从 RM888 起（每间公司限一次），长期社媒管理套餐 RM2,888/月起，广告投放管理 RM2,000/月起，单点设计 RM150 起、视频 RM800 起。' },
      { q: '首次体验套餐可以用几次？', a: '每间公司的负责人仅限使用一次，目的是让新客户以超值价格体验我们的服务品质，之后可以选择升级至社媒管理套餐或全面业务增长套餐长期合作。' },
    ],
  },
  en: {
    hero: {
      tag: 'Our Services',
      title: 'Digital Marketing Services for Malaysian Businesses',
      subtitle: 'From content production and social media management to paid ads and influencer marketing — everything your business needs to grow online in Malaysia. Transparent pricing, no hidden fees.',
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
        title: 'First Trial Package',
        subtitle: 'Limited-time trial pricing, once per company',
        description: 'Designed for new clients to experience our video production, design, and ads setup at an exclusive trial price before committing to a long-term package.',
        includes: ['1 short video (filming + editing + script + copywriting)', '2 professional designs', 'Meta Ads foundation setup (1 page)'],
        note: 'Original value RM3,100. Limited to one use per company director. Excludes social media management, ad spend, and model/talent fees.',
        options: [
          { name: 'First Trial Package', price: 'RM 888', unit: '/ month (one-time)' },
        ],
      },
      {
        title: 'Social Media Management Package',
        subtitle: 'The natural follow-up after your trial — content, management & ads combined',
        description: 'A complete monthly plan combining content production, multi-platform social media management, and ad optimisation to keep your brand consistently visible and growing across Facebook, Instagram, TikTok, and Xiaohongshu.',
        includes: ['2 short videos', '5 professional designs + IG feed', 'FB/IG/TikTok/XHS management (1 page each)', 'Meta ads management & optimisation'],
        note: 'Original value RM5,738. Excludes ad spend and model/talent fees; use your own talent or ours.',
        options: [
          { name: 'Social Media Management Package', price: 'RM 2,888', unit: '/ month' },
        ],
      },
      {
        title: 'Full Business Growth Package',
        subtitle: 'The advanced tier after the Social Media Management package — scaled content and full-channel management',
        description: 'Built for established clients ready to scale — significantly more content output and expanded platform coverage (Google Business Profile, Waze, Telegram, Lemon8), paired with ads management for full-scale business growth.',
        includes: ['6 short videos', '18 professional designs + IG feed', 'Full-channel management (FB/IG/TikTok/XHS/Google/Waze/Telegram/Lemon8)', 'Meta ads management & optimisation'],
        note: 'Original value RM10,888. Excludes ad spend and model/talent fees.',
        options: [
          { name: 'Full Business Growth Package', price: 'RM 8,888', unit: '/ 3 months' },
        ],
      },
      {
        title: 'Ads Management',
        subtitle: 'Standalone paid ads service across TikTok/IG/FB/XHS/Google and more',
        description: "A dedicated ads-only service — setup, management, bio & copywriting optimisation, and ongoing monitoring & advisory — ideal for clients who already have their own content team and just need ads run professionally.",
        includes: ['Ads setup & management', '2 pages included (add-ons available)', 'Bio & copywriting optimisation', 'Monitoring & advisory'],
        note: 'Monthly plan from RM2,000 (2 pages included, add-on page RM500/month); 6-month plan RM9,000 (originally RM12,000, add-on page RM300/month).',
        options: [
          { name: 'Ads Management (2 pages)', price: 'RM 2,000', unit: '/ month' },
          { name: 'Ads Management Package (6 months, 2 pages)', price: 'RM 9,000', unit: '/ 6 months' },
        ],
      },
      {
        title: 'KOC / KOL Influencer Marketing',
        subtitle: 'Cross-platform influencer partnerships, not limited to one platform',
        description: 'We connect you with real creators and influencers to build trust through authentic word-of-mouth content — across TikTok, Instagram, Xiaohongshu, and more.',
        includes: ['Creator sourcing & matching', 'Collaboration coordination', 'Performance tracking'],
        options: [
          { name: 'Small Package (10 creators)', price: 'RM 3,888', unit: '' },
          { name: 'Big Package (30 creators)', price: 'RM 10,888', unit: '' },
        ],
      },
      {
        title: 'Ala Carte Services',
        subtitle: 'No package commitment — order design or video individually',
        description: "Don't want a monthly package? Order design or video production individually, priced per unit, with the flexibility to use only what you need.",
        includes: ['Professional design', 'Video production (filming, editing, script, content)'],
        note: 'Design excludes revisions; video excludes model/talent fees. We recommend shooting 5+ videos per session for Klang Valley clients; outstation shoots outside KL/Selangor incur accommodation, petrol, and surcharge costs borne by the client.',
        options: [
          { name: '1 Professional Design', price: 'RM 150', unit: '' },
          { name: '10 Professional Designs', price: 'RM 800', unit: 'save RM700' },
          { name: '1 Video', price: 'RM 800', unit: '' },
          { name: '10 Videos', price: 'RM 5,000', unit: 'save RM3,000' },
        ],
      },
    ],
    faqs: [
      { q: 'What digital marketing services does Cheaper Nexus offer in Malaysia?', a: 'Cheaper Nexus offers a First Trial Package (RM888), Social Media Management Package (RM2,888/month), Full Business Growth Package (RM8,888/3 months), standalone Ads Management, KOC/KOL influencer marketing, and ala carte design/video services.' },
      { q: 'How much does digital marketing cost in Malaysia?', a: 'Trial packages start from RM888 (once per company), ongoing Social Media Management from RM2,888/month, Ads Management from RM2,000/month, ala carte design from RM150, and video from RM800.' },
      { q: 'How many times can I use the First Trial Package?', a: "It's limited to one use per company director, so new clients can experience our quality at an exclusive price before upgrading to the Social Media Management or Full Business Growth package." },
    ],
  },
  ms: {
    hero: {
      tag: 'Perkhidmatan Kami',
      title: 'Perkhidmatan Pemasaran Digital untuk Perniagaan Malaysia',
      subtitle: 'Dari penerbitan kandungan dan pengurusan media sosial hingga iklan berbayar dan pemasaran influencer — semua yang perniagaan anda perlukan untuk berkembang dalam talian di Malaysia. Harga telus, tiada caj tersembunyi.',
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
        title: 'Pakej Percubaan Pertama',
        subtitle: 'Harga percubaan terhad, sekali sahaja setiap syarikat',
        description: 'Direka untuk pelanggan baharu merasai perkhidmatan penerbitan video, reka bentuk, dan persediaan iklan kami pada harga percubaan eksklusif sebelum komited kepada pakej jangka panjang.',
        includes: ['1 video pendek (penggambaran + penyuntingan + skrip + penulisan)', '2 reka bentuk profesional', 'Persediaan asas Iklan Meta (1 halaman)'],
        note: 'Nilai asal RM3,100. Terhad kepada sekali penggunaan setiap pengarah syarikat. Tidak termasuk pengurusan media sosial, belanja iklan, dan yuran model/bakat.',
        options: [
          { name: 'Pakej Percubaan Pertama', price: 'RM 888', unit: '/ bulan (sekali sahaja)' },
        ],
      },
      {
        title: 'Pakej Pengurusan Media Sosial',
        subtitle: 'Kesinambungan semula jadi selepas percubaan — kandungan, pengurusan & iklan digabungkan',
        description: 'Pelan bulanan lengkap menggabungkan penerbitan kandungan, pengurusan media sosial pelbagai platform, dan pengoptimuman iklan untuk memastikan jenama anda kelihatan konsisten dan berkembang di Facebook, Instagram, TikTok, dan Xiaohongshu.',
        includes: ['2 video pendek', '5 reka bentuk profesional + IG feed', 'Pengurusan FB/IG/TikTok/XHS (1 halaman setiap satu)', 'Pengurusan & pengoptimuman iklan Meta'],
        note: 'Nilai asal RM5,738. Tidak termasuk belanja iklan dan yuran model/bakat; guna bakat sendiri atau bakat kami.',
        options: [
          { name: 'Pakej Pengurusan Media Sosial', price: 'RM 2,888', unit: '/ bulan' },
        ],
      },
      {
        title: 'Pakej Pertumbuhan Perniagaan Penuh',
        subtitle: 'Peringkat lanjutan selepas Pakej Pengurusan Media Sosial — kandungan berskala dan pengurusan penuh saluran',
        description: 'Dibina untuk pelanggan sedia ada yang bersedia berkembang — output kandungan jauh lebih banyak dan liputan platform diperluaskan (Profil Perniagaan Google, Waze, Telegram, Lemon8), digabungkan dengan pengurusan iklan untuk pertumbuhan perniagaan menyeluruh.',
        includes: ['6 video pendek', '18 reka bentuk profesional + IG feed', 'Pengurusan penuh saluran (FB/IG/TikTok/XHS/Google/Waze/Telegram/Lemon8)', 'Pengurusan & pengoptimuman iklan Meta'],
        note: 'Nilai asal RM10,888. Tidak termasuk belanja iklan dan yuran model/bakat.',
        options: [
          { name: 'Pakej Pertumbuhan Perniagaan Penuh', price: 'RM 8,888', unit: '/ 3 bulan' },
        ],
      },
      {
        title: 'Pengurusan Iklan',
        subtitle: 'Perkhidmatan iklan berbayar berasingan merentasi TikTok/IG/FB/XHS/Google dan lain-lain',
        description: 'Perkhidmatan khusus iklan sahaja — persediaan, pengurusan, pengoptimuman bio & penulisan, serta pemantauan & nasihat berterusan — sesuai untuk pelanggan yang sudah mempunyai pasukan kandungan sendiri dan hanya memerlukan iklan diuruskan secara profesional.',
        includes: ['Persediaan & pengurusan iklan', '2 halaman termasuk (tambahan tersedia)', 'Pengoptimuman bio & penulisan', 'Pemantauan & nasihat'],
        note: 'Pakej bulanan dari RM2,000 (2 halaman termasuk, halaman tambahan RM500/bulan); pakej 6 bulan RM9,000 (asal RM12,000, halaman tambahan RM300/bulan).',
        options: [
          { name: 'Pengurusan Iklan (2 halaman)', price: 'RM 2,000', unit: '/ bulan' },
          { name: 'Pakej Pengurusan Iklan (6 bulan, 2 halaman)', price: 'RM 9,000', unit: '/ 6 bulan' },
        ],
      },
      {
        title: 'Pemasaran Influencer KOC / KOL',
        subtitle: 'Kerjasama influencer merentasi platform, tidak terhad kepada satu platform',
        description: 'Kami menghubungkan anda dengan pencipta kandungan dan influencer sebenar untuk membina kepercayaan melalui kandungan mulut ke mulut yang tulen — merentasi TikTok, Instagram, Xiaohongshu, dan banyak lagi.',
        includes: ['Pencarian & pemadanan pencipta', 'Penyelarasan kerjasama', 'Penjejakan prestasi'],
        options: [
          { name: 'Pakej Kecil (10 pencipta)', price: 'RM 3,888', unit: '' },
          { name: 'Pakej Besar (30 pencipta)', price: 'RM 10,888', unit: '' },
        ],
      },
      {
        title: 'Perkhidmatan Ala Carte',
        subtitle: 'Tiada komitmen pakej — tempah reka bentuk atau video secara individu',
        description: 'Tidak mahu pakej bulanan? Tempah reka bentuk atau penerbitan video secara individu, dikenakan bayaran setiap unit, dengan fleksibiliti untuk guna hanya apa yang anda perlukan.',
        includes: ['Reka bentuk profesional', 'Penerbitan video (penggambaran, penyuntingan, skrip, kandungan)'],
        note: 'Reka bentuk tidak termasuk pindaan; video tidak termasuk yuran model/bakat. Kami mengesyorkan penggambaran 5+ video setiap sesi untuk pelanggan Klang Valley; penggambaran luar bandar di luar KL/Selangor dikenakan kos penginapan, petrol, dan caj tambahan yang ditanggung oleh pelanggan.',
        options: [
          { name: '1 Reka Bentuk Profesional', price: 'RM 150', unit: '' },
          { name: '10 Reka Bentuk Profesional', price: 'RM 800', unit: 'jimat RM700' },
          { name: '1 Video', price: 'RM 800', unit: '' },
          { name: '10 Video', price: 'RM 5,000', unit: 'jimat RM3,000' },
        ],
      },
    ],
    faqs: [
      { q: 'Apakah perkhidmatan pemasaran digital yang ditawarkan Cheaper Nexus di Malaysia?', a: 'Cheaper Nexus menawarkan Pakej Percubaan Pertama (RM888), Pakej Pengurusan Media Sosial (RM2,888/bulan), Pakej Pertumbuhan Perniagaan Penuh (RM8,888/3 bulan), Pengurusan Iklan berasingan, pemasaran influencer KOC/KOL, serta perkhidmatan ala carte reka bentuk/video.' },
      { q: 'Berapakah kos pemasaran digital di Malaysia?', a: 'Pakej percubaan bermula dari RM888 (sekali setiap syarikat), Pengurusan Media Sosial berterusan dari RM2,888/bulan, Pengurusan Iklan dari RM2,000/bulan, reka bentuk ala carte dari RM150, dan video dari RM800.' },
      { q: 'Berapa kali saya boleh guna Pakej Percubaan Pertama?', a: 'Terhad kepada sekali penggunaan setiap pengarah syarikat, supaya pelanggan baharu dapat merasai kualiti kami pada harga eksklusif sebelum menaik taraf ke pakej Pengurusan Media Sosial atau Pertumbuhan Perniagaan Penuh.' },
    ],
  },
};

const icons = [
  <Sparkles className="w-7 h-7" />,
  <Share2 className="w-7 h-7" />,
  <Rocket className="w-7 h-7" />,
  <Megaphone className="w-7 h-7" />,
  <Users className="w-7 h-7" />,
  <Palette className="w-7 h-7" />,
];

const metaT: Record<Language, { title: string; desc: string }> = {
  zh: { title: '马来西亚数码营销服务 | Cheaper Nexus', desc: '马来西亚数码营销服务：首次体验套餐 RM888、社媒管理套餐 RM2,888/月、全面业务增长套餐、广告投放管理、KOC/KOL 网红营销、单点设计与视频。' },
  en: { title: 'Digital Marketing Services Malaysia | Cheaper Nexus', desc: 'Digital marketing services in Malaysia: First Trial Package RM888, Social Media Management RM2,888/month, Full Business Growth Package, Ads Management, KOC/KOL influencer marketing, ala carte design & video.' },
  ms: { title: 'Perkhidmatan Pemasaran Digital Malaysia | Cheaper Nexus', desc: 'Perkhidmatan pemasaran digital di Malaysia: Pakej Percubaan Pertama RM888, Pengurusan Media Sosial RM2,888/bulan, Pakej Pertumbuhan Perniagaan Penuh, Pengurusan Iklan, pemasaran influencer KOC/KOL, reka bentuk & video ala carte.' },
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
      <Footer lang={lang} />
    </>
  );
}
