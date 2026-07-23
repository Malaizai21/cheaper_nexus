import { Helmet } from 'react-helmet-async';

type Language = 'en' | 'zh' | 'ms';

// Update this to your actual deployed domain
const SITE_URL = 'https://cheapernexus.com';

const seoData: Record<Language, { title: string; description: string; keywords: string; locale: string; htmlLang: string }> = {
  zh: {
    title: 'Cheaper Nexus | 马来西亚数码营销专家',
    description:
      '一站式数码营销服务商：UGC短视频制作、Meta广告与内容管理、Google SEO 优化、小红书KOC种草、电商解决方案。价格从 RM500 起，全透明无隐藏收费。',
    keywords:
      '数码营销,SEO优化,Meta广告,社媒管理,电商,TikTok营销,马来西亚,网络营销,Google广告,品牌推广',
    locale: 'zh_MY',
    htmlLang: 'zh-MY',
  },
  en: {
    title: 'Cheaper Nexus | Digital Marketing Agency Malaysia',
    description:
      'Your all-in-one digital growth partner in Malaysia. UGC video production, Meta ads & content management, Google SEO & e-commerce solutions from RM500. Transparent pricing, no hidden fees.',
    keywords:
      'digital marketing malaysia,SEO malaysia,Meta ads,social media management,e-commerce,TikTok marketing,Google ads,branding,content creation',
    locale: 'en_MY',
    htmlLang: 'en-MY',
  },
  ms: {
    title: 'Cheaper Nexus | Agensi Pemasaran Digital Malaysia',
    description:
      'Rakan pertumbuhan digital all-in-one anda di Malaysia. Penerbitan video UGC, pengurusan iklan & kandungan Meta, SEO Google & penyelesaian e-dagang dari RM500. Harga telus, tiada caj tersembunyi.',
    keywords:
      'pemasaran digital malaysia,SEO malaysia,iklan Meta,pengurusan media sosial,e-dagang,pemasaran TikTok,iklan Google,penjenamaan',
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
    image: `${SITE_URL}/logo.png`,
    telephone: '+60172915754',
    description:
      'All-in-one digital marketing agency in Malaysia offering video production, social media management, Meta Ads, Google SEO, and e-commerce solutions.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kuala Lumpur',
      addressRegion: 'Kuala Lumpur',
      addressCountry: 'MY',
    },
    priceRange: 'RM500 - RM15000+',
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
          itemOffered: { '@type': 'Service', name: 'UGC Short-Video Production' },
          price: '500',
          priceCurrency: 'MYR',
          description: 'Native-style short-video production for TikTok & Xiaohongshu — filming, editing, and scriptwriting included, priced per video.',
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Meta Ads & Content Management' },
          price: '2000',
          priceCurrency: 'MYR',
          description: 'Combined Facebook and Instagram post copywriting and ads management with audience targeting and creative optimisation.',
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Xiaohongshu KOC Seeding' },
          price: '4500',
          priceCurrency: 'MYR',
          description: 'Organic KOC seeding campaign on Xiaohongshu — 10 seeded posts to reach Chinese-speaking consumers in Malaysia.',
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Google Ads & SEO Marketing' },
          price: '1888',
          priceCurrency: 'MYR',
          description: 'Google keyword advertising and long-term organic SEO growth.',
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'E-Commerce & Web Solutions' },
          price: '1888',
          priceCurrency: 'MYR',
          description: 'Shopee, Lazada, TikTok shop onboarding and corporate website design.',
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
          text: 'Cheaper Nexus is a Malaysia-based all-in-one digital marketing agency offering UGC video production, Meta ads & content management, Xiaohongshu KOC seeding, Google SEO, and e-commerce solutions for SMEs. Services start from RM500 with transparent pricing and no hidden fees.',
        },
      },
      {
        '@type': 'Question',
        name: 'What digital marketing services does Cheaper Nexus offer in Malaysia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cheaper Nexus offers five core services: (1) UGC short-video production (filming, editing, scriptwriting) for TikTok and Xiaohongshu, (2) combined Meta post copywriting and ads management for Facebook and Instagram, (3) Xiaohongshu KOC seeding, (4) Google Ads and SEO optimisation, and (5) e-commerce management on Shopee, Lazada, and TikTok Shop.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does digital marketing cost in Malaysia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cheaper Nexus digital marketing packages start from RM500 per UGC video. Combined Meta content and ads management is RM2,000/month. Xiaohongshu KOC seeding starts from RM4,500 for 10 posts. Google Ads and SEO management start from RM1,200/month. All pricing is transparent with no hidden fees.',
        },
      },
      {
        '@type': 'Question',
        name: '马来西亚数码营销费用是多少？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cheaper Nexus 的数码营销服务价格从 RM500/支（UGC短视频）起。Meta 内容与广告管理为 RM2,000/月，小红书 KOC 种草从 RM4,500/10篇起，Google 广告管理从 RM1,200/月起，全透明定价，无隐藏费用。',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Cheaper Nexus work with small businesses and SMEs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Cheaper Nexus specialises in helping Malaysian SMEs and small businesses grow online. The agency offers flexible, affordable packages starting from RM500, with direct WhatsApp access to the team and a free 30-minute strategy consultation.',
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
