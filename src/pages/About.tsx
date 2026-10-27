import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer, LEGAL_NAME, SSM_NUMBER } from '../components/Footer';
import { useLanguage, type Language } from '../hooks/useLanguage';
import { type Work } from '../components/works/worksData';
import { motion } from 'motion/react';
import { fadeUp, stagger, CountUp } from '../components/Motion';

const SITE_URL = 'https://cheapernexus.com';
const WHATSAPP = 'https://wa.me/60172915754';

/**
 * About page.
 *
 * A GEO audit flagged its absence, and the gap is real: an answer engine
 * deciding whether a small agency is a legitimate entity looks for a page that
 * names the company, its registration and the person behind it. Every number
 * here is either the registered record or counted live from works.json, so the
 * page cannot drift out of date the way hand-written claims do.
 */

type Copy = {
  tag: string;
  title: string;
  lede: string;
  sections: { h: string; p: string[] }[];
  statsLabels: { clients: string; videos: string; designs: string };
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  seeWork: string;
  metaTitle: string;
  metaDesc: string;
};

const T: Record<Language, Copy> = {
  zh: {
    tag: '关于我们',
    title: '我们是谁',
    lede: 'Cheaper Nexus 是一家注册在马来西亚的数码营销公司，总部在吉隆坡，专门服务本地中小企业。',
    sections: [
      {
        h: '我们做什么',
        p: [
          '我们做短视频制作、平面设计、社媒代运营与 Meta 广告投放。脚本、拍摄、剪接、设计、日常运营到广告，全部由同一个团队完成——这样讯息才不会在不同平台上散掉。',
          '内容用中文、英文和马来文制作，按你的客群决定。有几个客户同时跑两个语言版本。',
        ],
      },
      {
        h: '为什么价格都公开',
        p: [
          '马来西亚大部分代理商不公开价格，要你先留资料、先开会、再等报价。我们把整份价目表直接放在网站上，和作品放在同一页。',
          '这样做的理由很实际：预算不合适的客户不用浪费双方时间，合适的客户看完就能直接 WhatsApp 找我们，不用绕一圈。',
        ],
      },
      {
        h: '你会直接找到人',
        p: [
          '所有咨询都是 Henry 本人在 WhatsApp 上回。没有客服队列，没有层层转手的客户经理。每一次合作都从一通免费 30 分钟的对话开始——聊完如果我们不适合，会直接告诉你。',
        ],
      },
    ],
    statsLabels: { clients: '客户品牌', videos: '支短视频', designs: '张设计' },
    ctaTitle: '先聊聊？',
    ctaBody: '免费 30 分钟策略咨询，不合适也会直说。',
    ctaButton: 'WhatsApp Henry',
    seeWork: '看作品与价格',
    metaTitle: '关于 Cheaper Nexus | 马来西亚数码营销公司',
    metaDesc:
      'Cheaper Nexus Sdn Bhd 是注册在马来西亚、总部位于吉隆坡的数码营销公司，为本地中小企业提供短视频、设计、社媒代运营与 Meta 广告投放。价格全公开，作品可查。',
  },
  en: {
    tag: 'About us',
    title: 'Who we are',
    lede: 'Cheaper Nexus is a registered Malaysian digital marketing company, based in Kuala Lumpur, working with SMEs across the country.',
    sections: [
      {
        h: 'What we do',
        p: [
          'We produce short-form video, graphic design, day-to-day social media management and Meta advertising. Script, filming, editing, design, page management and ads are all handled by one team, which is what keeps the message consistent across platforms.',
          'Content is produced in Chinese, English or Bahasa Malaysia depending on who you are selling to. Several clients run two language versions of the same campaign.',
        ],
      },
      {
        h: 'Why our prices are public',
        p: [
          'Most agencies in Malaysia keep pricing behind a form, a discovery call and a wait. Our full price list sits on the site, on the same page as the work.',
          'The reason is practical. Businesses whose budget does not fit stop reading, and nobody wastes an afternoon finding that out. Businesses whose budget does fit can message us directly without going through a sales loop first.',
        ],
      },
      {
        h: 'You talk to a person',
        p: [
          'Every enquiry is answered by Henry on WhatsApp. No support queue, no account manager relaying messages. Work starts with a free 30-minute conversation, and if we are not the right fit we will say so during it.',
        ],
      },
    ],
    statsLabels: { clients: 'client brands', videos: 'short videos', designs: 'designs' },
    ctaTitle: 'Want to talk it through?',
    ctaBody: 'A free 30-minute strategy conversation, with a straight answer if we are not a fit.',
    ctaButton: 'WhatsApp Henry',
    seeWork: 'See the work and prices',
    metaTitle: 'About Cheaper Nexus | Digital Marketing Company in Malaysia',
    metaDesc:
      'Cheaper Nexus Sdn Bhd is a registered Malaysian digital marketing company based in Kuala Lumpur, producing short-form video, design, social media management and Meta ads for SMEs. Prices and portfolio are public.',
  },
  ms: {
    tag: 'Tentang kami',
    title: 'Siapa kami',
    lede: 'Cheaper Nexus ialah syarikat pemasaran digital Malaysia yang berdaftar, berpangkalan di Kuala Lumpur, bekerja dengan PKS di seluruh negara.',
    sections: [
      {
        h: 'Apa yang kami buat',
        p: [
          'Kami hasilkan video pendek, reka bentuk grafik, pengurusan media sosial harian dan iklan Meta. Skrip, penggambaran, penyuntingan, reka bentuk, pengurusan halaman dan iklan semuanya diuruskan oleh satu pasukan — itulah yang memastikan mesej kekal selaras merentasi platform.',
          'Kandungan dihasilkan dalam bahasa Cina, Inggeris atau Melayu bergantung kepada sasaran anda.',
        ],
      },
      {
        h: 'Kenapa harga kami terbuka',
        p: [
          'Kebanyakan agensi di Malaysia menyembunyikan harga di sebalik borang dan panggilan. Senarai harga penuh kami ada di laman ini, pada halaman yang sama dengan hasil kerja.',
          'Sebabnya praktikal: perniagaan yang bajetnya tidak sepadan tidak perlu buang masa, dan yang sepadan boleh terus WhatsApp kami.',
        ],
      },
      {
        h: 'Anda berurusan dengan orang sebenar',
        p: [
          'Setiap pertanyaan dijawab oleh Henry melalui WhatsApp. Tiada barisan sokongan, tiada pengurus akaun yang menyampaikan mesej. Kerja bermula dengan perbincangan percuma 30 minit, dan kalau kami bukan pilihan yang tepat, kami akan katakan terus.',
        ],
      },
    ],
    statsLabels: { clients: 'jenama klien', videos: 'video pendek', designs: 'reka bentuk' },
    ctaTitle: 'Nak berbincang dahulu?',
    ctaBody: 'Perbincangan strategi percuma 30 minit, dengan jawapan jujur kalau kami bukan pilihan yang sesuai.',
    ctaButton: 'WhatsApp Henry',
    seeWork: 'Lihat kerja dan harga',
    metaTitle: 'Tentang Cheaper Nexus | Syarikat Pemasaran Digital Malaysia',
    metaDesc:
      'Cheaper Nexus Sdn Bhd ialah syarikat pemasaran digital Malaysia berdaftar di Kuala Lumpur, menghasilkan video pendek, reka bentuk, pengurusan media sosial dan iklan Meta untuk PKS. Harga dan portfolio terbuka.',
  },
};

