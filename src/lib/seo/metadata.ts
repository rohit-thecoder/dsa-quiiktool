import type {Metadata} from 'next';
export const origin='https://dsa.quiiktool.com';
export function metadata(title:string,description:string,path:string,index=true):Metadata{
  const url=new URL(path,origin).href;
  return {title,description,alternates:{canonical:url},robots:{index,follow:true},openGraph:{title,description,url,siteName:'DSA QuiikTool',type:'website',images:[origin+'/opengraph-image']},twitter:{card:'summary_large_image',title,description,images:[origin+'/opengraph-image']}};
}
