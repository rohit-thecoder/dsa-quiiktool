// Small original diagrams. The accompanying topic title supplies the accessible name.
export default function Art({kind=0}:{kind?:number}){
 const k=kind%6, palette=[['#ae97ff','#7254da'],['#9cdbb5','#39876b'],['#ffbc81','#c47543'],['#86c9ff','#436eac'],['#e6a0ce','#975d9b'],['#9bd4df','#36778a']][k], [a,b]=palette;
 const node=(x:number,y:number,key:number)=> <g key={key}><circle cx={x} cy={y} r="10" fill={b} stroke={a}/><circle cx={x-2} cy={y-3} r="2.4" fill={a}/></g>;
 return <svg className="art" viewBox="0 0 260 108" aria-hidden="true" style={{color:a}}>
 <defs><pattern id={'dot'+k} width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".8" fill="currentColor" opacity=".25"/></pattern></defs>
 <rect width="260" height="108" fill={b} opacity=".12"/><rect width="260" height="108" fill={'url(#dot'+k+')'}/>
 {k===0||k===3? <g transform="translate(44 23)">{[2,4,3,6,5,7].map((n,i)=><g key={i} transform={'translate('+i*27+' '+(58-n*6)+')'}><path d={'M0 4 9 0 25 6 16 11Z'} fill={a}/><path d={'M0 4 16 11v'+(n*6)+'L0 '+(4+n*6)+'Z'} fill={b}/><path d={'m16 11 9-5v'+n*6+'l-9 5Z'} fill={a} opacity=".7"/></g>)}</g>:
 k===1||k===4?<g stroke={a} strokeWidth="2">{[[127,20,82,51],[127,20,172,51],[82,51,55,84],[82,51,109,84],[172,51,148,84],[172,51,201,84]].map(([x,y,u,v],i)=><path key={i} d={'M'+x+' '+y+'L'+u+' '+v} opacity=".65"/>)}{[[127,20],[82,51],[172,51],[55,84],[109,84],[148,84],[201,84]].map(([x,y],i)=>node(x,y,i))}</g>:
 <g transform="translate(50 14)">{[0,1,2,3,4].map(i=><g key={i} transform={'translate('+(i*29)+' '+(i%2?20:34)+')'}>{i<4&&<path d={'M16 5l17 '+(i%2?13:-13)} fill="none" stroke={a} strokeWidth="2" strokeDasharray={k===5?'3 2':undefined}/>}<rect x="0" y="-7" width="24" height="24" rx="6" fill={b} stroke={a}/><circle cx="12" cy="5" r="3" fill={a}/></g>)}</g>}
 </svg>;
}
