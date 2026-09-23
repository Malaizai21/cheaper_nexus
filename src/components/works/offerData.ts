import { type Language } from '../../hooks/useLanguage';
import { WHATSAPP_URL } from './worksData';

/**
 * Offer copy for the /works page, which now carries both the portfolio and the
 * price list so paid traffic lands on one page instead of bouncing between two.
 *
 * Every figure here is copied from src/pages/Pricing.tsx and src/pages/Services.tsx
 * — those pages stay the source of truth. If a price changes there, change it here
 * too, or the two pages will disagree in front of a customer.
 */

export interface OfferTier {
  id: string;
  name: string;
  price: string;
  unit: string;
  tagline: string;
  features: string[];
  value: string;
  popular?: boolean;
}

export interface AlaCarteItem {
  title: string;
  price: string;
  unit: string;
  note: string;
  /** Rendered larger — the two offers we actively promote. */
  feature?: boolean;
}

export interface Faq {
  q: string;
  a: string;
}

/** Prefilled WhatsApp text so the first message already says which package they want. */
export const waLink = (message: string) => `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;

/** Opening line, in the language the visitor is reading the page in. */
export const waGeneral: Record<Language, string> = {
  zh: '你好 Cheaper Nexus，我看了你们的作品页，想了解一下。',
  en: 'Hi Cheaper Nexus, I saw your work page and would like to know more.',
  ms: 'Hai Cheaper Nexus, saya lihat halaman kerja anda dan ingin tahu lebih lanjut.',
};

/** Same, but naming the package and price the visitor tapped. */
export const waPackage = (lang: Language, name: string, price: string, unit: string): string => {
  // The zh units already carry brackets, so avoid nesting another pair around them.
  if (lang === 'zh') return `你好 Cheaper Nexus，我想咨询「${name}」${price} ${unit}。`;
  if (lang === 'ms') return `Hai Cheaper Nexus, saya berminat dengan ${name} (${price} ${unit}).`;
  return `Hi Cheaper Nexus, I'm interested in the ${name} (${price} ${unit}).`;
};

