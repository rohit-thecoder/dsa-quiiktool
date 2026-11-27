import type {Metadata} from 'next';
const configured=(process.env.NEXT_PUBLIC_SITE_URL||'https://dsa.quiiktool.com').trim();
function siteOrigin(value:string){try{const url=new URL(value);if(!['https:','http:'].includes(url.protocol)||url.username||url.password)throw Error();return url.origin}catch{return 'https://dsa.quiiktool.com'}}
export const origin=siteOrigin(configured);
export const siteName='QuiikTool DSA';
export function metadata(title:string,description:string,path:string,index=true):Metadata{
 const url=new URL(path,origin).href;
 return {title,description,alternates:{canonical:url},robots:{index,follow:true,googleBot:{index,follow:true,'max-image-preview':'large','max-snippet':-1}},openGraph:{title,description,url,siteName,type:'website',locale:'en_US',images:[{url:origin+'/opengraph-image',width:1200,height:630,alt:'QuiikTool DSA interactive learning lab'}]},twitter:{card:'summary_large_image',title,description,images:[origin+'/opengraph-image']}};
}
