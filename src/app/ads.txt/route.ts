import {publisher,adsEnabled} from '@/components/ads/adConfig';
export const dynamic='force-static';
export function GET(){return new Response(adsEnabled?'google.com, '+publisher.replace(/^ca-/,'')+', DIRECT, f08c47fec0942fa0\n':'# Advertising is disabled.\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});}
