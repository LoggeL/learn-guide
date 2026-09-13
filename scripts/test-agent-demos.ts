import assert from 'node:assert/strict'
import { matchSkill, retrieveNotes, validateTool, generateToolSchema, rewardCases, checkReward, biasGroups, groupCounts, type DemoTool } from '../src/lib/agent-demo-models'
import { en } from '../src/lib/i18n/dictionaries/en'
import { de } from '../src/lib/i18n/dictionaries/de'
const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })

for (const dictionary of [en, de]) {
  const c = dictionary.skillComposer
  for (const [text, id] of [[c.exampleReview,'code-review'],[c.exampleDocs,'documentation'],[c.exampleGit,'git-workflow'],[c.exampleExplain,'explain']]) {
    assert.equal(matchSkill(text)[0]?.id,id,text)
  }
}
assert.equal(matchSkill('Überprüfe diesen Code auf Fehler').some(m=>m.id==='git-workflow'),false)
assert.deepEqual(matchSkill('The product is ready'),[])
assert.equal(matchSkill('Create a PR.')[0]?.id,'git-workflow')
assert.equal(matchSkill('documentation and git').length,2)

const empty:DemoTool={name:'current_time',description:'Read the current time.',parameters:[]}
assert.equal(validateTool(empty).valid,true)
const emptySchema=generateToolSchema(empty)!
assert.equal(ajv.validateSchema(emptySchema.parameters),true)
assert.equal(ajv.compile(emptySchema.parameters)({}),true)
const duplicate:DemoTool={name:'search',description:'',parameters:[{id:0,name:'query',type:'string',description:'',required:true},{id:1,name:'query',type:'number',description:'',required:false}]}
assert.equal(validateTool(duplicate).valid,false)
assert.equal(generateToolSchema(duplicate),null)
const arrayTool:DemoTool={name:'sum',description:'Add numbers.',parameters:[{id:2,name:'values',type:'array',itemType:'number',description:'Numbers',required:true}]}
const arraySchema=generateToolSchema(arrayTool)!
assert.equal(ajv.validateSchema(arraySchema.parameters),true)
const validate=ajv.compile(arraySchema.parameters)
assert.equal(validate({values:[1,2]}),true)
assert.equal(validate({values:['wrong']}),false)
assert.equal(validate({}),false)
assert.equal(validate({values:[],surprise:true}),false)
assert.equal(validateTool({...empty,name:'bad name'}).valid,false)

assert.equal(checkReward('constant',rewardCases[0],true).passed,true)
assert.equal(rewardCases.filter(values=>checkReward('constant',values,true).passed).length,2)
assert.equal(rewardCases.filter(values=>checkReward('constant',values,false).passed).length,4)
assert.equal(rewardCases.filter(values=>checkReward('sum',values,true).passed).length,4)
assert.equal(checkReward('sum',[],true).actual,0)
const notes=[{id:1,text:'TypeScript documentation'},{id:2,text:'Release documentation'},{id:3,text:'Release approval'}]
assert.deepEqual(retrieveNotes(notes,'script'),[])
assert.deepEqual(retrieveNotes(notes,'release release documentation').map(n=>n.id),[2,3,1])
assert.deepEqual(retrieveNotes(notes,'').map(n=>n.id),[3,2,1])
for(const group of biasGroups){assert.equal(groupCounts(group,0).selected,6);assert.equal(groupCounts(group,100).selected,0)}
assert.equal(groupCounts(biasGroups[0],60).tp,2)
assert.equal(groupCounts(biasGroups[1],60).tp,1)
console.log('Agent demo regressions passed: 8 localized presets, whole-word routing, JSON Schema contracts, real reward checks, lexical retrieval and group error rates.')
