import {origin} from '@/lib/seo/metadata';
export default function robots(){return {rules:{userAgent:'*',allow:'/',disallow:['/progress','/revision','/settings','/search-index.json']},sitemap:origin+'/sitemap.xml'};}
