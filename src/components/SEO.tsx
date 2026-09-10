import { Helmet } from 'react-helmet-async';

type Language = 'en' | 'zh' | 'ms';

// Update this to your actual deployed domain
const SITE_URL = 'https://cheapernexus.com';

const seoData: Record<Language, { title: string; description: string; keywords: string; locale: string; htmlLang: string }> = {
  zh: {
    title: 'Cheaper Nexus | 马来西亚数码营销公司',
    description:
      'Cheaper Nexus 是马来西亚数码营销公司，提供首次体验套餐（RM888）、社媒管理套餐（RM2,888/月）、全面业务增长套餐、广告投放管理、KOC/KOL 网红营销及单点设计视频服务。价格全透明，无隐藏收费。',
    keywords:
      '马来西亚数码营销公司,社媒代运营,数码营销,Meta广告,社媒管理,KOC网红营销,TikTok营销,马来西亚,网络营销,广告投放,品牌推广',
    locale: 'zh_MY',
    htmlLang: 'zh-MY',
  },
  en: {
    title: 'Cheaper Nexus | Digital Marketing Agency Malaysia',
    description:
      'Your all-in-one digital growth partner in Malaysia. First Trial Package (RM888), Social Media Management (RM2,888/month), Full Business Growth Package, Ads Management, and KOC/KOL influencer marketing. Transparent pricing, no hidden fees.',
    keywords:
      'digital marketing malaysia,social media management,Meta ads,ads management,KOC KOL influencer marketing,e-commerce,TikTok marketing,Google ads,branding,content creation',
    locale: 'en_MY',
    htmlLang: 'en-MY',
  },
  ms: {
    title: 'Cheaper Nexus | Agensi Pemasaran Digital Malaysia',
    description:
      'Rakan pertumbuhan digital all-in-one anda di Malaysia. Pakej Percubaan Pertama (RM888), Pengurusan Media Sosial (RM2,888/bulan), Pakej Pertumbuhan Perniagaan Penuh, Pengurusan Iklan, dan pemasaran influencer KOC/KOL. Harga telus, tiada caj tersembunyi.',
    keywords:
      'pemasaran digital malaysia,pengurusan media sosial,iklan Meta,pengurusan iklan,pemasaran influencer KOC KOL,e-dagang,pemasaran TikTok,iklan Google,penjenamaan',
    locale: 'ms_MY',
    htmlLang: 'ms-MY',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    name: 'Cheaper Nexus',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo-og.png`,
    telephone: '+60172915754',
    identifier: {
      '@type': 'PropertyValue',
      name: 'SSM Company Registration No.',
      value: '202601007953 (1670051-W)',
    },
    description:
      'All-in-one digital marketing agency in Malaysia offering social media management packages, ads management, video and design production, and KOC/KOL influencer marketing.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kuala Lumpur',
      addressRegion: 'Kuala Lumpur',
      addressCountry: 'MY',
    },
    priceRange: 'RM150 - RM15000+',
    areaServed: { '@type': 'Country', name: 'Malaysia' },
    availableLanguage: ['Chinese', 'English', 'Malay'],
    sameAs: [
      'https://www.facebook.com/share/18oQi47T7w/',
      'https://www.instagram.com/cheapernexus',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+60172915754',
        contactType: 'sales',
        name: 'Henry',
        contactOption: 'WhatsApp',
        areaServed: 'MY',
        availableLanguage: ['Chinese', 'English', 'Malay'],
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital Marketing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'First Trial Package' },
          price: '888',
          priceCurrency: 'MYR',
          description: 'One-time trial package (limited to once per company) including 1 short video, 2 professional designs, and Meta Ads foundation setup — original value RM3,100.',
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Social Media Management Package' },
          price: '2888',
          priceCurrency: 'MYR',
          description: 'Combined content production, multi-platform social media management (Facebook, Instagram, TikTok, Xiaohongshu), and Meta ads management in one monthly plan.',
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Full Business Growth Package' },
          price: '8888',
          priceCurrency: 'MYR',
          description: 'Scaled content production and full-channel management (Facebook, Instagram, TikTok, Xiaohongshu, Google Business Profile, Waze, Telegram, Lemon8) with ads management, over 3 months.',
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Ads Management' },
          price: '2000',
          priceCurrency: 'MYR',
          description: 'Standalone paid ads management across TikTok, Instagram, Facebook, Xiaohongshu, and Google, with bio & copywriting optimisation and ongoing monitoring.',
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'KOC / KOL Influencer Marketing' },
          price: '3888',
          priceCurrency: 'MYR',
          description: 'Cross-platform influencer and creator marketing campaigns, starting from a package of 10 creators.',
        },
      ],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Cheaper Nexus?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cheaper Nexus is a Malaysia-based all-in-one digital marketing agency offering a First Trial Package, Social Media Management Package, Full Business Growth Package, standalone Ads Management, and KOC/KOL influencer marketing for SMEs. Services start from RM150 with transparent pricing and no hidden fees.',
        },
      },
      {
        '@type': 'Question',
        name: 'What digital marketing services does Cheaper Nexus offer in Malaysia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cheaper Nexus offers a First Trial Package (RM888, one-time), a Social Media Management Package (RM2,888/month combining content, social media management, and ads), a Full Business Growth Package (RM8,888/3 months), standalone Ads Management (from RM2,000/month), KOC/KOL influencer marketing, and ala carte design and video production.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does digital marketing cost in Malaysia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cheaper Nexus digital marketing packages start from a RM888 First Trial Package (one-time). Ongoing Social Media Management is RM2,888/month, Ads Management starts from RM2,000/month, KOC/KOL influencer marketing starts from RM3,888, and ala carte design/video start from RM150. All pricing is transparent with no hidden fees.',
        },
      },
      {
        '@type': 'Question',
        name: '马来西亚数码营销费用是多少？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cheaper Nexus 的数码营销服务：首次体验套餐 RM888 起（限一次），社媒管理套餐 RM2,888/月，广告投放管理从 RM2,000/月起，KOC/KOL 网红营销从 RM3,888 起，单点设计/视频从 RM150 起。全透明定价，无隐藏费用。',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Cheaper Nexus work with small businesses and SMEs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Cheaper Nexus specialises in helping Malaysian SMEs and small businesses grow online. The agency offers flexible, affordable packages starting from RM150, with direct WhatsApp access to the team and a free 30-minute strategy consultation.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I contact Cheaper Nexus?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can contact Cheaper Nexus directly via WhatsApp at +60172915754 (Henry). A free 30-minute strategy consultation is available with no commitment required.',
        },
      },
      {
        '@type': 'Question',
        name: 'Cheaper Nexus 怎么联系？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '可以通过 WhatsApp 直接联系 Cheaper Nexus：Henry +60172915754。提供免费 30 分钟策略咨询，无任何承诺要求。',
        },
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cheaper Nexus',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  },
];

interface SEOProps {
  lang: Language;
}

export function SEO({ lang }: SEOProps) {
  const { title, description, keywords, locale, htmlLang } = seoData[lang];

  return (
    <Helmet>
      <html lang={htmlLang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Cheaper Nexus" />
      <link rel="canonical" href={SITE_URL} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content="zh_MY" />
      <meta property="og:locale:alternate" content="en_MY" />
      <meta property="og:locale:alternate" content="ms_MY" />
      <meta property="og:site_name" content="Cheaper Nexus" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* hreflang alternates */}
      <link rel="alternate" hrefLang="zh-MY" href={SITE_URL} />
      <link rel="alternate" hrefLang="en-MY" href={SITE_URL} />
      <link rel="alternate" hrefLang="ms-MY" href={SITE_URL} />
      <link rel="alternate" hrefLang="x-default" href={SITE_URL} />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(jsonLd[0])}</script>
      <script type="application/ld+json">{JSON.stringify(jsonLd[1])}</script>
      <script type="application/ld+json">{JSON.stringify(jsonLd[2])}</script>
    </Helmet>
  );
}
