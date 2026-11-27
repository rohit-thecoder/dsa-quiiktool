export const publisher=(process.env.NEXT_PUBLIC_ADSENSE_PUB_ID||'').trim();
export const publisherValid=/^ca-pub-\d{16}$/.test(publisher);
export const slots={banner:(process.env.NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT||'').trim(),content:(process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT||'').trim(),sidebar:(process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT||'').trim(),feed:(process.env.NEXT_PUBLIC_ADSENSE_FEED_SLOT||'').trim()};
export type Placement=keyof typeof slots;
export const adsEnabled=process.env.NODE_ENV==='production' && process.env.NEXT_PUBLIC_ADS_ENABLED==='true' && process.env.NEXT_PUBLIC_ADSENSE_CONSENT_READY==='true' && publisherValid && Object.values(slots).some(isSlot);
export function isSlot(value:string){return /^\d+$/.test(value)}
export const canShow=(placement:Placement)=>adsEnabled&&isSlot(slots[placement]);
export const adsTxt=()=>publisherValid?'google.com, '+publisher.replace(/^ca-/,'')+', DIRECT, f08c47fec0942fa0\n':'# No advertising seller configured.\n';
export function adPlan(section:string,detail:boolean):Placement[]{
 if(section==='home'&&!detail)return ['banner','feed'];
 if(detail&&['topics','patterns'].includes(section))return ['sidebar','content'];
 if(detail&&section==='cheat-sheets')return ['sidebar','feed'];
 if(!detail&&['visualizers','games','learn','topics','patterns','problems','cheat-sheets'].includes(section))return ['feed'];
 if(!detail&&['interview-prep','college-prep'].includes(section))return ['content'];
 return [];
}
