import {origin} from '@/lib/seo/metadata';
import {publicEntries} from '@/lib/catalog';
export default function sitemap(){return ['',...publicEntries.map(e=>e.href)].map(path=>({url:origin+path}));}
