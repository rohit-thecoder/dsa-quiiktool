export const publisher=(process.env.NEXT_PUBLIC_ADSENSE_PUB_ID||'').trim();
export const adsEnabled=process.env.NEXT_PUBLIC_ADS_ENABLED==='true' && /^ca-pub-\d{16}$/.test(publisher);
export const slots={banner:process.env.NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT,content:process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT,sidebar:process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT};
export type Placement=keyof typeof slots;
