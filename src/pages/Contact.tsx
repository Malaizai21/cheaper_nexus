import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useLanguage, type Language } from '../hooks/useLanguage';

const SITE_URL = 'https://cheapernexus.com';

const t: Record<Language, {
  hero: { tag: string; title: string; subtitle: string };
  teamTitle: string; teamSub: string;
  calvinRole: string; henryRole: string;
  perks: string[];
  form: { nameLabel: string; phoneLbl: string; bizLbl: string; msgLbl: string; msgOpt: string; submit: string; hint: string; msgPlaceholder: string };
  industries: string[];
  successTitle: string; successSub: string; backHome: string;
  metaTitle: string; metaDesc: string;
}> = {
  zh: {
    hero: { tag: '免费咨询', title: '让我们一起发展您的业务', subtitle: '告诉我们您的业务情况，我们将免费为您推荐最合适的数码营销策略。' },
    teamTitle: '联系我们的团队', teamSub: '我们通过 WhatsApp 在 1 个工作小时内回复。没有销售压力——只提供对您业务真正有用的诚实建议。',
    calvinRole: '数码策略师', henryRole: '创意总监',
    perks: ['30 分钟免费策略咨询', '无需任何承诺', '1 个工作小时内回复', '服务马来西亚全国'],
    form: { nameLabel: '姓名 *', phoneLbl: 'WhatsApp 号码 *', bizLbl: '业务类型 *', msgLbl: '告诉我们您的目标', msgOpt: '（选填）', submit: '通过 WhatsApp 发送', hint: '点击后将打开 WhatsApp，您的信息已预填好。', msgPlaceholder: '例如：我想通过 TikTok 提高销售额...' },
    industries: ['餐饮 / 食品饮料', '零售 / 电商', '美容与健康', '教育', '房地产', '医疗 / 诊所', '专业服务', '旅游与酒店', '时尚与生活方式', '科技与初创', '其他'],
    successTitle: '信息已发送！', successSub: '我们已打开 WhatsApp 并预填了您的信息。我们将在 1 个工作小时内回复。', backHome: '返回首页',
    metaTitle: '联系我们 | 免费数码营销咨询马来西亚 | Cheaper Nexus',
    metaDesc: '获取马来西亚业务的免费数码营销咨询。通过 WhatsApp 联系 Cheaper Nexus。Calvin：013-439 1541 | Henry：017-291 5754。',
  },
  en: {
    hero: { tag: 'Free Consultation', title: "Let's Grow Your Business", subtitle: "Tell us about your business and we'll recommend the right digital marketing strategy — for free." },
    teamTitle: 'Talk to Our Team', teamSub: "We respond within 1 business hour via WhatsApp. No sales pressure — just honest advice about what will work for your business.",
    calvinRole: 'Digital Strategist', henryRole: 'Creative Director',
    perks: ['Free 30-minute strategy consultation', 'No commitment required', 'Response within 1 business hour', 'Serving all of Malaysia'],
    form: { nameLabel: 'Full Name *', phoneLbl: 'WhatsApp Number *', bizLbl: 'Business Industry *', msgLbl: 'Tell Us About Your Goals', msgOpt: '(optional)', submit: 'Send via WhatsApp', hint: 'This will open WhatsApp with your details pre-filled.', msgPlaceholder: 'e.g. I want to increase sales through TikTok...' },
    industries: ['F&B / Restaurant', 'Retail / E-Commerce', 'Beauty & Wellness', 'Education', 'Property & Real Estate', 'Healthcare / Clinic', 'Professional Services', 'Travel & Hospitality', 'Fashion & Lifestyle', 'Tech & Startup', 'Other'],
    successTitle: 'Message Sent!', successSub: "We've opened WhatsApp with your details. We'll respond within 1 business hour.", backHome: 'Back to Home',
    metaTitle: 'Contact Us | Free Digital Marketing Consultation Malaysia | Cheaper Nexus',
    metaDesc: 'Get a free digital marketing consultation for your Malaysian business. Contact Cheaper Nexus via WhatsApp. Calvin: 013-439 1541 | Henry: 017-291 5754.',
  },
  ms: {
    hero: { tag: 'Konsultasi Percuma', title: 'Mari Kembangkan Perniagaan Anda', subtitle: 'Ceritakan tentang perniagaan anda dan kami akan mengesyorkan strategi pemasaran digital yang tepat — percuma.' },
    teamTitle: 'Bercakap dengan Pasukan Kami', teamSub: 'Kami memberi respons dalam masa 1 jam perniagaan melalui WhatsApp. Tiada tekanan jualan — hanya nasihat jujur.',
    calvinRole: 'Ahli Strategi Digital', henryRole: 'Pengarah Kreatif',
    perks: ['Konsultasi strategi percuma 30 minit', 'Tiada komitmen diperlukan', 'Respons dalam masa 1 jam perniagaan', 'Melayani seluruh Malaysia'],
    form: { nameLabel: 'Nama Penuh *', phoneLbl: 'Nombor WhatsApp *', bizLbl: 'Jenis Perniagaan *', msgLbl: 'Ceritakan Matlamat Anda', msgOpt: '(pilihan)', submit: 'Hantar melalui WhatsApp', hint: 'Ini akan membuka WhatsApp dengan butiran anda diisi terlebih dahulu.', msgPlaceholder: 'cth. Saya ingin meningkatkan jualan melalui TikTok...' },
    industries: ['F&B / Restoran', 'Runcit / E-Dagang', 'Kecantikan & Kesihatan', 'Pendidikan', 'Hartanah', 'Penjagaan Kesihatan / Klinik', 'Perkhidmatan Profesional', 'Pelancongan & Hospitaliti', 'Fesyen & Gaya Hidup', 'Teknologi & Syarikat Permulaan', 'Lain-lain'],
    successTitle: 'Mesej Dihantar!', successSub: 'Kami telah membuka WhatsApp dengan butiran anda. Kami akan membalas dalam masa 1 jam perniagaan.', backHome: 'Kembali ke Laman Utama',
    metaTitle: 'Hubungi Kami | Konsultasi Pemasaran Digital Percuma Malaysia | Cheaper Nexus',
    metaDesc: 'Dapatkan konsultasi pemasaran digital percuma untuk perniagaan Malaysia anda. Hubungi Cheaper Nexus melalui WhatsApp. Calvin: 013-439 1541 | Henry: 017-291 5754.',
  },
};

