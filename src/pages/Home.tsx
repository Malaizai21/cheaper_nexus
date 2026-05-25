/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
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

type PackageTier = {
  name: string;
  tagline: string;
  price: string;
  unit: string;
  highlight?: boolean;
  enterprise?: boolean;
  features: { category: string; value: string }[];
  cta: string;
};

type LanguageData = {
  nav: {
    services: string;
    whyUs: string;
    packages: string;
    pricing: string;
    blog: string;
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
  packages: {
    title: string;
    subtitle: string;
    enterprise: string;
    enterpriseDesc: string;
    enterpriseCta: string;
    tiers: PackageTier[];
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
      packages: "Packages",
      pricing: "Pricing",
      blog: "Blog",
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
          title: "UGC & KOC Video Content",
          shortDesc: "Authentic creator video matrix for TikTok & Instagram.",
          price: "RM 1,250",
          unit: "/ 5 videos",
          details: {
            includes: ["UGC / KOC Video Matrix", "TikTok / IG Influencer Unboxing", "Script & Creative Direction"],
            value: "Drive authentic engagement with real-creator content optimised for TikTok and Instagram algorithms.",
            options: [
              { name: "UGC / KOC Video Matrix", price: "RM 1,250", unit: "/ 5 videos" },
              { name: "TikTok / IG Influencer Unboxing Matrix", price: "RM 3,500", unit: "/ 10 videos" }
            ]
          }
        },
        {
          title: "Social Media Management",
          shortDesc: "Full-network visual framework and monthly growth packages.",
          price: "RM 1,000",
          unit: "Starting",
          details: {
            includes: ["Full-Network Visual Framework Setup", "Daily Content & Scheduling", "Community Management & Reply"],
            value: "Unified brand presence across all social platforms with a dedicated content calendar and engagement team.",
            options: [
              { name: "Full-Network Visual Framework (Basic Setup)", price: "RM 1,000", unit: "one-time" },
              { name: "Package A: Digital Infrastructure Plan", price: "RM 1,800", unit: "/ month" },
              { name: "Package B: Video Growth Engine", price: "RM 3,888", unit: "/ month" }
            ]
          }
        },
        {
          title: "XHS / Xiaohongshu Marketing",
          shortDesc: "Blue V verification, full account management & KOC seeding.",
          price: "RM 2,500",
          unit: "/ month",
          details: {
            includes: ["Enterprise Blue V Verification & Onboarding", "Official Account Full Management", "Organic KOC Seeding (Mass Placement)"],
            value: "Dominate China's leading discovery platform with certified brand presence and mass organic KOC seeding campaigns.",
            options: [
              { name: "Enterprise Blue V Verification & Ecosystem Onboarding", price: "RM 3,500", unit: "one-time" },
              { name: "Official Account Full Account Management", price: "RM 2,500", unit: "/ month" },
              { name: "Organic KOC Seeding (Mass Placement)", price: "RM 3,500", unit: "/ 10 posts" }
            ]
          }
        },
        {
          title: "Digital Ads & SEO",
          shortDesc: "Meta/Google ad placement, GEO & SEO optimization.",
          price: "RM 1,200",
          unit: "/ month",
          details: {
            includes: ["Meta & Google Ad Placement", "GEO & SEO Optimization", "High-Conversion Landing Page", "Performance Analytics"],
            value: "Precision ad targeting and long-term search engine dominance to capture high-intent customers at every stage.",
            note: "SEO requires minimum 6-month commitment. Ad spend paid directly to platform.",
            options: [
              { name: "Ad Placement: Starter Edition", price: "RM 1,200", unit: "/ month" },
              { name: "Ad Placement: Standard Edition", price: "RM 2,000", unit: "/ month" },
              { name: "GEO & SEO Optimization (Min. 6 Months)", price: "RM 2,500", unit: "/ month" },
              { name: "High-Conversion Landing Page", price: "From RM 1,000", unit: "/ page" }
            ]
          }
        },
        {
          title: "E-Commerce & Live Streaming",
          shortDesc: "Multi-platform shop setup, 360° management & live broadcasting.",
          price: "RM 1,888",
          unit: "Starting",
          details: {
            includes: ["Multi-Platform Setup & Store Decoration", "E-Commerce 360° Full Management", "Official Live Streaming / Broadcasting"],
            value: "End-to-end e-commerce solution from multi-platform shop setup to full-scale management and professional live streaming.",
            options: [
              { name: "Multi-Platform Setup & Basic Store Decoration", price: "RM 1,888", unit: "one-time" },
              { name: "E-Commerce 360° Full Management", price: "RM 5,000", unit: "/ month" },
              { name: "Official Live Streaming / Broadcasting Service", price: "RM 2,500", unit: "/ month" }
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
    packages: {
      title: "Choose Your Growth Package",
      subtitle: "Bundled solutions for every stage of your business.",
      enterprise: "Enterprise & Custom",
      enterpriseDesc: "Tailored for high-growth corporate entities and IPO-ready brands.",
      enterpriseCta: "Talk to Us",
      tiers: [
        {
          name: "Basic Starter",
          tagline: "Foundation Building",
          price: "RM 1,688",
          unit: "/ month",
          features: [
            { category: "Video Content", value: "1 Short Video" },
            { category: "Graphic Posts", value: "1 Creative Post" },
            { category: "Platforms", value: "Facebook & Instagram" },
            { category: "Ads Management", value: "Basic Ads Configuration" },
            { category: "Content & Copy", value: "Basic Artwork Editing" },
            { category: "Support", value: "WhatsApp Inquiry Button Setup" },
          ],
          cta: "Get Started"
        },
        {
          name: "Growth Booster",
          tagline: "Active Engagement",
          price: "RM 4,688",
          unit: "/ month",
          highlight: true,
          features: [
            { category: "Video Content", value: "4 Short Videos" },
            { category: "Graphic Posts", value: "8 Creative Posts" },
            { category: "Platforms", value: "FB / IG / TikTok" },
            { category: "Ads Management", value: "Ads Setting & Active Monitoring" },
            { category: "Content & Copy", value: "Content Planning, Caption Copywriting, Story Posting" },
            { category: "Strategy", value: "Monthly Campaign Planning" },
            { category: "Reports", value: "Monthly Performance Report" },
          ],
          cta: "Most Popular"
        },
        {
          name: "Ultimate",
          tagline: "Strategic Dominance",
          price: "RM 10,888",
          unit: "/ 3 months",
          features: [
            { category: "Video Content", value: "12 Professional Videos" },
            { category: "Graphic Posts", value: "10 Creative Posts" },
            { category: "Platforms", value: "FB / IG / TikTok / XHS (小红书)" },
            { category: "Ads Management", value: "Full Ads Strategy Setup & Funnels" },
            { category: "Content & Copy", value: "Content Planning, Campaign Ideas, Brand Positioning" },
            { category: "Strategy", value: "Sales Funnel Planning" },
            { category: "Support", value: "Marketing Discussions & Priority Support" },
          ],
          cta: "Go Ultimate"
        }
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
      packages: "套餐方案",
      pricing: "价格方案",
      blog: "营销博客",
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
          title: "UGC / KOC 视频矩阵",
          shortDesc: "达人真实测评视频，精准触达 TikTok 和 Instagram 受众。",
          price: "RM 1,250",
          unit: "/ 5 支",
          details: {
            includes: ["UGC / KOC 视频矩阵制作", "TikTok / IG 达人开箱视频", "脚本策划与创意指导"],
            value: "通过真实达人内容驱动高互动率，内容经过 TikTok 和 Instagram 算法深度优化。",
            options: [
              { name: "UGC / KOC 视频矩阵", price: "RM 1,250", unit: "/ 5 支" },
              { name: "TikTok / IG 达人开箱矩阵", price: "RM 3,500", unit: "/ 10 支" }
            ]
          }
        },
        {
          title: "全网社媒运营管理",
          shortDesc: "全平台视觉框架搭建及月度增长套餐。",
          price: "RM 1,000",
          unit: "起",
          details: {
            includes: ["全网视觉框架搭建", "内容日常更新与排期", "社群管理与私信回复"],
            value: "统一所有社交平台的品牌形象，配备专业内容日历，彻底释放您的运营压力。",
            options: [
              { name: "全网视觉框架搭建（基础版）", price: "RM 1,000", unit: "单次" },
              { name: "套餐 A：数字基础设施方案", price: "RM 1,800", unit: "/ 月" },
              { name: "套餐 B：视频增长引擎", price: "RM 3,888", unit: "/ 月" }
            ]
          }
        },
        {
          title: "小红书 XHS 企业营销",
          shortDesc: "蓝V认证入驻、官方账号全案托管及 KOC 批量种草。",
          price: "RM 2,500",
          unit: "/ 月",
          details: {
            includes: ["企业蓝V认证与生态入驻", "官方账号全案托管", "KOC 有机种草（批量铺量）"],
            value: "在小红书这一最强内容种草平台建立认证品牌阵地，通过 KOC 矩阵实现口碑裂变增长。",
            options: [
              { name: "企业蓝V认证 & 生态入驻", price: "RM 3,500", unit: "单次" },
              { name: "官方账号全案托管", price: "RM 2,500", unit: "/ 月" },
              { name: "KOC 有机种草（批量投放）", price: "RM 3,500", unit: "/ 10 帖" }
            ]
          }
        },
        {
          title: "数字广告与 SEO 优化",
          shortDesc: "Meta/Google 广告投放、GEO & SEO 搜索优化及高转化落地页。",
          price: "RM 1,200",
          unit: "/ 月",
          details: {
            includes: ["Meta & Google 广告投放", "GEO & SEO 搜索优化", "高转化落地页", "数据效果追踪"],
            value: "精准广告定向结合长期搜索霸屏，双轮驱动高意向客户主动找上门。",
            note: "SEO 最少 6 个月周期，广告投放费用由客户直接支付至平台。",
            options: [
              { name: "广告投放：入门版", price: "RM 1,200", unit: "/ 月" },
              { name: "广告投放：标准版", price: "RM 2,000", unit: "/ 月" },
              { name: "GEO & SEO 搜索优化", price: "RM 2,500", unit: "/ 月" },
              { name: "高转化落地页", price: "RM 1,000 起", unit: "/ 页" }
            ]
          }
        },
        {
          title: "电商全案与直播运营",
          shortDesc: "多平台入驻装修、360° 电商托管及官方直播带货服务。",
          price: "RM 1,888",
          unit: "起",
          details: {
            includes: ["多平台入驻与店铺装修", "电商 360° 全案托管", "官方直播 & 带货服务"],
            value: "从店铺搭建到全面电商托管和专业直播带货，一站式覆盖所有电商增长需求。",
            options: [
              { name: "多平台入驻 & 基础店铺装修", price: "RM 1,888", unit: "单次" },
              { name: "电商 360° 全案托管", price: "RM 5,000", unit: "/ 月" },
              { name: "官方直播 / 带货服务", price: "RM 2,500", unit: "/ 月" }
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
    packages: {
      title: "选择您的增长套餐",
      subtitle: "适合每个阶段业务的打包解决方案。",
      enterprise: "企业与定制方案",
      enterpriseDesc: "专为高速增长企业及准备 IPO 的品牌量身打造。",
      enterpriseCta: "联系洽谈",
      tiers: [
        {
          name: "基础入门",
          tagline: "打好基础",
          price: "RM 1,688",
          unit: "/ 月",
          features: [
            { category: "视频内容", value: "1 支短视频" },
            { category: "图文帖子", value: "1 篇创意帖" },
            { category: "覆盖平台", value: "Facebook & Instagram" },
            { category: "广告管理", value: "基础广告设置" },
            { category: "内容制作", value: "基础美工剪辑" },
            { category: "支持服务", value: "WhatsApp 咨询按钮设置" },
          ],
          cta: "立即开始"
        },
        {
          name: "增长引擎",
          tagline: "主动出击",
          price: "RM 4,688",
          unit: "/ 月",
          highlight: true,
          features: [
            { category: "视频内容", value: "4 支短视频" },
            { category: "图文帖子", value: "8 篇创意帖" },
            { category: "覆盖平台", value: "FB / IG / TikTok" },
            { category: "广告管理", value: "广告设置与持续监控" },
            { category: "内容制作", value: "内容策划、文案撰写、Story 发布" },
            { category: "营销策略", value: "月度推广计划" },
            { category: "数据报告", value: "月度效果报告" },
          ],
          cta: "最受欢迎"
        },
        {
          name: "终极品牌",
          tagline: "战略制霸",
          price: "RM 10,888",
          unit: "/ 3 个月",
          features: [
            { category: "视频内容", value: "12 支专业视频" },
            { category: "图文帖子", value: "10 篇创意帖" },
            { category: "覆盖平台", value: "FB / IG / TikTok / 小红书" },
            { category: "广告管理", value: "完整广告策略 & 销售漏斗" },
            { category: "内容制作", value: "内容策划、活动创意、品牌定位" },
            { category: "营销策略", value: "销售漏斗规划" },
            { category: "支持服务", value: "月度营销研讨 & 优先支持" },
          ],
          cta: "选择终极"
        }
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
      packages: "Pakej",
      pricing: "Harga",
      blog: "Blog",
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
          title: "Kandungan Video UGC & KOC",
          shortDesc: "Matriks video pencipta autentik untuk TikTok & Instagram.",
          price: "RM 1,250",
          unit: "/ 5 video",
          details: {
            includes: ["Matriks Video UGC / KOC", "Unboxing Influencer TikTok / IG", "Pengarahan Skrip & Kreatif"],
            value: "Picu penglibatan autentik dengan kandungan pencipta nyata yang dioptimumkan untuk algoritma TikTok dan Instagram.",
            options: [
              { name: "Matriks Video UGC / KOC", price: "RM 1,250", unit: "/ 5 video" },
              { name: "Matriks Unboxing Influencer TikTok / IG", price: "RM 3,500", unit: "/ 10 video" }
            ]
          }
        },
        {
          title: "Pengurusan Media Sosial",
          shortDesc: "Rangka kerja visual penuh dan pakej pertumbuhan bulanan.",
          price: "RM 1,000",
          unit: "Bermula",
          details: {
            includes: ["Persediaan Rangka Kerja Visual Penuh Rangkaian", "Kemas Kini Kandungan & Penjadualan Harian", "Pengurusan Komuniti & Balasan"],
            value: "Kehadiran jenama yang bersatu di semua platform sosial dengan kalendar kandungan berdedikasi dan pasukan penglibatan.",
            options: [
              { name: "Rangka Kerja Visual Penuh (Persediaan Asas)", price: "RM 1,000", unit: "sekali sahaja" },
              { name: "Pakej A: Pelan Infrastruktur Digital", price: "RM 1,800", unit: "/ bulan" },
              { name: "Pakej B: Enjin Pertumbuhan Video", price: "RM 3,888", unit: "/ bulan" }
            ]
          }
        },
        {
          title: "Pemasaran XHS / Xiaohongshu",
          shortDesc: "Pengesahan Blue V, pengurusan akaun penuh & penanaman KOC.",
          price: "RM 2,500",
          unit: "/ bulan",
          details: {
            includes: ["Pengesahan Blue V Perusahaan & Onboarding", "Pengurusan Akaun Rasmi Penuh", "Penanaman KOC Organik (Penempatan Besar)"],
            value: "Kuasai platform penemuan terkemuka China dengan kehadiran jenama yang disahkan dan kempen penanaman KOC organik berskala besar.",
            options: [
              { name: "Pengesahan Blue V Perusahaan & Onboarding", price: "RM 3,500", unit: "sekali sahaja" },
              { name: "Pengurusan Akaun Rasmi Penuh", price: "RM 2,500", unit: "/ bulan" },
              { name: "Penanaman KOC Organik (Penempatan Besar)", price: "RM 3,500", unit: "/ 10 siaran" }
            ]
          }
        },
        {
          title: "Iklan Digital & Pengoptimuman SEO",
          shortDesc: "Penempatan iklan Meta/Google, GEO & SEO, halaman pendaratan.",
          price: "RM 1,200",
          unit: "/ bulan",
          details: {
            includes: ["Penempatan Iklan Meta & Google", "Pengoptimuman GEO & SEO", "Halaman Pendaratan Penukaran Tinggi", "Analitik Prestasi"],
            value: "Sasaran iklan yang tepat dan dominasi carian jangka panjang untuk menarik pelanggan berniat tinggi di setiap peringkat.",
            note: "SEO memerlukan komitmen minimum 6 bulan. Belanja iklan dibayar terus ke platform.",
            options: [
              { name: "Penempatan Iklan: Edisi Pemula", price: "RM 1,200", unit: "/ bulan" },
              { name: "Penempatan Iklan: Edisi Standard", price: "RM 2,000", unit: "/ bulan" },
              { name: "Pengoptimuman GEO & SEO (Min. 6 Bulan)", price: "RM 2,500", unit: "/ bulan" },
              { name: "Halaman Pendaratan Penukaran Tinggi", price: "Dari RM 1,000", unit: "/ halaman" }
            ]
          }
        },
        {
          title: "E-Dagang & Penstriman Langsung",
          shortDesc: "Persediaan berbilang platform, pengurusan 360° & siaran langsung.",
          price: "RM 1,888",
          unit: "Bermula",
          details: {
            includes: ["Persediaan Berbilang Platform & Hiasan Kedai", "Pengurusan Penuh E-Dagang 360°", "Perkhidmatan Penstriman Langsung Rasmi"],
            value: "Penyelesaian e-dagang menyeluruh dari persediaan kedai hingga pengurusan berskala penuh dan penstriman langsung profesional.",
            options: [
              { name: "Persediaan Berbilang Platform & Hiasan Asas", price: "RM 1,888", unit: "sekali sahaja" },
              { name: "Pengurusan Penuh E-Dagang 360°", price: "RM 5,000", unit: "/ bulan" },
              { name: "Penstriman Langsung / Siaran Rasmi", price: "RM 2,500", unit: "/ bulan" }
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
    packages: {
      title: "Pilih Pakej Pertumbuhan Anda",
      subtitle: "Penyelesaian paket untuk setiap peringkat perniagaan anda.",
      enterprise: "Perusahaan & Tersuai",
      enterpriseDesc: "Disesuaikan untuk entiti korporat berprestasi tinggi dan jenama yang bersedia IPO.",
      enterpriseCta: "Hubungi Kami",
      tiers: [
        {
          name: "Basic Starter",
          tagline: "Membina Asas",
          price: "RM 1,688",
          unit: "/ bulan",
          features: [
            { category: "Kandungan Video", value: "1 Video Pendek" },
            { category: "Siaran Grafik", value: "1 Siaran Kreatif" },
            { category: "Platform", value: "Facebook & Instagram" },
            { category: "Pengurusan Iklan", value: "Konfigurasi Iklan Asas" },
            { category: "Kandungan", value: "Pengeditan Artwork Asas" },
            { category: "Sokongan", value: "Persediaan Butang WhatsApp" },
          ],
          cta: "Mulakan Sekarang"
        },
        {
          name: "Growth Booster",
          tagline: "Penglibatan Aktif",
          price: "RM 4,688",
          unit: "/ bulan",
          highlight: true,
          features: [
            { category: "Kandungan Video", value: "4 Video Pendek" },
            { category: "Siaran Grafik", value: "8 Siaran Kreatif" },
            { category: "Platform", value: "FB / IG / TikTok" },
            { category: "Pengurusan Iklan", value: "Tetapan Iklan & Pemantauan Aktif" },
            { category: "Kandungan", value: "Perancangan Kandungan, Penulisan Kapsyen, Story" },
            { category: "Strategi", value: "Perancangan Kempen Bulanan" },
            { category: "Laporan", value: "Laporan Prestasi Bulanan" },
          ],
          cta: "Paling Popular"
        },
        {
          name: "Ultimate",
          tagline: "Dominasi Strategik",
          price: "RM 10,888",
          unit: "/ 3 bulan",
          features: [
            { category: "Kandungan Video", value: "12 Video Profesional" },
            { category: "Siaran Grafik", value: "10 Siaran Kreatif" },
            { category: "Platform", value: "FB / IG / TikTok / XHS (小红书)" },
            { category: "Pengurusan Iklan", value: "Strategi Iklan Penuh & Corong" },
            { category: "Kandungan", value: "Perancangan, Idea Kempen, Kedudukan Jenama" },
            { category: "Strategi", value: "Perancangan Sales Funnel" },
            { category: "Sokongan", value: "Perbincangan Pemasaran & Sokongan Keutamaan" },
          ],
          cta: "Pilih Ultimate"
        }
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

type BlogPreviewItem = { id: number; slug: string; language: string; title: string; meta_description: string; topic: string; word_count: number; created_at: string };

function BlogPreview({ lang }: { lang: Language }) {
  const [posts, setPosts] = useState<BlogPreviewItem[]>([]);

  useEffect(() => {
    fetch('/blog/articles.json')
      .then(r => r.json())
      .then((data: BlogPreviewItem[]) => setPosts(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  const title = { zh: '营销知识库', en: 'Marketing Insights', ms: 'Panduan Pemasaran' }[lang];
  const subtitle = { zh: '最新数码营销干货，助您的业务在马来西亚市场脱颖而出。', en: 'Fresh digital marketing tips to help your business stand out in Malaysia.', ms: 'Tip pemasaran digital terkini untuk membantu perniagaan anda.' }[lang];
  const readMore = { zh: '阅读全文', en: 'Read More', ms: 'Baca Lagi' }[lang];
  const viewAll = { zh: '查看全部文章 →', en: 'View All Articles →', ms: 'Lihat Semua →' }[lang];

  return (
    <section className="py-24 bg-brand-blue/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-3">{title}</h2>
            <p className="text-brand-blue/60 max-w-xl">{subtitle}</p>
          </div>
          <Link to="/blog" className="hidden sm:flex items-center gap-1 text-sm font-bold text-brand-cyan hover:text-brand-blue transition-colors whitespace-nowrap">
            {viewAll}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group flex flex-col h-full p-7 bg-brand-white rounded-[28px] border border-brand-blue/5 hover:border-brand-cyan/30 hover:shadow-2xl hover:shadow-brand-blue/5 transition-all"
              >
                <span className={`self-start mb-4 px-2.5 py-0.5 rounded-full text-xs font-bold ${post.language === 'zh' ? 'bg-red-100 text-red-700' : post.language === 'ms' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {post.language === 'zh' ? '中文' : post.language === 'ms' ? 'BM' : 'EN'}
                </span>
                <h3 className="text-base font-bold text-brand-blue mb-3 leading-snug line-clamp-2 group-hover:text-brand-cyan transition-colors flex-grow">
                  {post.title}
                </h3>
                <p className="text-sm text-brand-blue/50 line-clamp-2 mb-5">{post.meta_description}</p>
                <span className="text-xs font-bold text-brand-cyan flex items-center gap-1 group-hover:gap-2 transition-all">
                  {readMore} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/blog" className="text-sm font-bold text-brand-cyan">{viewAll}</Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
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
      <SEO lang={lang} />
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
              <img src="/logo.png" alt="Cheaper Nexus" className="h-12 w-auto object-contain" />
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('services')} className="text-sm font-medium hover:text-brand-cyan transition-colors">{t.nav.services}</button>
              <button onClick={() => scrollToSection('why-us')} className="text-sm font-medium hover:text-brand-cyan transition-colors">{t.nav.whyUs}</button>
              <button onClick={() => scrollToSection('packages')} className="text-sm font-medium hover:text-brand-cyan transition-colors">{t.nav.packages}</button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium hover:text-brand-cyan transition-colors">{t.nav.pricing}</button>
              <Link to="/blog" className="text-sm font-medium hover:text-brand-cyan transition-colors">{t.nav.blog}</Link>
              
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
                <button onClick={() => scrollToSection('packages')} className="block w-full text-left px-3 py-2 text-base font-medium">{t.nav.packages}</button>
                <button onClick={() => scrollToSection('pricing')} className="block w-full text-left px-3 py-2 text-base font-medium">{t.nav.pricing}</button>
                <Link to="/blog" className="block w-full text-left px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.blog}</Link>
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

      {/* Package Comparison */}
      <section id="packages" className="py-24 bg-brand-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-blue mb-4">{t.packages.title}</h2>
            <p className="text-brand-blue/60 max-w-xl mx-auto">{t.packages.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {t.packages.tiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-[32px] border flex flex-col overflow-hidden ${
                  tier.highlight
                    ? 'bg-brand-blue text-brand-white border-brand-cyan/30 shadow-2xl shadow-brand-blue/30 scale-105'
                    : 'bg-brand-white text-brand-blue border-brand-blue/10 shadow-lg hover:shadow-xl hover:border-brand-cyan/20 transition-all'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-brand-cyan" />
                )}
                <div className="p-8">
                  <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${tier.highlight ? 'text-brand-cyan' : 'text-brand-blue/40'}`}>
                    {tier.tagline}
                  </div>
                  <h3 className={`text-2xl font-bold mb-1 ${tier.highlight ? 'text-brand-white' : 'text-brand-blue'}`}>{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mt-4 mb-8">
                    <span className={`text-3xl font-bold ${tier.highlight ? 'text-brand-cyan' : 'text-brand-blue'}`}>{tier.price}</span>
                    <span className={`text-sm ${tier.highlight ? 'text-brand-white/60' : 'text-brand-blue/40'}`}>{tier.unit}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlight ? 'text-brand-cyan' : 'text-brand-cyan'}`} />
                        <div>
                          <span className={`text-xs font-semibold block ${tier.highlight ? 'text-brand-white/50' : 'text-brand-blue/40'}`}>{f.category}</span>
                          <span className={`text-sm ${tier.highlight ? 'text-brand-white/90' : 'text-brand-blue/80'}`}>{f.value}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-8 pb-8 mt-auto">
                  <button
                    onClick={() => scrollToSection('contact')}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${
                      tier.highlight
                        ? 'bg-brand-cyan text-brand-blue hover:bg-brand-cyan/90'
                        : 'bg-brand-blue/5 text-brand-blue hover:bg-brand-blue hover:text-brand-white'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enterprise Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[32px] bg-brand-blue p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.15),transparent_60%)]" />
            <div className="relative text-center md:text-left">
              <div className="text-xs font-bold uppercase tracking-widest text-brand-cyan mb-2">Premium Solution</div>
              <h3 className="text-2xl md:text-3xl font-bold text-brand-white mb-2">{t.packages.enterprise}</h3>
              <p className="text-brand-white/60 max-w-xl">{t.packages.enterpriseDesc}</p>
              <div className="mt-3 text-brand-cyan font-bold text-2xl">RM 15,000+</div>
            </div>
            <div className="relative flex-shrink-0">
              <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 bg-brand-cyan text-brand-blue rounded-2xl font-bold hover:bg-brand-cyan/90 transition-all whitespace-nowrap"
              >
                {t.packages.enterpriseCta}
              </button>
            </div>
          </motion.div>
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
                    href="https://wa.me/60134391541"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-sm hover:bg-green-600 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    013-439 1541
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

      {/* Blog Preview */}
      <BlogPreview lang={lang} />

      {/* Footer */}
      <footer className="py-12 border-t border-brand-blue/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Cheaper Nexus" className="h-10 w-auto object-contain" />
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
