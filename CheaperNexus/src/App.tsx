/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Share2, 
  TrendingUp, 
  ShoppingBag, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  ArrowRight,
  Menu,
  X,
  Shield,
  Zap,
  Globe,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Language = 'en' | 'zh' | 'ms';

type ServiceItem = {
  title: string;
  shortDesc: string;
  price: string;
  unit: string;
  details: {
    includes: string[];
    value: string;
    note?: string;
    options?: { name: string; price: string; unit: string }[];
  };
};

type LanguageData = {
  nav: {
    services: string;
    whyUs: string;
    pricing: string;
    contact: string;
    consultation: string;
  };
  hero: {
    tag: string;
    title: string;
    subtitle: string;
    viewServices: string;
  };
  services: {
    title: string;
    subtitle: string;
    viewDetails: string;
    items: ServiceItem[];
  };
  modal: {
    includes: string;
    value: string;
    note: string;
    close: string;
    cta: string;
  };
  whyUs: {
    title: string;
    items: { title: string; description: string; icon: React.ReactNode }[];
  };
  pricing: {
    title: string;
    subtitle: string;
    headers: string[];
    note: string;
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      name: string;
      phone: string;
      business: string;
      submit: string;
      placeholderName: string;
      placeholderPhone: string;
      selectIndustry: string;
    };
  };
};

