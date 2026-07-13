export const SITE_NAME = 'BaeBack';
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://baeback.app';
export const DEFAULT_DESCRIPTION =
  'BaeBack adalah marketplace charity untuk berbagi barang layak pakai secara gratis, mengajukan kebutuhan, dan mendukung campaign kebaikan.';
export const DEFAULT_OG_IMAGE = '/og-default.svg';

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description: DEFAULT_DESCRIPTION,
    email: 'halo@baeback.id',
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'id-ID',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/barang?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildProductJsonLd(item) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.title,
    description: item.description,
    image: item.image_url,
    category: item.category,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
      availability: item.status === 'available'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/barang/${item.id}`,
    },
  };
}

export function buildCampaignJsonLd(campaign) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DonateAction',
    name: campaign.title,
    description: campaign.description,
    image: campaign.image_url,
    url: `${SITE_URL}/campaign/${campaign.slug}`,
    recipient: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };
}

export function buildNeedJsonLd(need) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: need.title,
    description: need.description,
    url: `${SITE_URL}/need-board/${need.id}`,
    inLanguage: 'id-ID',
  };
}

export function buildBlogPostJsonLd(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    url: `${SITE_URL}/blog/${post.slug}`,
    inLanguage: 'id-ID',
  };
}

export function buildBlogListJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Blog & Inspirasi | ${SITE_NAME}`,
    description: 'Kumpulan cerita inspiratif, tips, dan panduan lengkap tentang donasi barang layak pakai di BaeBack.',
    url: `${SITE_URL}/blog`,
    inLanguage: 'id-ID',
  };
}

export function buildFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Apa itu BaeBack?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'BaeBack adalah platform charity marketplace berbasis web yang memungkinkan masyarakat Indonesia untuk saling berbagi barang layak pakai secara gratis (Rp 0).'
        }
      },
      {
        '@type': 'Question',
        'name': 'Bagaimana cara donasi barang di BaeBack?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Anda cukup membuat akun, masuk ke dashboard, klik "Donasikan", unggah foto barang layak pakai, isi deskripsi, dan pilih metode pengambilan (diambil ke rumah atau dikirim kurir).'
        }
      },
      {
        '@type': 'Question',
        'name': 'Apakah barang di BaeBack benar-benar gratis?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Ya, semua barang yang terdaftar di BaeBack berharga Rp 0. Tidak diperbolehkan ada transaksi komersial atau jual-beli di dalam platform.'
        }
      }
    ]
  };
}
