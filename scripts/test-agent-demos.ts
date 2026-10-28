import assert from 'node:assert/strict'
import { matchSkill, retrieveNotes, validateTool, generateToolSchema, formatToolDefinition, rewardCases, checkReward, biasGroups, groupCounts, type DemoTool } from '../src/lib/agent-demo-models'
import { trialScripts, runTrial, combinedVerdict, summarize as summarizeEval, binomial, passAtK, passHatK, type GraderId } from '../src/lib/agent-eval-math'
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
const optionalTool:DemoTool={name:'search_web',description:'Search.',parameters:[{id:3,name:'query',type:'string',description:'Terms',required:true},{id:4,name:'max_results',type:'integer',description:'Count',required:false}]}
const ajvUnion = new Ajv({ allErrors: true, allowUnionTypes: true })
const openaiStrict=formatToolDefinition(optionalTool,'openai',true)! as {strict:boolean,parameters:object&{required:string[]}}
assert.equal(openaiStrict.strict,true)
assert.deepEqual(openaiStrict.parameters.required,['query','max_results'])
const validateOpenai=ajvUnion.compile(openaiStrict.parameters)
assert.equal(validateOpenai({query:'x',max_results:null}),true)
assert.equal(validateOpenai({query:'x'}),false)
assert.equal(validateOpenai({query:'x',max_results:2.5}),false)
const claudeStrict=formatToolDefinition(optionalTool,'anthropic',true)! as {strict:boolean,input_schema:object&{required:string[]}}
assert.equal(claudeStrict.strict,true)
assert.deepEqual(claudeStrict.input_schema.required,['query'])
assert.equal(ajv.compile(claudeStrict.input_schema)({query:'x'}),true)
assert.equal('strict' in formatToolDefinition(optionalTool,'anthropic',false)!,false)
assert.equal(formatToolDefinition(duplicate,'openai',true),null)

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

// Agent evaluation demo: graders read real simulated end states and transcripts
const evalRuns = trialScripts.map(runTrial)
const passing = (graders: GraderId[]) => evalRuns.filter(run => combinedVerdict(run, graders)).map(run => run.id)
assert.deepEqual(passing(['claim']), ['clean', 'skippedCheck', 'falseClaim', 'detour', 'wrongAmount'])
assert.deepEqual(passing(['outcome']), ['clean', 'skippedCheck', 'detour'])
assert.deepEqual(passing(['policy']), ['clean', 'falseClaim', 'detour', 'wrongAmount'])
assert.deepEqual(passing(['exactPath']), ['clean', 'falseClaim', 'wrongAmount'])
assert.deepEqual(passing(['outcome', 'policy']), evalRuns.filter(run => run.reviewerPass).map(run => run.id))
const bestCombo = summarizeEval(evalRuns, ['outcome', 'policy'])
assert.equal(bestCombo.falsePasses + bestCombo.falseFails, 0)
assert.equal(evalRuns[2].transcript[2].ok, false)
assert.equal(evalRuns[2].finalState.refunds.length, 0)
for (const run of evalRuns) assert.equal(run.transcript.length, run.calls.length)
assert.equal(binomial(5, 2), 10)
assert.equal(passAtK(5, 2, 1), 0.4)
assert.equal(passHatK(5, 2, 1), 0.4)
assert.ok(Math.abs(passAtK(5, 2, 2) - 0.7) < 1e-12)
assert.ok(Math.abs(passHatK(5, 2, 2) - 0.1) < 1e-12)
assert.equal(passAtK(5, 4, 2), 1)
assert.equal(passHatK(5, 2, 3), 0)
assert.equal(passHatK(5, 5, 5), 1)
console.log('Agent demo regressions passed: 8 localized presets, whole-word routing, JSON Schema contracts, real reward checks, lexical retrieval, group error rates, trajectory graders and pass@k/pass^k estimators.')
