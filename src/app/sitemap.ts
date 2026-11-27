import type {MetadataRoute} from 'next';
import {origin} from '@/lib/seo/metadata';
import {indexableEntries} from '@/lib/catalog';
export default function sitemap():MetadataRoute.Sitemap{return ['',...new Set(indexableEntries.map(e=>e.href))].map(path=>({url:new URL(path||'/',origin).href}));}
