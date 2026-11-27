'use client';
import {useEffect,useRef} from 'react';
const tokens=/(#[^\n]*|\/\/[^\n]*|\b(?:if|else|while|for|in|return|int|void|def|class|public|static|new|import|from|long|auto|const|continue|break|true|false|None|and|or|not|elif|boolean|bool|double)\b|\b\d+\b)/g;
export default function Code({source,lines}:{source:string;lines:number[]}){const pane=useRef<HTMLDivElement>(null);useEffect(()=>{const el=pane.current?.querySelector<HTMLElement>('.executing');const box=pane.current;if(el&&box){const y=el.offsetTop-box.offsetTop;if(y<box.scrollTop||y+el.offsetHeight>box.scrollTop+box.clientHeight)box.scrollTop=Math.max(0,y-box.clientHeight/3);}},[lines]);
 return <div className="code-lines" ref={pane} tabIndex={0} aria-label="Source code">{source.split('\n').map((l,i)=><div key={i} className={lines.includes(i+1)?'executing':''}><span aria-hidden="true">{i+1}</span><code>{l.split(tokens).map((t,k)=>k%2?<i key={k} className={/^#|^\/\//.test(t)?'comment':/^\d/.test(t)?'number':''}>{t}</i>:t)}</code></div>)}</div>;
}
