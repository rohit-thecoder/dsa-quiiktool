import {origin} from './metadata';
export const learningData=(title:string,summary:string,path:string)=>({'@context':'https://schema.org','@type':'LearningResource',name:title,description:summary,url:origin+path,inLanguage:'en'});
export const breadcrumbs=(items:{name:string,path:string}[])=>({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((o,i)=>({'@type':'ListItem',position:i+1,name:o.name,item:origin+o.path}))});
export const safeJson=(value:unknown)=>JSON.stringify(value).replace(/</g,'\\u003c');
