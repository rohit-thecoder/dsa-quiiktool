import type {MetadataRoute} from 'next';
import {origin} from '@/lib/seo/metadata';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:['/search-index.json']},sitemap:origin+'/sitemap.xml'};}
