import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Phone, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

const SITE_URL = 'https://cheapernexus.com';

const industries = [
  'F&B / Restaurant', 'Retail / E-Commerce', 'Beauty & Wellness', 'Education',
  'Property & Real Estate', 'Healthcare / Clinic', 'Professional Services',
  'Travel & Hospitality', 'Fashion & Lifestyle', 'Tech & Startup', 'Other',
];

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  url: `${SITE_URL}/contact`,
  name: 'Contact Cheaper Nexus',
  description: 'Get in touch with Cheaper Nexus digital marketing agency Malaysia via WhatsApp or inquiry form.',
};

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', business: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hi Cheaper Nexus! I'd like a free consultation.\n\nName: ${formData.name}\nPhone: ${formData.phone}\nBusiness: ${formData.business}\n${formData.message ? 'Message: ' + formData.message : ''}`
    );
    window.open(`https://wa.me/60134391541?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Free Digital Marketing Consultation Malaysia | Cheaper Nexus</title>
        <meta name="description" content="Get a free digital marketing consultation for your Malaysian business. Contact Cheaper Nexus via WhatsApp or fill out our inquiry form. Calvin: 013-439 1541 | Henry: 017-291 5754." />
        <meta name="keywords" content="contact digital marketing agency malaysia, free consultation digital marketing malaysia, WhatsApp marketing agency malaysia" />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta property="og:title" content="Contact Cheaper Nexus | Free Digital Marketing Consultation" />
        <meta property="og:description" content="Get a free digital marketing consultation for your Malaysian business." />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
        <script type="application/ld+json">{JSON.stringify(contactSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-brand-white">
        {/* Header */}
        <div className="bg-brand-blue text-white pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full text-brand-cyan text-sm font-semibold mb-6">
              Free Consultation
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Let's Grow Your Business</h1>
            <p className="text-white/60 text-lg max-w-xl">
              Tell us about your business and we'll recommend the right digital marketing strategy — for free.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid md:grid-cols-2 gap-16">

            {/* Left: Contact info */}
            <div>
              <h2 className="text-2xl font-bold text-brand-blue mb-6">Talk to Our Team</h2>
              <p className="text-brand-blue/60 mb-10 leading-relaxed">
                We respond within 1 business hour via WhatsApp. No sales pressure — just honest advice about what will work for your business.
              </p>

              <div className="space-y-5 mb-12">
                <a href="https://wa.me/60134391541" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between p-6 bg-brand-blue/3 border border-brand-blue/8 rounded-2xl hover:border-brand-cyan/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-blue text-brand-cyan rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-brand-blue">Calvin</div>
                      <div className="text-sm text-brand-blue/50">Digital Strategist</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-sm">
                    <Phone className="w-4 h-4" /> 013-439 1541
                  </div>
                </a>

                <a href="https://wa.me/60172915754" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between p-6 bg-brand-blue/3 border border-brand-blue/8 rounded-2xl hover:border-brand-cyan/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-blue text-brand-cyan rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-brand-blue">Henry</div>
                      <div className="text-sm text-brand-blue/50">Creative Director</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-sm">
                    <Phone className="w-4 h-4" /> 017-291 5754
                  </div>
                </a>
              </div>

              <div className="space-y-3">
                {[
                  'Free 30-minute strategy consultation',
                  'No commitment required',
                  'Response within 1 business hour',
                  'Serving all of Malaysia',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-brand-blue/70">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white border border-brand-blue/8 rounded-[28px] p-8 shadow-xl shadow-brand-blue/5">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-blue mb-2">Message Sent!</h3>
                  <p className="text-brand-blue/60 mb-6">We've opened WhatsApp with your details. We'll respond within 1 business hour.</p>
                  <Link to="/" className="inline-flex items-center gap-2 text-brand-cyan font-bold hover:gap-3 transition-all">
                    Back to Home <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-brand-blue mb-2">Full Name *</label>
                    <input
                      type="text" required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-5 py-3.5 bg-brand-blue/3 border border-brand-blue/8 rounded-xl focus:ring-2 focus:ring-brand-cyan outline-none transition-all text-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-blue mb-2">WhatsApp Number *</label>
                    <input
                      type="tel" required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+60 12-345 6789"
                      className="w-full px-5 py-3.5 bg-brand-blue/3 border border-brand-blue/8 rounded-xl focus:ring-2 focus:ring-brand-cyan outline-none transition-all text-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-blue mb-2">Business Industry *</label>
                    <select
                      required
                      value={formData.business}
                      onChange={e => setFormData({ ...formData, business: e.target.value })}
                      className="w-full px-5 py-3.5 bg-brand-blue/3 border border-brand-blue/8 rounded-xl focus:ring-2 focus:ring-brand-cyan outline-none transition-all text-brand-blue appearance-none"
                    >
                      <option value="">Select your industry</option>
                      {industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-blue mb-2">Tell Us About Your Goals <span className="font-normal text-brand-blue/40">(optional)</span></label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. I want to increase sales through TikTok..."
                      className="w-full px-5 py-3.5 bg-brand-blue/3 border border-brand-blue/8 rounded-xl focus:ring-2 focus:ring-brand-cyan outline-none transition-all text-brand-blue resize-none"
                    />
                  </div>
                  <button type="submit"
                    className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-blue/90 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" /> Send via WhatsApp
                  </button>
                  <p className="text-xs text-brand-blue/40 text-center">This will open WhatsApp with your details pre-filled.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