const translations: Record<Language, LanguageData> = {
  en: {
    nav: {
      services: "Services",
      whyUs: "Why Us",
      pricing: "Pricing",
      contact: "Contact",
      consultation: "Get Free Consultation"
    },
    hero: {
      tag: "Digital Growth Partner",
      title: "Scale Your Business with",
      subtitle: "Your All-in-One Digital Growth Partner: From Branding to Conversion. We help businesses thrive in the digital landscape with data-backed strategies.",
      viewServices: "View Services"
    },
    services: {
      title: "Our Services",
      subtitle: "Comprehensive digital solutions tailored to your business needs.",
      viewDetails: "View Details & Pricing",
      items: [
        {
          title: "Brand Visual Content",
          shortDesc: "Professional Video Production for high-traffic platforms.",
          price: "RM288",
          unit: "/ video",
          details: {
            includes: ["Script Planning", "Professional Shooting", "Post-production Editing"],
            value: "Create high-traffic materials optimized for TikTok/Red algorithms to enhance brand attraction.",
            note: "KOL/Influencer appearance fees are extra."
          }
        },
        {
          title: "Social Media Management",
          shortDesc: "Account setup and monthly full-service management.",
          price: "RM388",
          unit: "Starting",
          details: {
            includes: ["Account Setup (6 Platforms)", "Daily Content Updates", "Comment & Inquiry Management"],
            value: "Unified brand visuals across FB, IG, TikTok, Red, Lemon8, and WA Business. 24h response time.",
            options: [
              { name: "Initial Account Setup", price: "RM388", unit: "one-time" },
              { name: "Full Management & Reply", price: "RM1,188", unit: "/ month" }
            ]
          }
        },
        {
          title: "Meta Ads Precision",
          shortDesc: "Targeted ads on Meta (FB/IG) for exposure or sales.",
          price: "RM1,888",
          unit: "/ month",
          details: {
            includes: ["Meta Ads Management", "Audience Targeting", "Creative Optimization", "Data Analysis"],
            value: "Reach your ideal customers on Facebook and Instagram. Focus on brand awareness or direct sales conversion.",
            note: "Ad spend budget is paid directly to Meta."
          }
        },
        {
          title: "Google & SEO Marketing",
          shortDesc: "Be found when customers search for your products.",
          price: "RM1,888",
          unit: "/ month",
          details: {
            includes: ["Google Keyword Ads", "Website SEO Optimization", "Competitor Analysis", "Performance Tracking"],
            value: "Capture high-intent traffic from search engines. Long-term organic growth and immediate paid visibility.",
            options: [
              { name: "Google Ads Management", price: "RM1,888", unit: "/ month" },
              { name: "SEO Optimization", price: "RM1,888", unit: "/ month" }
            ]
          }
        },
        {
          title: "E-Commerce & Web",
          shortDesc: "Complete online shop and corporate website solutions.",
          price: "RM1,888",
          unit: "Starting",
          details: {
            includes: ["Shop Onboarding (Shopee/Lazada/TikTok)", "Corporate Website Design", "E-commerce Integration"],
            value: "Professional online presence and seamless shopping experience for your customers.",
            options: [
              { name: "3-Platform Shop Setup", price: "RM1,888", unit: "one-time" },
              { name: "Corporate Web Solution", price: "Custom", unit: "quote" }
            ]
          }
        }
      ]
    },
    modal: {
      includes: "What's Included",
      value: "The Value",
      note: "Note",
      close: "Close",
      cta: "Inquire Now"
    },
    whyUs: {
      title: "Why Choose Cheaper Nexus?",
      items: [
        {
          title: "Transparency",
          description: "Clear service standards for every option. No hidden fees.",
          icon: <Shield className="w-6 h-6" />,
        },
        {
          title: "Result-Driven",
          description: "We don't just look at data; we focus on your actual conversions.",
          icon: <Zap className="w-6 h-6" />,
        },
        {
          title: "Cross-Platform Integration",
          description: "Consistent brand competitiveness across SEO, Social, and E-commerce.",
          icon: <Globe className="w-6 h-6" />,
        },
      ]
    },
    pricing: {
      title: "Pricing Summary",
      subtitle: "Transparent pricing for premium digital services.",
      headers: ["Service", "Price", "Billing"],
      note: "* Custom packages available. Ad spend not included in management fees."
    },
    contact: {
      title: "Let's Grow Your Business",
      subtitle: "Ready to take your business to the next level? Fill out the form or reach out to us directly via WhatsApp.",
      form: {
        name: "Full Name",
        phone: "Phone Number",
        business: "Business Type",
        submit: "Send Inquiry",
        placeholderName: "John Doe",
        placeholderPhone: "+60 12-345 6789",
        selectIndustry: "Select your industry"
      }
    }
  },
  zh: {
    nav: {
      services: "服务项目",
      whyUs: "为什么选择我们",
      pricing: "价格方案",
      contact: "联系我们",
      consultation: "获取免费咨询"
    },
    hero: {
      tag: "数码营销增长伙伴",
      title: "Cheaper Nexus 数码营销专家",
      subtitle: "为您提供从品牌建立、内容创作到流量变现的一站式数码营销支持。我们通过数据驱动的策略助您的业务在数码领域蓬勃发展。",
      viewServices: "查看服务"
    },
    services: {
      title: "我们的服务",
      subtitle: "量身定制的全方位数码解决方案，满足您的业务需求。",
      viewDetails: "查看详情与价格",
      items: [
        {
          title: "品牌视觉内容 (Content)",
          shortDesc: "专业短视频制作，打造高流量素材。",
          price: "RM288",
          unit: "/ 支",
          details: {
            includes: ["脚本策划", "专业拍摄", "后期剪辑"],
            value: "打造符合 TikTok/小红书算法的高流量素材，提升品牌吸引力。",
            note: "网红/KOL 出镜费另计。"
          }
        },
        {
          title: "全媒体账号管理 (Social Media)",
          shortDesc: "六大平台初始搭建及全案托管服务。",
          price: "RM388",
          unit: "起",
          details: {
            includes: ["六大平台初始搭建", "内容日常更新", "评论回复与私信对接"],
            value: "统一品牌视觉，确保客户在各大平台都能搜到专业形象，释放您的双手。",
            options: [
              { name: "六大平台初始搭建", price: "RM388", unit: "单次" },
              { name: "全案托管与回复", price: "RM1,188", unit: "/ 月" }
            ]
          }
        },
        {
          title: "Meta 广告精准投放",
          shortDesc: "社媒精准广告 (FB/IG)，专注品牌曝光或销售转化。",
          price: "RM1,888",
          unit: "/ 月",
          details: {
            includes: ["Meta 广告管理", "受众精准定位", "素材优化", "数据分析"],
            value: "在 Facebook 和 Instagram 精准触达潜在客户。可选择：曝光率提升（Awareness）或 销售转化提升（Conversion）。",
            note: "广告投放成本（Ad Spend）由客户直接支付给 Meta。"
          }
        },
        {
          title: "Google 搜索与全网营销",
          shortDesc: "让客户在搜索产品时第一时间找到您。",
          price: "RM1,888",
          unit: "/ 月",
          details: {
            includes: ["Google 关键词广告", "官网 SEO 优化", "竞品分析", "效果追踪"],
            value: "拦截高意向搜索流量。通过 SEO 获得长期自然增长，通过 Google Ads 获得即时曝光。",
            options: [
              { name: "Google 关键词广告", price: "RM1,888", unit: "/ 月" },
              { name: "官网 SEO 优化", price: "RM1,888", unit: "/ 月" }
            ]
          }
        },
        {
          title: "电商与网页解决方案",
          shortDesc: "三大电商平台入驻及企业官网定制。",
          price: "RM1,888",
          unit: "起",
          details: {
            includes: ["三大电商平台入驻 (Shopee/Lazada/TikTok)", "企业官网设计", "独立网店系统"],
            value: "建立专业的线上形象，为客户提供无缝的购物体验。",
            options: [
              { name: "三大电商平台入驻", price: "RM1,888", unit: "单次" },
              { name: "企业官网 + 独立网店", price: "定制", unit: "报价" }
            ]
          }
        }
      ]
    },
    modal: {
      includes: "包含内容",
      value: "核心价值",
      note: "备注",
      close: "关闭",
      cta: "立即咨询"
    },
    whyUs: {
      title: "为什么选择 Cheaper Nexus？",
      items: [
        {
          title: "全透明化",
          description: "每个选项都有明确的服务标准，绝无隐藏收费。",
          icon: <Shield className="w-6 h-6" />,
        },
        {
          title: "实战导向",
          description: "我们不仅做数据，更关注您的实际转化。",
          icon: <Zap className="w-6 h-6" />,
        },
        {
          title: "跨平台整合",
          description: "确保您的品牌在全网（SEO/Social/E-commerce）拥有一致的竞争力。",
          icon: <Globe className="w-6 h-6" />,
        },
      ]
    },
    pricing: {
      title: "价格摘要",
      subtitle: "优质数码服务的透明定价。",
      headers: ["服务项目", "价格", "计费方式"],
      note: "* 可根据业务需求定制方案。广告投放成本另计。"
    },
    contact: {
      title: "让我们助您的业务增长",
      subtitle: "准备好提升您的业务了吗？填写表格或直接通过 WhatsApp 联系我们。",
      form: {
        name: "姓名",
        phone: "电话号码",
        business: "业务类型",
        submit: "发送咨询",
        placeholderName: "张先生/女士",
        placeholderPhone: "+60 12-345 6789",
        selectIndustry: "选择您的行业"
      }
    }
  },
  ms: {
    nav: {
      services: "Perkhidmatan",
      whyUs: "Kenapa Kami",
      pricing: "Harga",
      contact: "Hubungi",
      consultation: "Konsultasi Percuma"
    },
    hero: {
      tag: "Rakan Pertumbuhan Digital",
      title: "Tingkatkan Bisnes dengan Cheaper Nexus",
      subtitle: "Rakan Pertumbuhan Digital All-in-One: Dari Penjenamaan ke Penukaran. Kami membantu perniagaan berkembang dalam landskap digital dengan strategi berasaskan data.",
      viewServices: "Lihat Perkhidmatan"
    },
    services: {
      title: "Perkhidmatan Kami",
      subtitle: "Penyelesaian digital komprehensif yang disesuaikan dengan keperluan perniagaan anda.",
      viewDetails: "Lihat Butiran & Harga",
      items: [
        {
          title: "Kandungan Visual Jenama",
          shortDesc: "Produksi Video Profesional untuk platform trafik tinggi.",
          price: "RM288",
          unit: "/ video",
          details: {
            includes: ["Perancangan Skrip", "Penggambaran Profesional", "Suntingan Pasca-produksi"],
            value: "Cipta bahan trafik tinggi yang dioptimumkan untuk algoritma TikTok/Red untuk menarik pelanggan.",
            note: "Yuran penampilan KOL/Influencer adalah berasingan."
          }
        },
        {
          title: "Pengurusan Media Sosial",
          shortDesc: "Persediaan akaun dan pengurusan bulanan penuh.",
          price: "RM388",
          unit: "Bermula",
          details: {
            includes: ["Persediaan Akaun (6 Platform)", "Kemas Kini Kandungan Harian", "Pengurusan Komen & Pertanyaan"],
            value: "Visual jenama yang seragam merentasi FB, IG, TikTok, Red, Lemon8, dan WA Business.",
            options: [
              { name: "Persediaan Akaun Awal", price: "RM388", unit: "sekali sahaja" },
              { name: "Pengurusan Penuh & Balasan", price: "RM1,188", unit: "/ bulan" }
            ]
          }
        },
        {
          title: "Iklan Ketepatan Meta",
          shortDesc: "Iklan sasaran di Meta (FB/IG) untuk pendedahan atau jualan.",
          price: "RM1,888",
          unit: "/ bulan",
          details: {
            includes: ["Pengurusan Iklan Meta", "Sasaran Audiens", "Pengoptimuman Kreatif", "Analisis Data"],
            value: "Jangkau pelanggan ideal anda di Facebook dan Instagram. Fokus pada kesedaran jenama atau jualan.",
            note: "Bajet iklan dibayar terus kepada Meta."
          }
        },
        {
          title: "Pemasaran Google & SEO",
          shortDesc: "Ditemui apabila pelanggan mencari produk anda.",
          price: "RM1,888",
          unit: "/ bulan",
          details: {
            includes: ["Iklan Kata Kunci Google", "Pengoptimuman SEO Laman Web", "Analisis Pesaing", "Penjejakan Prestasi"],
            value: "Tangkap trafik niat tinggi daripada enjin carian. Pertumbuhan organik jangka panjang dan pendedahan segera.",
            options: [
              { name: "Pengurusan Iklan Google", price: "RM1,888", unit: "/ bulan" },
              { name: "Pengoptimuman SEO", price: "RM1,888", unit: "/ bulan" }
            ]
          }
        },
        {
          title: "E-Dagang & Web",
          shortDesc: "Penyelesaian kedai dalam talian dan laman web korporat.",
          price: "RM1,888",
          unit: "Bermula",
          details: {
            includes: ["Kemasukan Platform (Shopee/Lazada/TikTok)", "Reka Bentuk Laman Web Korporat", "Integrasi E-dagang"],
            value: "Kehadiran dalam talian yang profesional dan pengalaman membeli-belah yang lancar.",
            options: [
              { name: "Persediaan Kedai 3-Platform", price: "RM1,888", unit: "sekali sahaja" },
              { name: "Penyelesaian Web Korporat", price: "Custom", unit: "sebut harga" }
            ]
          }
        }
      ]
    },
    modal: {
      includes: "Apa Yang Termasuk",
      value: "Nilai Teras",
      note: "Nota",
      close: "Tutup",
      cta: "Tanya Sekarang"
    },
    whyUs: {
      title: "Kenapa Pilih Cheaper Nexus?",
      items: [
        {
          title: "Ketelusan",
          description: "Standard perkhidmatan yang jelas untuk setiap pilihan. Tiada caj tersembunyi.",
          icon: <Shield className="w-6 h-6" />,
        },
        {
          title: "Berasaskan Keputusan",
          description: "Kami bukan sekadar melihat data; kami fokus pada penukaran sebenar anda.",
          icon: <Zap className="w-6 h-6" />,
        },
        {
          title: "Integrasi Pelbagai Platform",
          description: "Memastikan daya saing jenama yang konsisten merentasi SEO, Sosial, dan E-dagang.",
          icon: <Globe className="w-6 h-6" />,
        },
      ]
    },
    pricing: {
      title: "Ringkasan Harga",
      subtitle: "Harga telus untuk perkhidmatan digital premium.",
      headers: ["Perkhidmatan", "Harga", "Pengebilan"],
      note: "* Pakej tersuai tersedia. Kos iklan tidak termasuk dalam yuran pengurusan."
    },
    contact: {
      title: "Jom Tingkatkan Bisnes Anda",
      subtitle: "Bersedia untuk membawa perniagaan anda ke tahap seterusnya? Isi borang atau hubungi kami terus melalui WhatsApp.",
      form: {
        name: "Nama Penuh",
        phone: "Nombor Telefon",
        business: "Jenis Perniagaan",
        submit: "Hantar Pertanyaan",
        placeholderName: "John Doe",
        placeholderPhone: "+60 12-345 6789",
        selectIndustry: "Pilih industri anda"
      }
    }
  }
};

