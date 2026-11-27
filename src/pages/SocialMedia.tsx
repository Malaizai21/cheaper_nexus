import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { fadeUp, stagger, CountUp } from '../components/Motion';
import { useLanguage, type Language } from '../hooks/useLanguage';
import { type Work } from '../components/works/worksData';

/**
 * The social media management service page.
 *
 * Built after three months of Search Console showed where the traffic
 * actually is: the five non-blog pages drew 11 of 14 clicks in 28 days while
 * all 84 blog articles drew 3. The two agencies ranking above us cover this
 * whole keyword cluster with a homepage and one deep service page, which is
 * what this is — the flagship service on its own URL, rather than one of six
 * entries on /services.
 */

const SITE_URL = 'https://cheapernexus.com';
const WA = 'https://wa.me/60172915754';

const wa = (lang: Language) =>
  `${WA}?text=${encodeURIComponent(
    lang === 'zh'
      ? '你好 Cheaper Nexus，我想了解「社媒代运营套餐」RM 2,888／月。'
      : lang === 'ms'
        ? 'Hai Cheaper Nexus, saya berminat dengan Pakej Pengurusan Media Sosial (RM 2,888/bulan).'
        : "Hi Cheaper Nexus, I'm interested in the Social Media Management Package (RM 2,888/month).",
  )}`;

type Copy = {
  metaTitle: string; metaDesc: string;
  tag: string; h1: string; lede: string; cta: string; cta2: string;
  loopTitle: string; loopSub: string; loop: { t: string; d: string }[];
  channelsTitle: string; channelsSub: string; channels: string[]; channelsNote: string;
  proofTitle: string; proofSub: string; proofNote: string; proofCta: string;
  suitsTitle: string; suits: string[]; notSuitsTitle: string; notSuits: string;
  processTitle: string; process: { t: string; d: string }[];
  priceTag: string; priceTitle: string; price: string; priceUnit: string;
  priceIncludes: string[]; priceExcl: string;
  faqTitle: string; faqs: { q: string; a: string }[];
  finalTitle: string; finalSub: string;
};

