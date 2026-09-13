import assert from 'node:assert/strict'
import { softmax, nucleus, sampleIndex } from '../src/lib/learning/decoding'
import { retrieve } from '../src/lib/learning/retrieval'
import { normalizeVisitedPaths, normalizeTopicIds } from '../src/lib/progress/schema'
import { flattenTopics, learningPath, learningPathGroups } from '../src/lib/topics'

const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`)
const probabilities=softmax([3,2,1],1)
close(probabilities.reduce((a,b)=>a+b,0),1)
softmax([10003,10002,10001],1).forEach((p,i)=>close(p,probabilities[i]))
assert.deepEqual(softmax([2,3,1],0),[0,1,0])
assert.deepEqual(softmax([3,3,1],0),[1,0,0])
assert.deepEqual(nucleus([.6,.3,.1],.6),[1,0,0])
const filtered=nucleus([.6,.3,.1],.8)
close(filtered[0],2/3);close(filtered[1],1/3);assert.equal(filtered[2],0)
assert.equal(sampleIndex([.5,.5,0],.499),0)
assert.equal(sampleIndex([.5,.5,0],.5),1)
assert.equal(sampleIndex([.5,.5,0],.999999),1)
assert.throws(()=>sampleIndex(probabilities,1))
assert.throws(()=>softmax([1,NaN],1))
const docs=[{id:1,title:'Frankreich',content:'Paris ist die Hauptstadt von Frankreich.'},{id:2,title:'Deutschland',content:'Berlin ist die Hauptstadt von Deutschland.'}]
assert.equal(retrieve('Frankreich Paris',docs)[0].id,1)
assert.deepEqual(retrieve('Quantenmechanik',docs),[])
assert.deepEqual(retrieve('die und ist',docs),[])
assert.deepEqual(normalizeTopicIds(['agentic-patterns','powerful-agents','orchestration','logges-favourite-model']).ids,['orchestration','tier-list'])
assert.deepEqual(normalizeVisitedPaths(['/de/ai/agents/patterns','/de/ai/agents/powerful/','/en/ai/industry/logges-favourite-model']).paths,['/de/ai/agents/orchestration','/en/ai/industry/tier-list'])
const ids=flattenTopics().map(t=>t.id)
assert.equal(ids.length,67)
assert.equal(new Set(ids).size,67)
for(const retired of ['agentic-patterns','powerful-agents','logges-favourite-model'])assert.ok(!ids.includes(retired))
assert.ok(!learningPath.includes('tier-list'))
assert.ok(learningPathGroups.some(g=>g.optional&&g.topicIds.includes('tier-list')))
assert.equal(new Set(learningPath).size,learningPath.length)
for(const id of learningPath)assert.ok(ids.includes(id),id)
console.log('Decoding, retrieval, canonical topic and progress migration regressions passed')
