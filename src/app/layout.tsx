import type {Metadata} from 'next';
import '@fontsource-variable/dm-sans/index.css';
import './globals.css';
import Shell from '@/components/Shell';
import {publisher,publisherValid} from '@/components/ads/adConfig';
import {origin,siteName} from '@/lib/seo/metadata';
export const metadata:Metadata={metadataBase:new URL(origin),title:{default:'DSA Visualizer, Games and Coding Interview Practice | '+siteName,template:'%s | '+siteName},description:'Learn data structures and algorithms with 388 visualized questions, coding interview practice, interactive DSA games and cheat sheets.',applicationName:siteName,other:publisherValid?{'google-adsense-account':publisher}:undefined,verification:process.env.GOOGLE_SITE_VERIFICATION?{google:process.env.GOOGLE_SITE_VERIFICATION}:undefined};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" data-theme="dark" suppressHydrationWarning><body><Shell>{children}</Shell></body></html>}

