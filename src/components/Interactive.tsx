'use client';
import dynamic from 'next/dynamic';
import {updateProgress} from '@/hooks/useProgress';
import {award} from '@/lib/persistence/progress';
const Game=dynamic(()=>import('./games/GameBoard'));
const Active=dynamic(()=>import('./challenges/ActiveLab'));
export function GamePlayer({slug}:{slug:string}){return <Game slug={slug} onWin={level=>updateProgress(p=>award(p,'game/'+slug+'/'+level))}/>}
export function Challenge({daily=false,mode}:{daily?:boolean;mode?:string}){return <Active daily={daily} mode={mode} onComplete={(correct,id)=>updateProgress(p=>{const next=Object.hasOwn(p.attempts,id)?p:{...p,attempts:{...p.attempts,[id]:correct}};return correct?award(next,'challenge/'+id):next;})}/>}
export function Print(){return <button onClick={()=>window.print()}>Print or save as PDF</button>}

