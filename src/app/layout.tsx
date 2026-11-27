import type {Metadata} from 'next';
import '@fontsource-variable/dm-sans/index.css';
import './globals.css';
import Shell from '@/components/Shell';
import {origin} from '@/lib/seo/metadata';
export const metadata:Metadata={metadataBase:new URL(origin),title:{default:'QuiikTool DSA',template:'%s · QuiikTool DSA'},description:'Learn DSA visually with step-by-step algorithm traces and educational games.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" data-theme="dark" suppressHydrationWarning><body><Shell>{children}</Shell></body></html>}