export default function About() {
  const [lang, setLang] = useLanguage();
  const [works, setWorks] = useState<Work[]>([]);
  const t = T[lang];

  // Counted from the portfolio rather than written down, so the page cannot
  // claim a number the site no longer backs up.
  useEffect(() => {
    fetch('/works/works.json')
      .then(r => r.json())
      .then(setWorks)
      .catch(() => {});
  }, []);

  const videos = works.reduce((n, w) => n + w.media.filter(m => m.type === 'video').length, 0);
  const designs = works.reduce((n, w) => n + w.media.filter(m => m.type === 'image').length, 0);
  const canonical = `${SITE_URL}/about`;

  return (
    <>
      <Helmet>
        <html lang={lang === 'zh' ? 'zh-MY' : lang === 'ms' ? 'ms-MY' : 'en-MY'} />
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t.metaTitle} />
        <meta property="og:description" content={t.metaDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="Cheaper Nexus" />
        <link rel="alternate" hrefLang="zh-MY" href={canonical} />
        <link rel="alternate" hrefLang="en-MY" href={canonical} />
        <link rel="alternate" hrefLang="ms-MY" href={canonical} />
        <link rel="alternate" hrefLang="x-default" href={canonical} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: t.metaTitle,
            description: t.metaDesc,
            url: canonical,
            mainEntity: {
              '@type': 'Organization',
              name: 'Cheaper Nexus',
              legalName: LEGAL_NAME,
              url: SITE_URL,
              identifier: {
                '@type': 'PropertyValue',
                name: 'SSM Company Registration No.',
                value: SSM_NUMBER,
              },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Kuala Lumpur',
                addressCountry: 'MY',
              },
            },
          })}
        </script>
      </Helmet>

      <Navbar lang={lang} setLang={setLang} />

      <div className="min-h-screen bg-brand-blue text-white">
        <header className="px-4 sm:px-8 lg:px-12 pt-28 pb-14 max-w-4xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-cyan mb-5">{t.tag}</p>
          <h1 className="font-black tracking-[-0.03em] text-[clamp(2.2rem,6vw,4rem)] leading-[1.1]">{t.title}</h1>
          <p className="mt-6 text-white/60 text-lg leading-relaxed">{t.lede}</p>
          <p className="mt-4 text-white/40 text-sm">
            {LEGAL_NAME} · {SSM_NUMBER}
          </p>
        </header>

        {works.length > 0 && (
          <div className="border-y border-white/10">
            <motion.div className="px-4 sm:px-8 lg:px-12 py-6 max-w-4xl mx-auto flex flex-wrap gap-x-10 gap-y-3" {...fadeUp}>
              {[
                [works.length, t.statsLabels.clients],
                [videos, t.statsLabels.videos],
                [designs, t.statsLabels.designs],
              ].map(([n, label]) => (
                <span key={String(label)} className="flex items-baseline gap-2">
                  <CountUp value={String(n)} className="text-2xl font-black text-brand-cyan tabular-nums" />
                  <span className="text-sm text-white/55">{label}</span>
                </span>
              ))}
            </motion.div>
          </div>
        )}

        <main className="px-4 sm:px-8 lg:px-12 py-16 max-w-4xl mx-auto space-y-12">
          {t.sections.map(s => (
            <section key={s.h}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">{s.h}</h2>
              <div className="space-y-4">
                {s.p.map((p, i) => (
                  <p key={i} className="text-white/60 leading-relaxed">{p}</p>
                ))}
              </div>
            </section>
          ))}
        </main>

        <section className="bg-brand-cyan text-brand-blue">
          <div className="px-4 sm:px-8 lg:px-12 py-16 text-center">
            <h2 className="font-black text-[clamp(1.7rem,5vw,3rem)] leading-tight">{t.ctaTitle}</h2>
            <p className="mt-4 text-brand-blue/85 font-medium">{t.ctaBody}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-blue text-white rounded-full font-bold hover:bg-brand-blue/90 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {t.ctaButton}
              </a>
              <Link
                to="/works"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-brand-blue/25 rounded-full font-bold hover:bg-brand-blue/10 transition-colors"
              >
                {t.seeWork} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer lang={lang} variant="dark" />
    </>
  );
}
