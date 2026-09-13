'use client'
import { useRef, useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { DemoParameter, DemoTool, validateTool, generateToolSchema } from '@/lib/agent-demo-models'
const types = ['string','number','boolean','array'] as const
export function ToolSchemaBuilder() {
  const { t } = useTranslation(); const c = t.agentReview
  const [tool, setTool] = useState<DemoTool>(() => ({name:'search_web',description:c.schemaDefault,parameters:[{id:0,name:'query',type:'string',description:c.schemaQuery,required:true}]}))
  const nextId = useRef(1)
  const validation = validateTool(tool); const generated = generateToolSchema(tool)
  const update = (id:number, change:Partial<DemoParameter>) => setTool({...tool,parameters:tool.parameters.map(p => p.id === id ? {...p,...change} : p)})
  return <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
    <h3 className="text-xl font-semibold">{c.schemaIdentity}</h3><p className="text-sm text-muted">{c.schemaNote}</p>
    <label className="block">{t.interactive.toolName}<input value={tool.name} onChange={e => setTool({...tool,name:e.target.value})} className="block w-full p-2 mt-1 bg-background border border-border rounded"/></label>
    <label className="block">{c.description}<textarea value={tool.description} onChange={e => setTool({...tool,description:e.target.value})} className="block w-full p-2 mt-1 bg-background border border-border rounded"/></label>
    <div className="flex justify-between gap-3"><h4>{c.parameters}</h4><button className="text-primary-light" onClick={() => setTool({...tool,parameters:[...tool.parameters,{id:nextId.current++,name:'',type:'string',description:'',required:false}]})}>{t.interactive.addParameter}</button></div>
    {!tool.parameters.length && <p>{c.schemaEmpty}</p>}
    {tool.parameters.map(p => <fieldset className="border border-border rounded p-3 space-y-3" key={p.id}>
      <div className="flex justify-end"><button className="text-sm text-orange-400" onClick={() => setTool({...tool,parameters:tool.parameters.filter(x => x.id !== p.id)})}>{c.remove}</button></div>
      <label className="block">{t.interactive.paramName}<input value={p.name} onChange={e => update(p.id,{name:e.target.value})} className="block w-full p-2 bg-background rounded border border-border"/></label>
      <label className="block">{t.interactive.paramType}<select value={p.type} onChange={e => update(p.id,{type:e.target.value as DemoParameter['type']})} className="block w-full p-2 bg-background rounded border border-border">{types.map(type => <option key={type}>{type}</option>)}</select></label>
      {p.type === 'array' && <label className="block">{c.schemaItemType}<select value={p.itemType ?? 'string'} onChange={e => update(p.id,{itemType:e.target.value as DemoParameter['itemType']})} className="block w-full p-2 bg-background rounded border border-border">{types.filter(type => type !== 'array').map(type => <option key={type}>{type}</option>)}</select></label>}
      <label className="block">{c.description}<input value={p.description} onChange={e => update(p.id,{description:e.target.value})} className="block w-full p-2 bg-background rounded border border-border"/></label>
      <label className="flex gap-2"><input type="checkbox" checked={p.required} onChange={e => update(p.id,{required:e.target.checked})}/>{t.interactive.paramRequired}</label>
    </fieldset>)}
    <div role="status">{validation.errors.map(error => <p className="text-orange-400" key={error}>{c[error]}</p>)}</div>
    {(!tool.description.trim() || tool.parameters.some(p => !p.description.trim())) && <p className="text-sm text-muted">{c.schemaDescription}</p>}
    <h4>{t.interactive.generatedSchema}</h4><pre className="overflow-x-auto rounded bg-background p-3 text-sm">{generated ? JSON.stringify(generated,null,2) : c.schemaBlocked}</pre>
  </div>
}
