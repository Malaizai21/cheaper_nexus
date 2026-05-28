import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CheckCircle2, Phone, ArrowRight, Star } from 'lucide-react';

const SITE_URL = 'https://cheapernexus.com';

const tiers = [
  {
    name: 'Basic Starter',
    tagline: 'Foundation Building',
    price: 'RM 1,688',
    unit: '/ month',
    highlight: false,
    features: [
      { category: 'Video Content', value: '1 Short Video' },
      { category: 'Graphic Posts', value: '1 Creative Post' },
      { category: 'Platforms', value: 'Facebook & Instagram' },
      { category: 'Ads Management', value: 'Basic Ads Configuration' },
      { category: 'Content & Copy', value: 'Basic Artwork Editing' },
      { category: 'Support', value: 'WhatsApp Inquiry Button Setup' },
    ],
  },
  {
    name: 'Growth Booster',
    tagline: 'Active Engagement',
    price: 'RM 4,688',
    unit: '/ month',
    highlight: true,
    features: [
      { category: 'Video Content', value: '4 Short Videos' },
      { category: 'Graphic Posts', value: '8 Creative Posts' },
      { category: 'Platforms', value: 'FB / IG / TikTok' },
      { category: 'Ads Management', value: 'Ads Setting & Active Monitoring' },
      { category: 'Content & Copy', value: 'Content Planning, Caption Copywriting, Story Posting' },
      { category: 'Strategy', value: 'Monthly Campaign Planning' },
      { category: 'Reports', value: 'Monthly Performance Report' },
    ],
  },
  {
    name: 'Ultimate',
    tagline: 'Strategic Dominance',
    price: 'RM 10,888',
    unit: '/ 3 months',
    highlight: false,
    features: [
      { category: 'Video Content', value: '12 Professional Videos' },
      { category: 'Graphic Posts', value: '10 Creative Posts' },
      { category: 'Platforms', value: 'FB / IG / TikTok / XHS (小红书)' },
      { category: 'Ads Management', value: 'Full Ads Strategy Setup & Funnels' },
      { category: 'Content & Copy', value: 'Content Planning, Campaign Ideas, Brand Positioning' },
      { category: 'Strategy', value: 'Sales Funnel Planning' },
      { category: 'Support', value: 'Marketing Discussions & Priority Support' },
    ],
  },
];

