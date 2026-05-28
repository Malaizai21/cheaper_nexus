import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, CheckCircle2, Phone, Video, Share2, TrendingUp, ShoppingBag, BookOpen } from 'lucide-react';

const SITE_URL = 'https://cheapernexus.com';

const services = [
  {
    icon: <Video className="w-7 h-7" />,
    slug: 'ugc-koc-video',
    title: 'UGC & KOC Video Content',
    subtitle: 'Authentic creator video matrix for TikTok & Instagram',
    description: 'Drive authentic engagement with real-creator content optimised for TikTok and Instagram algorithms. We source, brief, and manage a full creator matrix that builds trust at scale.',
    includes: ['UGC / KOC Video Matrix (5 videos)', 'TikTok / IG Influencer Unboxing Matrix (10 videos)', 'Script & Creative Direction'],
    options: [
      { name: 'UGC / KOC Video Matrix', price: 'RM 1,250', unit: '/ 5 videos' },
      { name: 'TikTok / IG Influencer Unboxing Matrix', price: 'RM 3,500', unit: '/ 10 videos' },
    ],
  },
  {
    icon: <Share2 className="w-7 h-7" />,
    slug: 'social-media-management',
    title: 'Social Media Management',
    subtitle: 'Full-network visual framework and monthly growth packages',
    description: 'Unified brand presence across all social platforms with a dedicated content calendar and engagement team. We handle everything so you can focus on running your business.',
    includes: ['Full-Network Visual Framework Setup', 'Daily Content & Scheduling', 'Community Management & Reply'],
    options: [
      { name: 'Full-Network Visual Framework (Basic Setup)', price: 'RM 1,000', unit: 'one-time' },
      { name: 'Package A: Digital Infrastructure Plan', price: 'RM 1,800', unit: '/ month' },
      { name: 'Package B: Video Growth Engine', price: 'RM 3,888', unit: '/ month' },
    ],
  },
  {
    icon: <BookOpen className="w-7 h-7" />,
    slug: 'xiaohongshu-marketing',
    title: 'XHS / Xiaohongshu Marketing',
    subtitle: 'Blue V verification, full account management & KOC seeding',
    description: 'Dominate China\'s leading discovery platform with certified brand presence and mass organic KOC seeding campaigns. Essential for brands targeting Malaysian Chinese consumers.',
    includes: ['Enterprise Blue V Verification & Onboarding', 'Official Account Full Management', 'Organic KOC Seeding (Mass Placement)'],
    options: [
      { name: 'Enterprise Blue V Verification & Ecosystem Onboarding', price: 'RM 3,500', unit: 'one-time' },
      { name: 'Official Account Full Account Management', price: 'RM 2,500', unit: '/ month' },
      { name: 'Organic KOC Seeding (Mass Placement)', price: 'RM 3,500', unit: '/ 10 posts' },
    ],
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    slug: 'digital-ads-seo',
    title: 'Digital Ads & SEO',
    subtitle: 'Meta/Google ad placement, GEO & SEO optimization',
    description: 'Precision ad targeting and long-term search engine dominance to capture high-intent customers at every stage of the funnel. We manage your budget like it\'s our own.',
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
    icon: <ShoppingBag className="w-7 h-7" />,
    slug: 'ecommerce-live-streaming',
    title: 'E-Commerce & Live Streaming',
    subtitle: 'Multi-platform shop setup, 360° management & live broadcasting',
    description: 'End-to-end e-commerce solution from multi-platform shop setup to full-scale management and professional live streaming. We help you sell on Shopee, Lazada, and TikTok Shop.',
    includes: ['Multi-Platform Setup & Store Decoration', 'E-Commerce 360° Full Management', 'Official Live Streaming / Broadcasting'],
    options: [
      { name: 'Multi-Platform Setup & Basic Store Decoration', price: 'RM 1,888', unit: 'one-time' },
      { name: 'E-Commerce 360° Full Management', price: 'RM 5,000', unit: '/ month' },
      { name: 'Official Live Streaming / Broadcasting Service', price: 'RM 2,500', unit: '/ month' },
    ],
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What digital marketing services does Cheaper Nexus offer in Malaysia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cheaper Nexus offers UGC & KOC video content, social media management, Xiaohongshu (XHS) marketing, digital ads & SEO (Meta, Google), and e-commerce & live streaming services for Malaysian businesses.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does digital marketing cost in Malaysia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cheaper Nexus services start from RM 1,000 for social media setup, RM 1,200/month for ad management, and RM 2,500/month for SEO. Full packages start from RM 1,688/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Cheaper Nexus offer Xiaohongshu (小红书) marketing in Malaysia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We offer full Xiaohongshu services including Blue V enterprise verification, official account management, and organic KOC seeding campaigns for Malaysian brands targeting the Chinese consumer market.',
      },
    },
  ],
};