export default function Contact() {
  const [lang, setLang] = useLanguage();
  const [formData, setFormData] = useState({ name: '', phone: '', business: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const content = t[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hi Cheaper Nexus!\n\nName: ${formData.name}\nPhone: ${formData.phone}\nBusiness: ${formData.business}${formData.message ? '\nMessage: ' + formData.message : ''}`
    );
    window.open(`https://wa.me/60134391541?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>{content.metaTitle}</title>
        <meta name="description" content={content.metaDesc} />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta property="og:title" content={content.metaTitle} />
        <meta property="og:description" content={content.metaDesc} />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
      </Helmet>

      <div className="min-h-screen bg-brand-white">
        <Navbar lang={lang} setLang={setLang} />

        {/* Header */}
        <div className="bg-brand-blue text-white pt-32 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full text-brand-cyan text-sm font-semibold mb-6">
              {content.hero.tag}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.hero.title}</h1>
            <p className="text-white/60 text-lg max-w-xl">{content.hero.subtitle}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-bold text-brand-blue mb-4">{content.teamTitle}</h2>
              <p className="text-brand-blue/60 mb-10 leading-relaxed">{content.teamSub}</p>
              <div className="space-y-4 mb-12">
                {[
                  { name: 'Calvin', role: content.calvinRole, phone: '013-439 1541', wa: '60134391541' },
                  { name: 'Henry', role: content.henryRole, phone: '017-291 5754', wa: '60172915754' },
                ].map(person => (
                  <a key={person.name} href={`https://wa.me/${person.wa}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 bg-brand-blue/3 border border-brand-blue/8 rounded-2xl hover:border-brand-cyan/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-blue text-brand-cyan rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-brand-blue">{person.name}</div>
                        <div className="text-sm text-brand-blue/50">{person.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-sm">
                      <Phone className="w-4 h-4" /> {person.phone}
                    </div>
                  </a>
                ))}
              </div>
              <div className="space-y-3">
                {content.perks.map(p => (
                  <div key={p} className="flex items-center gap-2 text-sm text-brand-blue/70">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" /> {p}
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-brand-blue/8 rounded-[28px] p-8 shadow-xl shadow-brand-blue/5">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-blue mb-2">{content.successTitle}</h3>
                  <p className="text-brand-blue/60 mb-6">{content.successSub}</p>
                  <Link to="/" className="inline-flex items-center gap-2 text-brand-cyan font-bold hover:gap-3 transition-all">
                    {content.backHome} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-brand-blue mb-2">{content.form.nameLabel}</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder={lang === 'zh' ? '您的姓名' : lang === 'ms' ? 'Nama anda' : 'Your name'}
                      className="w-full px-5 py-3.5 bg-brand-blue/3 border border-brand-blue/8 rounded-xl focus:ring-2 focus:ring-brand-cyan outline-none transition-all text-brand-blue" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-blue mb-2">{content.form.phoneLbl}</label>
                    <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+60 12-345 6789"
                      className="w-full px-5 py-3.5 bg-brand-blue/3 border border-brand-blue/8 rounded-xl focus:ring-2 focus:ring-brand-cyan outline-none transition-all text-brand-blue" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-blue mb-2">{content.form.bizLbl}</label>
                    <select required value={formData.business} onChange={e => setFormData({ ...formData, business: e.target.value })}
                      className="w-full px-5 py-3.5 bg-brand-blue/3 border border-brand-blue/8 rounded-xl focus:ring-2 focus:ring-brand-cyan outline-none transition-all text-brand-blue appearance-none">
                      <option value="">{lang === 'zh' ? '选择行业' : lang === 'ms' ? 'Pilih industri' : 'Select your industry'}</option>
                      {content.industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-blue mb-2">
                      {content.form.msgLbl} <span className="font-normal text-brand-blue/40">{content.form.msgOpt}</span>
                    </label>
                    <textarea rows={3} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder={content.form.msgPlaceholder}
                      className="w-full px-5 py-3.5 bg-brand-blue/3 border border-brand-blue/8 rounded-xl focus:ring-2 focus:ring-brand-cyan outline-none transition-all text-brand-blue resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-blue/90 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" /> {content.form.submit}
                  </button>
                  <p className="text-xs text-brand-blue/40 text-center">{content.form.hint}</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