const t: Record<Language, Copy> = {
  zh: {
    metaTitle: '社媒代运营马来西亚 | FB/IG/TikTok/小红书 RM2,888 起 | Cheaper Nexus',
    metaDesc: '马来西亚社媒代运营服务：脚本、拍摄、剪辑、设计、日常代运营、Meta 广告投放一条龙，覆盖 Facebook／Instagram／TikTok／小红书。RM 2,888／月，价格公开，有真实客户成效数据。',
    tag: '核心服务',
    h1: '社媒代运营',
    lede: '从写脚本到投广告，一个团队做完。不是帮你排版发帖——是把内容做出来，再花钱推到还没关注你的人面前。',
    cta: 'WhatsApp 免费咨询',
    cta2: '看真实作品',
    loopTitle: '我们接手的是整条链路',
    loopSub: '大部分「社媒代运营」只做最后一步。内容还是要你自己想、自己拍。',
    loop: [
      { t: '写脚本', d: '按你的客户在想什么写，不是按模板。文案方向先给你过目，确认了才开拍。' },
      { t: '拍摄', d: '我们到场拍。你只需要提供产品／服务细节和一个可以拍的地方。' },
      { t: '剪辑', d: '短视频成品，含字幕、配乐、节奏。中文、英文或马来文按你卖给谁来定。' },
      { t: '设计', d: '平面设计 + IG 版面排布，整个账号看起来是一套的，不是东一张西一张。' },
      { t: '日常代运营', d: 'FB／IG／TikTok／小红书每天的发布与维护，不用你再惦记。' },
      { t: 'Meta 广告投放', d: '内容做好了要有人看见。广告由我们投放与优化，预算你自己定、直接付给平台。' },
    ],
    channelsTitle: '覆盖平台',
    channelsSub: '社媒管理套餐标配四个平台，全面业务增长套餐再加四个。',
    channels: ['Facebook', 'Instagram', 'TikTok', '小红书 XHS'],
    channelsNote: '全面业务增长套餐（RM 8,888／3 个月）另加 Google 商家、Waze、Telegram、Lemon8。',
    proofTitle: '真实投放成效',
    proofSub: '这些是我们实际帮客户跑出来的单次对话成本，不是行业平均值。',
    proofNote: '只公开单次成本，不公开花费与总量——那是客户的预算，不该从我们这里流出去。',
    proofCta: '看全部客户作品',
    suitsTitle: '适合什么样的生意',
    suits: [
      '老板自己在管营销，已经没时间继续管',
      '知道短视频有用，但做不到每周都产出',
      '找过不同的自由职业者，结果每个平台调性都不一样',
      '有在投 Meta 广告，但素材跟不上，钱花得不甘心',
    ],
    notSuitsTitle: '这些我们不做',
    notSuits: '建网站、Google 广告代投、SEO、电商全案 —— 这几块我们不接，第一通电话就会直接说，不会先接下来再想办法。',
    processTitle: '合作流程',
    process: [
      { t: '免费 30 分钟咨询', d: 'WhatsApp 聊你的生意、客户和预算。我们会告诉你哪个套餐合适——或者直接说都不合适。' },
      { t: '确认脚本与设计方向', d: '开拍之前先给你过目。方向对了才动手，不浪费一整个拍摄日。' },
      { t: '拍摄与制作', d: '拍摄、剪辑、设计、文案全部由我们完成。' },
      { t: '上线与投放', d: '内容发布，广告开跑，每月复盘数据再调整。' },
    ],
    priceTag: '社媒管理套餐',
    priceTitle: '价格公开，没有隐藏收费',
    price: 'RM 2,888',
    priceUnit: '／月',
    priceIncludes: [
      '2 支短视频（脚本＋拍摄＋剪辑＋文案）',
      '5 份专业设计 ＋ IG 版面排布',
      'FB／IG／TikTok／小红书 各一个账号代运营',
      'Meta 广告投放管理与优化',
    ],
    priceExcl: '不含广告投放费用（你自己的广告账户直接付给平台，预算你定）与模特／达人费用。',
    faqTitle: '常见问题',
    faqs: [
      { q: '社媒代运营在马来西亚大概多少钱？', a: 'Cheaper Nexus 的社媒管理套餐是 RM 2,888／月，含 2 支短视频、5 份设计、四个平台的日常代运营和 Meta 广告投放管理。想先看成品的话，首次体验套餐 RM 888，每间公司限用一次。' },
      { q: '套餐价格包含广告费吗？', a: '不包含。套餐是我们的制作与代运营费用。Meta／TikTok 的广告投放费由你从自己的广告账户直接付给平台，预算多少你自己定。' },
      { q: '你们代运营哪些平台？', a: '社媒管理套餐标配 Facebook、Instagram、TikTok、小红书各一个账号。全面业务增长套餐（RM 8,888／3 个月）再加 Google 商家、Waze、Telegram、Lemon8。' },
      { q: '内容是什么语言？', a: '中文、英文或马来文，看你卖给谁。有几个客户是同一个 campaign 跑两个语言版本，分开投放。' },
      { q: '多久能看到成品？', a: '从确认套餐和脚本开始算，短视频与设计通常一个星期内交付。拍摄排期和修改轮次会影响时间，具体日期在第一次咨询时就会讲清楚。' },
      { q: '可以先看你们做过什么吗？', a: '可以。10 个马来西亚客户的实际作品和完整价格表公开在同一页，而且其中 8 个附了真实的 Meta 投放成效数据。' },
    ],
    finalTitle: '先聊 30 分钟，再决定',
    finalSub: '免费，没有任何承诺。不合适我们会直接说。',
  },

  en: {
    metaTitle: 'Social Media Agency Malaysia | FB, IG, TikTok, XHS from RM2,888 | Cheaper Nexus',
    metaDesc: 'Social media management Malaysia: script, filming, editing, design, daily page management and Meta ads handled by one team across Facebook, Instagram, TikTok and Xiaohongshu. RM2,888/month, prices published, real client cost-per-conversation data.',
    tag: 'Core service',
    h1: 'Social Media Management',
    lede: 'From writing the script to running the ads, handled by one team. Not post scheduling — we make the content, then pay to put it in front of people who do not follow you yet.',
    cta: 'Free WhatsApp consultation',
    cta2: 'See the actual work',
    loopTitle: 'We take the whole loop',
    loopSub: 'Most "social media management" only does the last step. You still have to think up and shoot the content yourself.',
    loop: [
      { t: 'Script', d: 'Written around what your customers are actually thinking, not off a template. You approve the direction before anything is filmed.' },
      { t: 'Filming', d: 'We come and shoot. You provide the product or service details and a place to film.' },
      { t: 'Editing', d: 'Finished short-form video with subtitles, sound and pacing. In Chinese, English or Malay depending on who you sell to.' },
      { t: 'Design', d: 'Graphic design plus IG feed layout, so the account reads as one brand instead of a pile of unrelated posts.' },
      { t: 'Daily management', d: 'Day-to-day posting and upkeep on Facebook, Instagram, TikTok and Xiaohongshu, off your plate.' },
      { t: 'Meta ads', d: 'Good content still needs reach. We run and optimise the ads; you set the budget and pay the platform directly.' },
    ],
    channelsTitle: 'Channels covered',
    channelsSub: 'Four as standard on the management package, four more on the growth package.',
    channels: ['Facebook', 'Instagram', 'TikTok', 'Xiaohongshu'],
    channelsNote: 'The Full Business Growth Package (RM8,888 / 3 months) adds Google Business Profile, Waze, Telegram and Lemon8.',
    proofTitle: 'Real campaign results',
    proofSub: 'Cost per WhatsApp conversation we actually produced for these clients — not an industry average.',
    proofNote: 'We publish the unit cost only, never spend or volume — that is the client\'s budget and it should not leak out through us.',
    proofCta: 'See all client work',
    suitsTitle: 'Who this suits',
    suits: [
      'Owners running their own marketing who have run out of hours for it',
      'Businesses that know short-form video works but cannot produce it weekly',
      'Anyone who hired separate freelancers and ended up with a different tone on every platform',
      'Businesses already paying for Meta ads but short on creative to run',
    ],
    notSuitsTitle: 'What we do not do',
    notSuits: 'Website builds, Google Ads, SEO and full e-commerce operations. We do not offer these, and we will say so on the first call rather than take the job and work it out later.',
    processTitle: 'How it works',
    process: [
      { t: 'Free 30-minute call', d: 'A WhatsApp conversation about your business, your customers and your budget. We tell you which package fits, or that none of them do.' },
      { t: 'Approve script and direction', d: 'Agreed before filming starts, so a whole shoot day is never spent on the wrong idea.' },
      { t: 'Production', d: 'Filming, editing, design and copywriting all handled by us.' },
      { t: 'Publish and advertise', d: 'Content goes live, ads start, and we review the numbers monthly and adjust.' },
    ],
    priceTag: 'Social Media Management Package',
    priceTitle: 'Published price, no hidden fees',
    price: 'RM 2,888',
    priceUnit: '/month',
    priceIncludes: [
      '2 short videos (script, filming, editing, copywriting)',
      '5 professional designs + IG feed layout',
      'Daily management of one FB, IG, TikTok and XHS account',
      'Meta ads management and optimisation',
    ],
    priceExcl: 'Ad spend is not included — you pay the platform directly from your own ad account, at whatever budget you set. Model and influencer fees are also excluded.',
    faqTitle: 'Common questions',
    faqs: [
      { q: 'How much does social media management cost in Malaysia?', a: 'The Cheaper Nexus Social Media Management Package is RM2,888 per month, covering 2 short videos, 5 designs, daily management of four platforms and Meta ads management. To see the production standard first, the First Trial Package is RM888, limited to one per company.' },
      { q: 'Does the package price include ad spend?', a: 'No. The package covers our production and management work. Meta and TikTok ad spend is paid by you directly to the platform from your own ad account, at whatever budget you set.' },
      { q: 'Which platforms do you manage?', a: 'One Facebook, Instagram, TikTok and Xiaohongshu account each as standard. The Full Business Growth Package (RM8,888 / 3 months) adds Google Business Profile, Waze, Telegram and Lemon8.' },
      { q: 'What language is the content in?', a: 'Chinese, English or Bahasa Malaysia, depending on who you are selling to. Several clients run two language versions of the same campaign as separate ad sets.' },
      { q: 'How long until the work is delivered?', a: 'Counting from package and script confirmation, videos and designs are usually delivered within a week. Shoot scheduling and revision rounds affect this, and firm dates are agreed during the first consultation.' },
      { q: 'Can I see your past work first?', a: 'Yes. Work for 10 Malaysian clients is published alongside the full price list on one page, and 8 of those case studies carry real Meta campaign cost data.' },
    ],
    finalTitle: 'Have a 30-minute conversation first',
    finalSub: 'Free, no commitment. If we are not the right fit we will say so.',
  },

  ms: {
    metaTitle: 'Agensi Media Sosial Malaysia | FB, IG, TikTok, XHS dari RM2,888 | Cheaper Nexus',
    metaDesc: 'Pengurusan media sosial Malaysia: skrip, penggambaran, suntingan, reka bentuk, pengurusan harian dan iklan Meta oleh satu pasukan merentasi Facebook, Instagram, TikTok dan Xiaohongshu. RM2,888/bulan, harga didedahkan.',
    tag: 'Perkhidmatan utama',
    h1: 'Pengurusan Media Sosial',
    lede: 'Dari menulis skrip hingga menjalankan iklan, diuruskan oleh satu pasukan. Bukan sekadar menjadualkan post — kami hasilkan kandungannya, kemudian bayar untuk bawa ia kepada orang yang belum follow anda.',
    cta: 'Konsultasi WhatsApp percuma',
    cta2: 'Lihat kerja sebenar',
    loopTitle: 'Kami ambil keseluruhan proses',
    loopSub: 'Kebanyakan "pengurusan media sosial" hanya buat langkah terakhir. Kandungan masih anda yang kena fikir dan rakam sendiri.',
    loop: [
      { t: 'Skrip', d: 'Ditulis berdasarkan apa yang pelanggan anda fikirkan, bukan ikut templat. Anda luluskan arah sebelum apa-apa dirakam.' },
      { t: 'Penggambaran', d: 'Kami datang dan rakam. Anda sediakan maklumat produk atau perkhidmatan dan tempat untuk merakam.' },
      { t: 'Suntingan', d: 'Video pendek siap dengan sari kata, bunyi dan rentak. Dalam Cina, Inggeris atau Melayu ikut sasaran anda.' },
      { t: 'Reka bentuk', d: 'Reka bentuk grafik serta susun atur feed IG, supaya akaun kelihatan satu jenama.' },
      { t: 'Pengurusan harian', d: 'Penerbitan dan penyelenggaraan harian di Facebook, Instagram, TikTok dan Xiaohongshu.' },
      { t: 'Iklan Meta', d: 'Kandungan baik tetap perlukan jangkauan. Kami jalankan dan optimumkan iklan; anda tetapkan bajet dan bayar terus kepada platform.' },
    ],
    channelsTitle: 'Platform diliputi',
    channelsSub: 'Empat sebagai standard dalam pakej pengurusan, empat lagi dalam pakej pertumbuhan.',
    channels: ['Facebook', 'Instagram', 'TikTok', 'Xiaohongshu'],
    channelsNote: 'Pakej Pertumbuhan Perniagaan Penuh (RM8,888 / 3 bulan) menambah Google Business Profile, Waze, Telegram dan Lemon8.',
    proofTitle: 'Hasil kempen sebenar',
    proofSub: 'Kos setiap perbualan WhatsApp yang kami hasilkan untuk pelanggan ini — bukan purata industri.',
    proofNote: 'Kami dedahkan kos seunit sahaja, bukan perbelanjaan atau jumlah — itu bajet pelanggan dan ia tidak sepatutnya bocor melalui kami.',
    proofCta: 'Lihat semua kerja pelanggan',
    suitsTitle: 'Sesuai untuk siapa',
    suits: [
      'Pemilik yang uruskan pemasaran sendiri dan sudah kehabisan masa',
      'Perniagaan yang tahu video pendek berkesan tetapi tak mampu hasilkan setiap minggu',
      'Sesiapa yang upah freelancer berasingan dan akhirnya setiap platform lain nada',
      'Perniagaan yang sudah bayar iklan Meta tetapi kekurangan bahan kreatif',
    ],
    notSuitsTitle: 'Apa yang kami tidak buat',
    notSuits: 'Pembinaan laman web, Google Ads, SEO dan operasi e-dagang penuh. Kami tidak menawarkan ini, dan kami akan beritahu pada panggilan pertama.',
    processTitle: 'Cara kami bekerja',
    process: [
      { t: 'Panggilan percuma 30 minit', d: 'Perbualan WhatsApp tentang perniagaan, pelanggan dan bajet anda. Kami beritahu pakej mana yang sesuai, atau tiada yang sesuai.' },
      { t: 'Luluskan skrip dan arah', d: 'Dipersetujui sebelum penggambaran bermula.' },
      { t: 'Penerbitan', d: 'Penggambaran, suntingan, reka bentuk dan penulisan semuanya kami uruskan.' },
      { t: 'Terbit dan iklan', d: 'Kandungan disiarkan, iklan bermula, dan kami semak angka setiap bulan.' },
    ],
    priceTag: 'Pakej Pengurusan Media Sosial',
    priceTitle: 'Harga didedahkan, tiada caj tersembunyi',
    price: 'RM 2,888',
    priceUnit: '/bulan',
    priceIncludes: [
      '2 video pendek (skrip, penggambaran, suntingan, penulisan)',
      '5 reka bentuk profesional + susun atur feed IG',
      'Pengurusan harian satu akaun FB, IG, TikTok dan XHS',
      'Pengurusan dan pengoptimuman iklan Meta',
    ],
    priceExcl: 'Perbelanjaan iklan tidak termasuk — anda bayar terus kepada platform dari akaun iklan sendiri. Yuran model dan influencer juga tidak termasuk.',
    faqTitle: 'Soalan lazim',
    faqs: [
      { q: 'Berapa kos pengurusan media sosial di Malaysia?', a: 'Pakej Pengurusan Media Sosial Cheaper Nexus ialah RM2,888 sebulan, merangkumi 2 video pendek, 5 reka bentuk, pengurusan harian empat platform dan pengurusan iklan Meta. Untuk lihat standard dahulu, Pakej Percubaan Pertama ialah RM888, sekali setiap syarikat.' },
      { q: 'Adakah harga pakej termasuk kos iklan?', a: 'Tidak. Pakej meliputi kerja penerbitan dan pengurusan kami. Perbelanjaan iklan Meta dan TikTok dibayar oleh anda terus kepada platform dari akaun iklan sendiri.' },
      { q: 'Platform mana yang anda uruskan?', a: 'Satu akaun Facebook, Instagram, TikTok dan Xiaohongshu sebagai standard. Pakej Pertumbuhan Perniagaan Penuh (RM8,888 / 3 bulan) menambah Google Business Profile, Waze, Telegram dan Lemon8.' },
      { q: 'Kandungan dalam bahasa apa?', a: 'Cina, Inggeris atau Bahasa Malaysia, bergantung kepada sasaran anda. Beberapa pelanggan menjalankan dua versi bahasa untuk kempen yang sama.' },
      { q: 'Berapa lama sehingga kerja disiapkan?', a: 'Dikira dari pengesahan pakej dan skrip, video dan reka bentuk biasanya disiapkan dalam seminggu. Penjadualan penggambaran dan pusingan semakan mempengaruhi ini.' },
      { q: 'Boleh saya lihat kerja lepas dahulu?', a: 'Boleh. Kerja untuk 10 pelanggan Malaysia diterbitkan bersama senarai harga penuh pada satu halaman, dan 8 daripadanya membawa data kos kempen Meta yang sebenar.' },
    ],
    finalTitle: 'Berbual 30 minit dahulu',
    finalSub: 'Percuma, tiada komitmen. Jika kami bukan pilihan yang sesuai, kami akan beritahu.',
  },
};