export default function Services() {
  return (
    <>
      <Helmet>
        <title>Digital Marketing Services Malaysia | Cheaper Nexus</title>
        <meta name="description" content="Comprehensive digital marketing services in Malaysia: UGC videos, social media management, Xiaohongshu marketing, Meta & Google ads, SEO, and e-commerce. Starting from RM 1,000." />
        <meta name="keywords" content="digital marketing services malaysia, social media management malaysia, SEO malaysia, Meta ads malaysia, TikTok marketing malaysia, Xiaohongshu malaysia" />
        <link rel="canonical" href={`${SITE_URL}/services`} />
        <meta property="og:title" content="Digital Marketing Services Malaysia | Cheaper Nexus" />
        <meta property="og:description" content="Comprehensive digital marketing services for Malaysian SMEs. Starting from RM 1,000." />
        <meta property="og:url" content={`${SITE_URL}/services`} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-brand-white">
        {/* Header */}
        <div className="bg-brand-blue text-white pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full text-brand-cyan text-sm font-semibold mb-6">
              Our Services
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-2xl">
              Digital Marketing Services for Malaysian Businesses
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              From content creation to paid ads and SEO — everything your business needs to grow online in Malaysia. Transparent pricing, no hidden fees.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <a href="https://wa.me/60134391541" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan text-brand-blue rounded-full font-bold hover:opacity-90 transition-opacity">
                <Phone className="w-4 h-4" /> WhatsApp Calvin
              </a>
              <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-all">
                View Packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Services list */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="space-y-16">
            {services.map((s, i) => (
              <div key={s.slug} className={`grid md:grid-cols-2 gap-12 items-start ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                {/* Info */}
                <div>
                  <div className="w-14 h-14 bg-brand-blue text-brand-cyan rounded-2xl flex items-center justify-center mb-6">
                    {s.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-brand-blue mb-2">{s.title}</h2>
                  <p className="text-brand-cyan font-semibold mb-4">{s.subtitle}</p>
                  <p className="text-brand-blue/60 leading-relaxed mb-6">{s.description}</p>

                  <div className="mb-6">
                    <p className="text-sm font-bold text-brand-blue mb-3">What's Included:</p>
                    <ul className="space-y-2">
                      {s.includes.map(item => (
                        <li key={item} className="flex items-start gap-2 text-sm text-brand-blue/70">
                          <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {s.note && (
                    <p className="text-xs text-brand-blue/40 italic mb-4">* {s.note}</p>
                  )}

                  <a href="https://wa.me/60134391541" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand-cyan font-bold text-sm hover:gap-3 transition-all">
                    Get a quote <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Pricing options */}
                <div className="bg-brand-blue/3 border border-brand-blue/8 rounded-[28px] p-8">
                  <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-6">Pricing Options</p>
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
        </div>

        {/* FAQ Section */}
        <div className="bg-brand-blue/3 border-t border-brand-blue/5">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
            <h2 className="text-2xl font-bold text-brand-blue mb-10 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqSchema.mainEntity.map((faq, i) => (
                <div key={i} className="p-6 bg-white rounded-2xl border border-brand-blue/5">
                  <h3 className="font-bold text-brand-blue mb-2">{faq.name}</h3>
                  <p className="text-brand-blue/60 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-brand-blue text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Not Sure Which Service You Need?</h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Chat with us on WhatsApp — we'll recommend the right strategy based on your business goals and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/60134391541" target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 bg-brand-cyan text-brand-blue rounded-full font-bold hover:opacity-90 transition-opacity">
                WhatsApp Calvin — 013-439 1541
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
