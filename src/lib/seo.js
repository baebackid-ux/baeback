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
