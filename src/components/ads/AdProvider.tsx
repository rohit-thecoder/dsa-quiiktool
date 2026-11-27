import Script from 'next/script';
import {adsEnabled,publisher} from './adConfig';
export default function AdProvider(){return adsEnabled?<Script id="adsense" async strategy="afterInteractive" crossOrigin="anonymous" src={'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+publisher}/>:null;}