export default function App() {
  const [lang, setLang] = useState<Language>('zh');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    businessType: ''
  });

  const t = translations[lang];

  const services = t.services.items.map((item, index) => {
    const icons = [
      <Video className="w-8 h-8 text-brand-cyan" />,
      <Share2 className="w-8 h-8 text-brand-cyan" />,
      <TrendingUp className="w-8 h-8 text-brand-cyan" />,
      <Globe className="w-8 h-8 text-brand-cyan" />,
      <ShoppingBag className="w-8 h-8 text-brand-cyan" />
    ];
    return { ...item, icon: icons[index] };
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(lang === 'zh' ? `谢谢您 ${formData.name}! 我们会尽快联系您。` : `Thank you ${formData.name}! We will contact you soon.`);
    setFormData({ name: '', phone: '', businessType: '' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-white selection:bg-brand-cyan selection:text-brand-blue">
      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-brand-blue/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-brand-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-3xl font-bold text-brand-blue">{selectedService.title}</h3>
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="p-2 hover:bg-brand-blue/5 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-brand-blue" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-bold text-brand-cyan uppercase tracking-widest mb-4">{t.modal.includes}</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedService.details.includes.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-brand-blue/70">
                          <CheckCircle2 className="w-5 h-5 text-brand-cyan flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-brand-cyan uppercase tracking-widest mb-2">{t.modal.value}</h4>
                    <p className="text-brand-blue/70 leading-relaxed">{selectedService.details.value}</p>
                  </div>

                  {selectedService.details.options && (
                    <div>
                      <h4 className="text-sm font-bold text-brand-cyan uppercase tracking-widest mb-4">{t.pricing.title}</h4>
                      <div className="space-y-3">
                        {selectedService.details.options.map((opt, i) => (
                          <div key={i} className="flex justify-between items-center p-4 bg-brand-blue/5 rounded-2xl">
                            <span className="font-bold text-brand-blue">{opt.name}</span>
                            <div className="text-right">
                              <span className="text-brand-cyan font-bold">{opt.price}</span>
                              <span className="text-xs text-brand-blue/40 ml-1">{opt.unit}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedService.details.note && (
                    <p className="text-xs text-brand-blue/40 italic">
                      * {t.modal.note}: {selectedService.details.note}
                    </p>
                  )}

                  <div className="pt-4 flex gap-4">
                    <button 
                      onClick={() => {
                        setSelectedService(null);
                        scrollToSection('contact');
                      }}
                      className="flex-1 py-4 bg-brand-blue text-brand-white rounded-2xl font-bold hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20"
                    >
                      {t.modal.cta}
                    </button>
                    <button 
                      onClick={() => setSelectedService(null)}
                      className="px-8 py-4 border-2 border-brand-blue/10 text-brand-blue rounded-2xl font-bold hover:bg-brand-blue/5 transition-all"
                    >
                      {t.modal.close}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-white/80 backdrop-blur-md border-b border-brand-blue/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <div className="h-12 flex items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-brand-cyan/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative flex items-center gap-2 px-3 py-1.5 bg-brand-blue rounded-xl border border-brand-cyan/20">
                    <span className="text-brand-white font-bold text-xl tracking-tighter">Cheaper</span>
                    <div className="flex items-center">
                      <span className="text-brand-cyan font-black text-2xl drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]">NX</span>
                    </div>
                    <span className="text-brand-white font-bold text-xl tracking-tighter">Nexus</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('services')} className="text-sm font-medium hover:text-brand-cyan transition-colors">{t.nav.services}</button>
              <button onClick={() => scrollToSection('why-us')} className="text-sm font-medium hover:text-brand-cyan transition-colors">{t.nav.whyUs}</button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium hover:text-brand-cyan transition-colors">{t.nav.pricing}</button>
              
              {/* Language Switcher */}
              <div className="flex items-center gap-2 px-3 py-1 bg-brand-blue/5 rounded-full">
                <Languages className="w-4 h-4 text-brand-blue/40" />
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="bg-transparent text-xs font-bold text-brand-blue outline-none cursor-pointer"
                >
                  <option value="zh">中文</option>
                  <option value="en">EN</option>
                  <option value="ms">MS</option>
                </select>
              </div>

              <button 
                onClick={() => scrollToSection('contact')}
                className="px-6 py-2.5 bg-brand-blue text-brand-white rounded-full text-sm font-semibold hover:bg-brand-blue/90 transition-all hover:shadow-lg hover:shadow-brand-blue/20"
              >
                {t.nav.consultation}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
               <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="bg-brand-blue/5 px-2 py-1 rounded text-xs font-bold text-brand-blue outline-none"
                >
                  <option value="zh">中文</option>
                  <option value="en">EN</option>
                  <option value="ms">MS</option>
                </select>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-brand-blue">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-brand-white border-b border-brand-blue/5 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-4">
                <button onClick={() => scrollToSection('services')} className="block w-full text-left px-3 py-2 text-base font-medium">{t.nav.services}</button>
                <button onClick={() => scrollToSection('why-us')} className="block w-full text-left px-3 py-2 text-base font-medium">{t.nav.whyUs}</button>
                <button onClick={() => scrollToSection('pricing')} className="block w-full text-left px-3 py-2 text-base font-medium">{t.nav.pricing}</button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block w-full px-3 py-3 bg-brand-blue text-brand-white rounded-xl text-center font-semibold"
                >
                  {t.nav.consultation}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-cyan/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-brand-blue/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-brand-cyan/10 text-brand-cyan rounded-full">
              {t.hero.tag}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-brand-blue mb-8 leading-[1.1]">
              {t.hero.title}
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-brand-blue/70 mb-12 leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => scrollToSection('contact')}
                className="group w-full sm:w-auto px-8 py-4 bg-brand-blue text-brand-white rounded-full font-bold text-lg hover:bg-brand-blue/90 transition-all flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-brand-blue/20"
              >
                {t.nav.consultation}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="w-full sm:w-auto px-8 py-4 border-2 border-brand-blue/10 text-brand-blue rounded-full font-bold text-lg hover:bg-brand-blue/5 transition-all"
              >
                {t.hero.viewServices}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 bg-brand-blue/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">{t.services.title}</h2>
            <p className="text-brand-blue/60 max-w-xl mx-auto">{t.services.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-brand-white rounded-[32px] border border-brand-blue/5 hover:border-brand-cyan/30 transition-all hover:shadow-2xl hover:shadow-brand-blue/5 group flex flex-col h-full"
              >
                <div className="mb-6 p-3 bg-brand-cyan/5 rounded-2xl w-fit group-hover:bg-brand-cyan/10 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-blue mb-3">{service.title}</h3>
                <p className="text-brand-blue/60 text-sm mb-8 leading-relaxed flex-grow">
                  {service.shortDesc}
                </p>
                <div className="pt-6 border-t border-brand-blue/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-brand-blue/40 uppercase tracking-wider">{lang === 'zh' ? '起价' : 'Starting from'}</span>
                    <div className="flex items-baseline gap-1">
                      <div className="text-2xl font-bold text-brand-cyan">{service.price}</div>
                      <div className="text-xs text-brand-blue/40 font-medium">{service.unit}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedService(service)}
                    className="p-3 bg-brand-blue/5 text-brand-blue rounded-xl hover:bg-brand-blue hover:text-brand-white transition-all"
                    title={t.services.viewDetails}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-24 bg-brand-blue/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-blue mb-6">{t.whyUs.title}</h2>
            <div className="w-24 h-1.5 bg-brand-cyan mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.whyUs.items.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-10 bg-brand-white rounded-[40px] border border-brand-blue/5 hover:border-brand-cyan/30 transition-all hover:shadow-2xl hover:shadow-brand-blue/5 group overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-cyan/5 rounded-full blur-3xl group-hover:bg-brand-cyan/10 transition-colors"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-brand-blue text-brand-cyan rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-brand-blue/20">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-brand-blue mb-4">{item.title}</h3>
                  <p className="text-brand-blue/60 leading-relaxed text-lg">
                    {item.description}
                  </p>
                </div>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-brand-cyan group-hover:w-full transition-all duration-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section id="pricing" className="py-24 bg-brand-blue text-brand-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.pricing.title}</h2>
            <p className="text-brand-white/60">{t.pricing.subtitle}</p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-brand-white/10 bg-brand-white/5 backdrop-blur-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-white/10">
                  {t.pricing.headers.map((header, i) => (
                    <th key={i} className="px-8 py-6 text-sm font-bold uppercase tracking-wider text-brand-cyan">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-white/10">
                {t.services.items.map((row, index) => (
                  <tr key={index} className="hover:bg-brand-white/5 transition-colors">
                    <td className="px-8 py-6 font-medium">{row.title}</td>
                    <td className="px-8 py-6 font-bold text-brand-cyan">{row.price}</td>
                    <td className="px-8 py-6 text-brand-white/60">{row.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 text-center text-sm text-brand-white/40">
            {t.pricing.note}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-6">{t.contact.title}</h2>
              <p className="text-brand-blue/60 mb-12 text-lg">
                {t.contact.subtitle}
              </p>
              
              <div className="space-y-6">
                <div className="p-6 bg-brand-blue/5 rounded-2xl flex items-center justify-between group hover:bg-brand-blue/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-blue text-brand-cyan rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-brand-blue">Calvin</div>
                      <div className="text-sm text-brand-blue/60">{lang === 'zh' ? '数码策略师' : 'Digital Strategist'}</div>
                    </div>
                  </div>
                  <a 
                    href="https://wa.me/60182228688" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-sm hover:bg-green-600 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    018-222 8688
                  </a>
                </div>

                <div className="p-6 bg-brand-blue/5 rounded-2xl flex items-center justify-between group hover:bg-brand-blue/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-blue text-brand-cyan rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-brand-blue">Henry</div>
                      <div className="text-sm text-brand-blue/60">{lang === 'zh' ? '创意总监' : 'Creative Director'}</div>
                    </div>
                  </div>
                  <a 
                    href="https://wa.me/60172915754" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-sm hover:bg-green-600 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    017-291 5754
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-brand-white p-8 md:p-12 rounded-[40px] border border-brand-blue/5 shadow-2xl shadow-brand-blue/5">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-brand-blue mb-2">{t.contact.form.name}</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={t.contact.form.placeholderName}
                    className="w-full px-6 py-4 bg-brand-blue/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-cyan transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-blue mb-2">{t.contact.form.phone}</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder={t.contact.form.placeholderPhone}
                    className="w-full px-6 py-4 bg-brand-blue/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-cyan transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-blue mb-2">{t.contact.form.business}</label>
                  <select 
                    required
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                    className="w-full px-6 py-4 bg-brand-blue/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-cyan transition-all outline-none appearance-none"
                  >
                    <option value="">{t.contact.form.selectIndustry}</option>
                    <option value="retail">{lang === 'zh' ? '零售与电商' : 'Retail & E-Commerce'}</option>
                    <option value="f&b">{lang === 'zh' ? '餐饮业' : 'Food & Beverage'}</option>
                    <option value="services">{lang === 'zh' ? '专业服务' : 'Professional Services'}</option>
                    <option value="real-estate">{lang === 'zh' ? '房地产' : 'Real Estate'}</option>
                    <option value="other">{lang === 'zh' ? '其他' : 'Other'}</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 bg-brand-blue text-brand-white rounded-2xl font-bold text-lg hover:bg-brand-blue/90 transition-all hover:shadow-xl hover:shadow-brand-blue/20"
                >
                  {t.contact.form.submit}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-brand-blue/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-brand-blue rounded-lg border border-brand-cyan/20">
                <span className="text-brand-white font-bold text-sm tracking-tighter">Cheaper</span>
                <span className="text-brand-cyan font-black text-lg">NX</span>
                <span className="text-brand-white font-bold text-sm tracking-tighter">Nexus</span>
              </div>
            </div>
            <div className="text-brand-blue/40 text-sm font-medium">
              &copy; {new Date().getFullYear()} Cheaper Nexus. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-brand-blue/40 hover:text-brand-cyan transition-colors"><Share2 className="w-5 h-5" /></a>
              <a href="#" className="text-brand-blue/40 hover:text-brand-cyan transition-colors"><TrendingUp className="w-5 h-5" /></a>
              <a href="#" className="text-brand-blue/40 hover:text-brand-cyan transition-colors"><Globe className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
