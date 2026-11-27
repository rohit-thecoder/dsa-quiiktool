import Script from 'next/script';
import {canShow,publisher,type Placement} from './adConfig';
export default function AdProvider({placements}:{placements:Placement[]}){return placements.some(canShow)?<Script id="adsense" async strategy="lazyOnload" crossOrigin="anonymous" src={'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+publisher}/>:null;}
