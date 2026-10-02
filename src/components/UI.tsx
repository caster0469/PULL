import type{ButtonHTMLAttributes,HTMLAttributes,InputHTMLAttributes,SelectHTMLAttributes}from'react';
export function Card(p:HTMLAttributes<HTMLDivElement>){return <div {...p} className={`card ${p.className||''}`}/>}
export function Button(p:ButtonHTMLAttributes<HTMLButtonElement>){return <button {...p} className={`button ${p.className||''}`}/>}
export function Input(p:InputHTMLAttributes<HTMLInputElement>){return <input {...p} className={`input ${p.className||''}`}/>}
export function Select(p:SelectHTMLAttributes<HTMLSelectElement>){return <select {...p} className={`select ${p.className||''}`}/>}
export function Segmented<T extends string>({value,options,onChange,disabled}:{value:T;options:{value:T;title:string;note?:string}[];onChange:(v:T)=>void;disabled?:boolean}){return <div className="segments">{options.map(o=><Button disabled={disabled} key={o.value} onClick={()=>onChange(o.value)} className={value===o.value?'active':''}><b>{o.title}</b>{o.note&&<small>{o.note}</small>}</Button>)}</div>}