export const offerT: Record<Language, {
  /** Hero */
  heroPriceAnchor: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  /** Proof bar */
  proofClients: (n: number) => string;
  proofPieces: (n: number) => string;
  proofIndustries: (n: number) => string;
  /** Pricing */
  pricingEyebrow: string;
  pricingTitle: string;
  pricingSub: string;
  popularBadge: string;
  valuePrefix: string;
  tierCta: string;
  tiers: OfferTier[];
  alaTitle: string;
  alaSub: string;
  ala: AlaCarteItem[];
  alaNote: string;
  /** Work section header */
  workEyebrow: string;
  workTitle: string;
  workSub: string;
  /** Process */
  processEyebrow: string;
  processTitle: string;
  steps: { title: string; body: string }[];
  /** FAQ */
  faqTitle: string;
  faqs: Faq[];
  /** Sticky bar */
  stickyLabel: string;
  stickyCta: string;
}> = {
  zh: {
    heroPriceAnchor: '套餐 RM888 起 · 单支影片 RM800 · 10 支 RM5,000',
    heroCtaPrimary: 'WhatsApp 免费咨询',
    heroCtaSecondary: '看套餐价格',

    proofClients: n => `${n} 个客户品牌`,
    proofPieces: n => `${n} 件已交付作品`,
    proofIndustries: n => `${n} 个行业`,

    pricingEyebrow: '价格透明',
    pricingTitle: '价格直接写在这里',
    pricingSub: '不用来回问报价。每个套餐清楚列明交付内容，看完直接 WhatsApp 找我们就好。',
    popularBadge: '最受欢迎',
    valuePrefix: '原价值',
    tierCta: 'WhatsApp 询问这个套餐',
    tiers: [
      {
        id: 'trial',
        name: '首次体验套餐',
        price: 'RM 888',
        unit: '/ 月（限一次）',
        tagline: '先看我们的水准，再决定要不要长期做',
        features: [
          '1 支短视频（拍摄 + 剪接 + 脚本 + 文案）',
          '2 份专业设计',
          'Meta 广告基础搭建（1 专页）',
        ],
        value: 'RM3,100（省 RM2,212）',
      },
      {
        id: 'smm',
        name: '社媒管理套餐',
        price: 'RM 2,888',
        unit: '/ 月',
        tagline: '内容 + 代运营 + 广告一体化，最多客户选这个',
        features: [
          '2 支短视频',
          '5 份专业设计 + IG Feed',
          'FB / IG / TikTok / 小红书代运营（各 1 专页）',
          'Meta 广告投放与优化',
        ],
        value: 'RM5,738（省 RM2,850）',
        popular: true,
      },
      {
        id: 'growth',
        name: '全面业务增长套餐',
        price: 'RM 8,888',
        unit: '/ 3 个月',
        tagline: '规模化内容 + 全渠道代运营',
        features: [
          '6 支短视频',
          '18 份专业设计 + IG Feed',
          '全渠道代运营（FB / IG / TikTok / 小红书 / Google 商家 / Waze / Telegram / Lemon8）',
          'Meta 广告投放与优化',
        ],
        value: 'RM10,888（省 RM2,000）',
      },
    ],
    alaTitle: '不想绑月费？单点也可以',
    alaSub: '设计和影片都能按件订购，做完一次满意再谈长期。',
    ala: [
      { title: '视频制作 × 10', price: 'RM 5,000', unit: '省 RM3,000', note: '一次拍完 10 支，单支等于 RM500', feature: true },
      { title: '视频制作 × 1', price: 'RM 800', unit: '/ 支', note: '拍摄 + 剪接 + 脚本 + 内容', feature: true },
      { title: '专业设计 × 10', price: 'RM 800', unit: '省 RM700', note: '单张等于 RM80' },
      { title: '专业设计 × 1', price: 'RM 150', unit: '/ 份', note: '按件订购，不用绑套餐' },
      { title: '广告投放管理', price: 'RM 2,000', unit: '/ 月起', note: 'TikTok / IG / FB / 小红书 / Google 等平台代投' },
      { title: 'KOC / KOL 网红营销', price: 'RM 3,888', unit: '起', note: '全平台通用，10 位达人起' },
    ],
    alaNote: '所有价格不含广告投放费用与模特／达人费用。巴生谷地区建议单次拍摄 5 支起；吉隆坡／雪兰莪以外的外地拍摄，住宿、油费及附加费由客户承担。',

    workEyebrow: '真实作品',
    workTitle: '这些是我们实际交付的东西',
    workSub: '下面每一支影片、每一张设计，都是真的交给马来西亚客户用在生意上的。可以按服务或行业筛选。',

    processEyebrow: '合作流程',
    processTitle: '从聊天到上线，通常一个星期内',
    steps: [
      { title: 'WhatsApp 聊需求', body: '先聊你的生意、客群和目标，30 分钟内我们就能告诉你该用哪个套餐，不合适也会直说。' },
      { title: '确认套餐与脚本', body: '定下套餐后，我们写脚本和设计方向给你过目，你点头我们才开工。' },
      { title: '拍摄与制作', body: '拍摄、剪接、设计、文案全部我们做。巴生谷一次拍完，省来回时间。' },
      { title: '交付与投放', body: '成品交给你，或直接由我们上架投放并持续优化。' },
    ],

    faqTitle: '客户最常问的',
    faqs: [
      { q: '拍一支短视频多少钱？', a: '单支 RM800，包含拍摄、剪接、脚本和文案；一次订 10 支是 RM5,000，等于单支 RM500。不含模特／达人费用与广告投放费用。' },
      { q: '首次体验套餐可以用几次？', a: '每间公司的负责人只能用一次。用意是让新客户先以 RM888 看到我们的实际水准（原价值 RM3,100），再决定要不要走长期套餐。' },
      { q: '价格包含广告费吗？', a: '不包含。套餐里的是我们的制作与代投服务费，Meta／TikTok 的广告费由你自己的广告账户直接付给平台，花多少完全由你决定。' },
      { q: '你们在哪里拍摄？外坡可以吗？', a: '主要在吉隆坡与雪兰莪一带。巴生谷地区建议一次拍 5 支以上比较划算；吉隆坡／雪兰莪以外的外地拍摄可以安排，住宿、油费及附加费由客户承担。' },
      { q: '多久可以看到成品？', a: '从确认套餐和脚本开始算，短视频与设计通常一个星期内交付；拍摄档期和修改轮次会影响时间，我们在聊的时候会先给你明确日期。' },
      { q: '我不会写文案也不会拍，需要准备什么？', a: '脚本、文案、拍摄、剪接、设计我们全包，你只需要提供产品／服务资料和拍摄场地。作品页里的案例都是这样做出来的。' },
    ],

    stickyLabel: '套餐 RM888 起',
    stickyCta: 'WhatsApp 咨询',
  },

  en: {
    heroPriceAnchor: 'Packages from RM888 · Single video RM800 · 10 videos RM5,000',
    heroCtaPrimary: 'Free WhatsApp consultation',
    heroCtaSecondary: 'See pricing',

    proofClients: n => `${n} client brands`,
    proofPieces: n => `${n} pieces delivered`,
    proofIndustries: n => `${n} industries`,

    pricingEyebrow: 'Transparent pricing',
    pricingTitle: 'The prices are right here',
    pricingSub: 'No back-and-forth to get a quote. Every package lists exactly what you get — read it, then message us.',
    popularBadge: 'Most popular',
    valuePrefix: 'Original value',
    tierCta: 'Ask about this package',
    tiers: [
      {
        id: 'trial',
        name: 'First Trial Package',
        price: 'RM 888',
        unit: '/ month (one-time)',
        tagline: 'See our standard before committing to anything ongoing',
        features: [
          '1 short video (filming + editing + script + copywriting)',
          '2 professional designs',
          'Meta Ads foundation setup (1 page)',
        ],
        value: 'RM3,100 (save RM2,212)',
      },
      {
        id: 'smm',
        name: 'Social Media Management Package',
        price: 'RM 2,888',
        unit: '/ month',
        tagline: 'Content + management + ads in one — what most clients pick',
        features: [
          '2 short videos',
          '5 professional designs + IG feed',
          'FB / IG / TikTok / XHS management (1 page each)',
          'Meta ads management & optimisation',
        ],
        value: 'RM5,738 (save RM2,850)',
        popular: true,
      },
      {
        id: 'growth',
        name: 'Full Business Growth Package',
        price: 'RM 8,888',
        unit: '/ 3 months',
        tagline: 'Scaled content + full-channel management',
        features: [
          '6 short videos',
          '18 professional designs + IG feed',
          'Full-channel management (FB / IG / TikTok / XHS / Google / Waze / Telegram / Lemon8)',
          'Meta ads management & optimisation',
        ],
        value: 'RM10,888 (save RM2,000)',
      },
    ],
    alaTitle: "Don't want a monthly commitment?",
    alaSub: 'Design and video can be ordered per unit. Try one job first, talk long-term later.',
    ala: [
      { title: '10 Videos', price: 'RM 5,000', unit: 'save RM3,000', note: 'Shot in one go — RM500 per video', feature: true },
      { title: '1 Video', price: 'RM 800', unit: '/ video', note: 'Filming + editing + script + content', feature: true },
      { title: '10 Professional Designs', price: 'RM 800', unit: 'save RM700', note: 'RM80 per design' },
      { title: '1 Professional Design', price: 'RM 150', unit: '/ design', note: 'Per unit, no package needed' },
      { title: 'Ads Management', price: 'RM 2,000', unit: '/ month+', note: 'TikTok / IG / FB / XHS / Google and more' },
      { title: 'KOC / KOL Influencer Marketing', price: 'RM 3,888', unit: '+', note: 'Cross-platform, from 10 creators' },
    ],
    alaNote: 'All prices exclude ad spend and model/influencer fees. Within the Klang Valley we recommend at least 5 videos per shoot; for shoots outside KL/Selangor, accommodation, fuel and surcharges are borne by the client.',

    workEyebrow: 'Real work',
    workTitle: 'This is what we actually deliver',
    workSub: 'Every video and design below was delivered to a Malaysian business and used in their marketing. Filter by service or industry.',

    processEyebrow: 'How it works',
    processTitle: 'From first chat to live, usually within a week',
    steps: [
      { title: 'Chat on WhatsApp', body: "Tell us your business, audience and goal. Within 30 minutes we'll tell you which package fits — and say so if none do." },
      { title: 'Confirm package & script', body: 'We write the script and design direction for your approval before any production starts.' },
      { title: 'Filming & production', body: 'Filming, editing, design and copy are all handled by us. One shoot in the Klang Valley covers the batch.' },
      { title: 'Delivery & launch', body: 'We hand over the finished files, or run and optimise the ads for you directly.' },
    ],

    faqTitle: 'What clients ask most',
    faqs: [
      { q: 'How much is one short video?', a: 'RM800 per video including filming, editing, script and copywriting. Ten videos ordered together is RM5,000 — RM500 each. Model/influencer fees and ad spend are not included.' },
      { q: 'How many times can I use the First Trial Package?', a: "Once per company director. It exists so new clients can see our actual standard for RM888 (original value RM3,100) before deciding on an ongoing package." },
      { q: 'Does the price include ad spend?', a: 'No. The package covers our production and management fee. Meta/TikTok ad spend is paid by you directly to the platform from your own ad account, at whatever budget you set.' },
      { q: 'Where do you film? Can you travel outstation?', a: 'Mainly around Kuala Lumpur and Selangor. Within the Klang Valley, 5+ videos per shoot is the most cost-effective. Outstation shoots can be arranged, with accommodation, fuel and surcharges borne by the client.' },
      { q: 'How long until I get the finished work?', a: 'Counting from package and script confirmation, videos and designs are usually delivered within a week. Shoot scheduling and revision rounds affect this — we give you firm dates when we chat.' },
      { q: "I can't write or film. What do I need to prepare?", a: 'Script, copy, filming, editing and design are all on us. You provide your product/service details and a location to film. Every case on this page was produced that way.' },
    ],

    stickyLabel: 'From RM888',
    stickyCta: 'WhatsApp us',
  },

  ms: {
    heroPriceAnchor: 'Pakej dari RM888 · Satu video RM800 · 10 video RM5,000',
    heroCtaPrimary: 'Rundingan WhatsApp percuma',
    heroCtaSecondary: 'Lihat harga',

    proofClients: n => `${n} jenama klien`,
    proofPieces: n => `${n} hasil kerja dihantar`,
    proofIndustries: n => `${n} industri`,

    pricingEyebrow: 'Harga telus',
    pricingTitle: 'Harga ada di sini',
    pricingSub: 'Tak perlu tanya sebut harga berulang kali. Setiap pakej senaraikan apa yang anda dapat — baca, kemudian WhatsApp kami.',
    popularBadge: 'Paling popular',
    valuePrefix: 'Nilai asal',
    tierCta: 'Tanya tentang pakej ini',
    tiers: [
      {
        id: 'trial',
        name: 'Pakej Percubaan Pertama',
        price: 'RM 888',
        unit: '/ bulan (sekali sahaja)',
        tagline: 'Lihat mutu kerja kami dahulu sebelum komitmen jangka panjang',
        features: [
          '1 video pendek (penggambaran + penyuntingan + skrip + penulisan)',
          '2 reka bentuk profesional',
          'Persediaan asas Iklan Meta (1 halaman)',
        ],
        value: 'RM3,100 (jimat RM2,212)',
      },
      {
        id: 'smm',
        name: 'Pakej Pengurusan Media Sosial',
        price: 'RM 2,888',
        unit: '/ bulan',
        tagline: 'Kandungan + pengurusan + iklan bersepadu — pilihan paling ramai',
        features: [
          '2 video pendek',
          '5 reka bentuk profesional + IG feed',
          'Pengurusan FB / IG / TikTok / XHS (1 halaman setiap satu)',
          'Pengurusan & pengoptimuman iklan Meta',
        ],
        value: 'RM5,738 (jimat RM2,850)',
        popular: true,
      },
      {
        id: 'growth',
        name: 'Pakej Pertumbuhan Perniagaan Penuh',
        price: 'RM 8,888',
        unit: '/ 3 bulan',
        tagline: 'Kandungan berskala + pengurusan penuh saluran',
        features: [
          '6 video pendek',
          '18 reka bentuk profesional + IG feed',
          'Pengurusan penuh saluran (FB / IG / TikTok / XHS / Google / Waze / Telegram / Lemon8)',
          'Pengurusan & pengoptimuman iklan Meta',
        ],
        value: 'RM10,888 (jimat RM2,000)',
      },
    ],
    alaTitle: 'Tak mahu komitmen bulanan?',
    alaSub: 'Reka bentuk dan video boleh ditempah secara berasingan. Cuba satu kerja dahulu.',
    ala: [
      { title: '10 Video', price: 'RM 5,000', unit: 'jimat RM3,000', note: 'Satu penggambaran — RM500 satu video', feature: true },
      { title: '1 Video', price: 'RM 800', unit: '/ video', note: 'Penggambaran + penyuntingan + skrip + kandungan', feature: true },
      { title: '10 Reka Bentuk Profesional', price: 'RM 800', unit: 'jimat RM700', note: 'RM80 satu reka bentuk' },
      { title: '1 Reka Bentuk Profesional', price: 'RM 150', unit: '/ reka bentuk', note: 'Setiap unit, tiada pakej diperlukan' },
      { title: 'Pengurusan Iklan', price: 'RM 2,000', unit: '/ bulan+', note: 'TikTok / IG / FB / XHS / Google dan lain-lain' },
      { title: 'Pemasaran Influencer KOC / KOL', price: 'RM 3,888', unit: '+', note: 'Merentasi platform, dari 10 pencipta' },
    ],
    alaNote: 'Semua harga tidak termasuk kos iklan dan yuran model/influencer. Dalam Lembah Klang kami cadangkan sekurang-kurangnya 5 video setiap penggambaran; untuk penggambaran di luar KL/Selangor, penginapan, minyak dan caj tambahan ditanggung pelanggan.',

    workEyebrow: 'Kerja sebenar',
    workTitle: 'Inilah yang kami hasilkan',
    workSub: 'Setiap video dan reka bentuk di bawah telah dihantar kepada perniagaan Malaysia. Tapis mengikut perkhidmatan atau industri.',

    processEyebrow: 'Cara ia berfungsi',
    processTitle: 'Dari perbualan pertama hingga siar, biasanya dalam seminggu',
    steps: [
      { title: 'Berbual di WhatsApp', body: 'Ceritakan perniagaan, sasaran dan matlamat anda. Dalam 30 minit kami beritahu pakej mana yang sesuai — atau kata terus jika tiada yang sesuai.' },
      { title: 'Sahkan pakej & skrip', body: 'Kami tulis skrip dan hala tuju reka bentuk untuk kelulusan anda sebelum produksi bermula.' },
      { title: 'Penggambaran & produksi', body: 'Penggambaran, penyuntingan, reka bentuk dan penulisan semuanya kami uruskan. Satu penggambaran di Lembah Klang merangkumi keseluruhan set.' },
      { title: 'Penghantaran & pelancaran', body: 'Kami serahkan fail siap, atau terus jalankan dan optimumkan iklan untuk anda.' },
    ],

    faqTitle: 'Soalan paling kerap',
    faqs: [
      { q: 'Berapa harga satu video pendek?', a: 'RM800 satu video termasuk penggambaran, penyuntingan, skrip dan penulisan. Sepuluh video sekali gus RM5,000 — RM500 satu. Yuran model/influencer dan kos iklan tidak termasuk.' },
      { q: 'Berapa kali saya boleh guna Pakej Percubaan Pertama?', a: 'Sekali sahaja setiap pengarah syarikat. Tujuannya supaya pelanggan baharu dapat lihat mutu sebenar kami dengan RM888 (nilai asal RM3,100) sebelum memilih pakej berterusan.' },
      { q: 'Adakah harga termasuk kos iklan?', a: 'Tidak. Pakej meliputi yuran produksi dan pengurusan kami. Kos iklan Meta/TikTok dibayar terus oleh anda kepada platform dari akaun iklan anda sendiri, mengikut bajet yang anda tetapkan.' },
      { q: 'Di mana anda membuat penggambaran? Boleh ke luar kawasan?', a: 'Terutamanya sekitar Kuala Lumpur dan Selangor. Dalam Lembah Klang, 5 video atau lebih setiap penggambaran paling berbaloi. Penggambaran luar kawasan boleh diatur, dengan penginapan, minyak dan caj tambahan ditanggung pelanggan.' },
      { q: 'Berapa lama untuk dapat hasil siap?', a: 'Dikira dari pengesahan pakej dan skrip, video dan reka bentuk biasanya dihantar dalam seminggu. Jadual penggambaran dan pusingan pindaan mempengaruhi tempoh — kami beri tarikh yang jelas semasa berbual.' },
      { q: 'Saya tidak pandai menulis atau merakam. Apa yang perlu saya sediakan?', a: 'Skrip, penulisan, penggambaran, penyuntingan dan reka bentuk semuanya kami uruskan. Anda sediakan maklumat produk/perkhidmatan dan lokasi penggambaran. Semua kes di halaman ini dihasilkan begitu.' },
    ],

    stickyLabel: 'Dari RM888',
    stickyCta: 'WhatsApp kami',
  },
};