export default function SocialMedia() {
  const [lang, setLang] = useLanguage();
  const [works, setWorks] = useState<Work[]>([]);
  const c = t[lang];

  // Proof comes from the same file /works reads, so the figures on this page
  // can never drift from the case studies they came out of.
  useEffect(() => {
    fetch('/works/works.json')
      .then(r => r.json())
      .then((all: Work[]) => setWorks(all.filter(w => w.result)))
      .catch(() => { /* the proof band simply does not render */ });
  }, []);

  const proof = works.slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{c.metaTitle}</title>
        <meta name="description" content={c.metaDesc} />
        <link rel="canonical" href={`${SITE_URL}/social-media-management`} />
        <meta property="og:title" content={c.metaTitle} />
        <meta property="og:description" content={c.metaDesc} />
        <meta property="og:url" content={`${SITE_URL}/social-media-management`} />
        {/* Service and FAQPage schema are emitted by scripts/prerender.mjs
            into this route's static <head>, which React never replaces.
            Repeating them here put two of each on the page. */}
      </Helmet>

      <div className="min-h-screen bg-brand-blue text-white">
        <Navbar lang={lang} setLang={setLang} />

        {/* ───────────────────────────────────────────────── HERO ── */}
        <header className="pt-32 pb-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-cyan mb-5">{c.tag}</p>
            <h1 className="font-black tracking-[-0.035em] text-[clamp(2.4rem,7vw,5rem)] leading-[1.05] mb-6">
              {c.h1}
            </h1>
            <p className="text-white/60 text-lg sm:text-xl leading-relaxed max-w-2xl mb-9">{c.lede}</p>
            <div className="flex flex-wrap gap-4">
              <a
                href={wa(lang)} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-cyan text-brand-blue rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                <MessageSquare className="w-4 h-4" /> {c.cta}
              </a>
              <Link
                to="/works"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 rounded-full font-semibold hover:bg-white/8 transition-colors"
              >
                {c.cta2} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* ──────────────────────────────────────── THE WHOLE LOOP ── */}
        <section className="py-20 px-4 sm:px-6 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <motion.div className="mb-12" {...fadeUp}>
              <h2 className="text-[clamp(1.8rem,4.5vw,3rem)] font-bold leading-tight mb-4">{c.loopTitle}</h2>
              <p className="text-white/55 max-w-2xl leading-relaxed">{c.loopSub}</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {c.loop.map((s, i) => (
                <motion.div
                  key={s.t} {...stagger(i % 3)}
                  className="p-7 rounded-[24px] bg-white/[0.04] border border-white/10"
                >
                  <span className="text-xs font-black tabular-nums text-brand-cyan">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-bold text-lg mt-3 mb-2">{s.t}</h3>
                  <p className="text-sm text-white/55 leading-relaxed">{s.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────── CHANNELS ── */}
        <section className="py-20 px-4 sm:px-6 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeUp}>
              <h2 className="text-[clamp(1.8rem,4.5vw,3rem)] font-bold leading-tight mb-4">{c.channelsTitle}</h2>
              <p className="text-white/55 max-w-2xl leading-relaxed mb-8">{c.channelsSub}</p>
              <div className="flex flex-wrap gap-3 mb-6">
                {c.channels.map(ch => (
                  <span key={ch} className="px-5 py-2.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/[0.07] text-brand-cyan font-semibold text-sm">
                    {ch}
                  </span>
                ))}
              </div>
              <p className="text-sm text-white/45 leading-relaxed max-w-2xl">{c.channelsNote}</p>
            </motion.div>
          </div>
        </section>

        {/* ───────────────────────────────────────────── PROOF ── */}
        {proof.length > 0 && (
          <section className="py-20 px-4 sm:px-6 border-t border-white/10">
            <div className="max-w-5xl mx-auto">
              <motion.div className="mb-10" {...fadeUp}>
                <h2 className="text-[clamp(1.8rem,4.5vw,3rem)] font-bold leading-tight mb-4">{c.proofTitle}</h2>
                <p className="text-white/55 max-w-2xl leading-relaxed">{c.proofSub}</p>
              </motion.div>
              <div className="grid sm:grid-cols-3 gap-5 mb-7">
                {proof.map((w, i) => (
                  <motion.div
                    key={w.slug} {...stagger(i)}
                    className="p-7 rounded-[24px] bg-white/[0.04] border border-white/10"
                  >
                    <CountUp
                      value={w.result!.value}
                      className="block text-3xl font-black tracking-[-0.03em] text-brand-cyan"
                    />
                    <p className="mt-2 text-sm font-semibold text-white/75">
                      {w.result!.label[lang === 'ms' ? 'en' : lang]}
                    </p>
                    <p className="mt-3 text-xs text-white/40">
                      {w.client_name} · {lang === 'zh' ? w.result!.period : w.result!.periodEn}
                    </p>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-white/45 leading-relaxed max-w-2xl mb-6">{c.proofNote}</p>
              <Link to="/works" className="inline-flex items-center gap-2 text-brand-cyan font-bold hover:gap-3 transition-all">
                {c.proofCta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* ──────────────────────────────────── SUITS / NOT SUITS ── */}
        <section className="py-20 px-4 sm:px-6 border-t border-white/10">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            <motion.div {...fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">{c.suitsTitle}</h2>
              <ul className="space-y-3.5">
                {c.suits.map(s => (
                  <li key={s} className="flex items-start gap-3 text-white/70 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-1" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">{c.notSuitsTitle}</h2>
              <p className="text-white/55 leading-relaxed">{c.notSuits}</p>
            </motion.div>
          </div>
        </section>

        {/* ───────────────────────────────────────────── PROCESS ── */}
        <section className="py-20 px-4 sm:px-6 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <motion.h2 className="text-[clamp(1.8rem,4.5vw,3rem)] font-bold leading-tight mb-12" {...fadeUp}>
              {c.processTitle}
            </motion.h2>
            <div>
              {c.process.map((p, i) => (
                <motion.div
                  key={p.t} {...stagger(i)}
                  className="group flex gap-6 sm:gap-8 py-7 border-t border-white/10 last:border-b"
                >
                  <span className="shrink-0 text-2xl sm:text-3xl font-black tabular-nums text-white/15 group-hover:text-brand-cyan transition-colors leading-none pt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base sm:text-lg mb-2">{p.t}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{p.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────── PRICE ── */}
        <section className="py-20 px-4 sm:px-6 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeUp}>
              <h2 className="text-[clamp(1.8rem,4.5vw,3rem)] font-bold leading-tight mb-10">{c.priceTitle}</h2>
              {/* Ink on white: the one light surface on the page, so the price
                  is the thing the eye lands on. */}
              <div className="rounded-[28px] bg-white text-brand-blue p-8 sm:p-10 max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-blue/60">{c.priceTag}</p>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black tracking-[-0.03em]">{c.price}</span>
                  <span className="text-base font-semibold text-brand-blue/65">{c.priceUnit}</span>
                </p>
                <ul className="mt-7 space-y-3">
                  {c.priceIncludes.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-brand-blue/85">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-brand-blue" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs leading-relaxed text-brand-blue/60">{c.priceExcl}</p>
                <a
                  href={wa(lang)} target="_blank" rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 px-7 py-3.5 bg-brand-blue text-white rounded-full font-bold hover:bg-brand-blue/90 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> {c.cta}
                </a>
              </div>
              <p className="mt-6 text-sm text-white/45">
                <Link to="/pricing" className="text-brand-cyan hover:underline">
                  {lang === 'zh' ? '看全部套餐与单点价格' : lang === 'ms' ? 'Lihat semua pakej dan harga' : 'See all packages and ala carte prices'}
                </Link>
              </p>
            </motion.div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────── FAQ ── */}
        <section className="py-20 px-4 sm:px-6 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <motion.h2 className="text-[clamp(1.8rem,4.5vw,3rem)] font-bold leading-tight mb-10" {...fadeUp}>
              {c.faqTitle}
            </motion.h2>
            <div className="space-y-5">
              {c.faqs.map((f, i) => (
                <motion.div
                  key={f.q} {...stagger(i % 4)}
                  className="p-6 rounded-2xl bg-white/[0.04] border border-white/10"
                >
                  <h3 className="font-bold mb-2.5 leading-snug">{f.q}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{f.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────── FINAL CTA ── */}
        <section className="py-24 px-4 sm:px-6 border-t border-white/10 text-center">
          <motion.div className="max-w-2xl mx-auto" {...fadeUp}>
            <h2 className="text-[clamp(1.9rem,5vw,3.4rem)] font-bold leading-tight mb-5">{c.finalTitle}</h2>
            <p className="text-white/55 text-lg mb-9 leading-relaxed">{c.finalSub}</p>
            <a
              href={wa(lang)} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-brand-cyan text-brand-blue rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              <MessageSquare className="w-5 h-5" />
              {c.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </section>
      </div>
      <Footer lang={lang} />
    </>
  );
}