const pricingTable = [
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
];

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>Digital Marketing Pricing Malaysia | Packages from RM 1,688 | Cheaper Nexus</title>
        <meta name="description" content="Transparent digital marketing pricing in Malaysia. Packages from RM 1,688/month. Basic Starter, Growth Booster, Ultimate and Enterprise packages for SMEs." />
        <meta name="keywords" content="digital marketing pricing malaysia, social media management price malaysia, SEO price malaysia, digital marketing package malaysia" />
        <link rel="canonical" href={`${SITE_URL}/pricing`} />
        <meta property="og:title" content="Digital Marketing Pricing Malaysia | Cheaper Nexus" />
        <meta property="og:description" content="Transparent digital marketing packages from RM 1,688/month for Malaysian SMEs." />
        <meta property="og:url" content={`${SITE_URL}/pricing`} />
      </Helmet>

      <div className="min-h-screen bg-brand-white">
        {/* Header */}
        <div className="bg-brand-blue text-white pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full text-brand-cyan text-sm font-semibold mb-6">
              Transparent Pricing
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Digital Marketing Packages for Malaysian SMEs
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              No hidden fees. No vague retainers. Every package clearly defines what you get — so you can make a confident decision.
            </p>
          </div>
        </div>

        {/* Package tiers */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-brand-blue mb-3">Choose Your Growth Package</h2>
            <p className="text-brand-blue/60">Bundled solutions for every stage of your business.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {tiers.map(tier => (
              <div key={tier.name} className={`relative rounded-[28px] p-8 flex flex-col ${
                tier.highlight
                  ? 'bg-brand-blue text-white shadow-2xl shadow-brand-blue/30 scale-105'
                  : 'bg-white border border-brand-blue/8'
              }`}>
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 bg-brand-cyan text-brand-blue rounded-full text-xs font-bold">
                    <Star className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${tier.highlight ? 'text-brand-cyan' : 'text-brand-cyan'}`}>
                  {tier.tagline}
                </div>
                <div className={`text-2xl font-bold mb-1 ${tier.highlight ? 'text-white' : 'text-brand-blue'}`}>
                  {tier.name}
                </div>
                <div className="mb-6">
                  <span className={`text-3xl font-bold ${tier.highlight ? 'text-brand-cyan' : 'text-brand-blue'}`}>{tier.price}</span>
                  <span className={`text-sm ml-1 ${tier.highlight ? 'text-white/60' : 'text-brand-blue/40'}`}>{tier.unit}</span>
                </div>
                <ul className="space-y-3 flex-grow mb-8">
                  {tier.features.map(f => (
                    <li key={f.category} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${tier.highlight ? 'text-brand-cyan' : 'text-brand-cyan'}`} />
                      <div>
                        <span className={`text-xs font-semibold block ${tier.highlight ? 'text-white/50' : 'text-brand-blue/40'}`}>{f.category}</span>
                        <span className={`text-sm ${tier.highlight ? 'text-white' : 'text-brand-blue/80'}`}>{f.value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <a href="https://wa.me/60134391541" target="_blank" rel="noopener noreferrer"
                  className={`w-full text-center py-3 rounded-full font-bold text-sm transition-all ${
                    tier.highlight
                      ? 'bg-brand-cyan text-brand-blue hover:opacity-90'
                      : 'border-2 border-brand-blue/15 text-brand-blue hover:border-brand-cyan hover:text-brand-cyan'
                  }`}>
                  Get Started
                </a>
              </div>
            ))}
          </div>

          {/* Enterprise */}
          <div className="bg-gradient-to-r from-brand-blue to-brand-blue/90 rounded-[28px] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
            <div>
              <div className="text-brand-cyan font-bold text-sm mb-2">Enterprise & Custom</div>
              <h3 className="text-2xl font-bold mb-2">RM 15,000+ / project</h3>
              <p className="text-white/60 max-w-xl">
                Tailored for high-growth corporate entities and IPO-ready brands. Custom scope, dedicated team, priority execution.
              </p>
            </div>
            <a href="https://wa.me/60172915754" target="_blank" rel="noopener noreferrer"
              className="shrink-0 px-8 py-4 bg-brand-cyan text-brand-blue rounded-full font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
              <Phone className="w-4 h-4" /> Talk to Henry
            </a>
          </div>

          {/* Full pricing table */}
          <div>
            <h2 className="text-2xl font-bold text-brand-blue mb-3">Full Pricing Summary</h2>
            <p className="text-brand-blue/60 mb-8">All individual service prices. Mix and match based on your needs.</p>
            <div className="overflow-x-auto rounded-2xl border border-brand-blue/8">
              <table className="w-full">
                <thead>
                  <tr className="bg-brand-blue text-white">
                    <th className="text-left px-6 py-4 text-sm font-semibold">Service</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold">Price</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold">Billing</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingTable.map((row, i) => (
                    <tr key={i} className={`border-t border-brand-blue/5 ${i % 2 === 0 ? 'bg-white' : 'bg-brand-blue/2'}`}>
                      <td className="px-6 py-4 text-sm text-brand-blue/80">{row.service}</td>
                      <td className="px-6 py-4 text-sm font-bold text-brand-blue text-right">{row.price}</td>
                      <td className="px-6 py-4 text-sm text-brand-blue/40 text-right">{row.billing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-brand-blue/40 mt-4">* Custom packages available. Ad spend not included in management fees.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-brand-blue text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-white/60 mb-8">Chat with us — we'll help you pick the right package for your budget and goals.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/60134391541" target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 bg-brand-cyan text-brand-blue rounded-full font-bold hover:opacity-90 transition-opacity">
                WhatsApp Calvin — 013-439 1541
              </a>
              <Link to="/services" className="px-8 py-4 border-2 border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center gap-2 justify-center">
                View All Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
