import assert from 'node:assert/strict'
import { flattenTopics } from '../src/lib/topics'

// HTTP smoke test against a running production build. This does not execute browser JS.
async function main() {
  const base = process.argv[2] || 'http://127.0.0.1:8765'
  let checked = 0
  for (const locale of ['de', 'en']) {
    for (const topic of flattenTopics()) {
      const path = `/${locale}${topic.path}`
      const response = await fetch(base + path)
      assert.equal(response.status, 200, path)
      const html = await response.text()
      assert.match(html, /<h1[ >]/, `Missing heading: ${path}`)
      assert.ok(html.includes(`rel="canonical" href="https://learn.logge.top${path}"`), `Wrong canonical: ${path}`)
      assert.ok(!html.includes('NEXT_HTTP_ERROR_FALLBACK;500'), `Render error: ${path}`)
      checked++
    }
    for (const [from, to] of [
      ['/ai/agents/patterns', '/ai/agents/orchestration'],
      ['/ai/agents/powerful', '/ai/agents/orchestration'],
      ['/ai/industry/logges-favourite-model', '/ai/industry/tier-list'],
    ]) {
      const response = await fetch(`${base}/${locale}${from}`, { redirect: 'manual' })
      assert.equal(response.status, 308, from)
      assert.equal(new URL(response.headers.get('location')!, base).pathname, `/${locale}${to}`)
    }
  }
  const asset = await fetch(base + '/images/vision/inspection-panel.png')
  assert.equal(asset.status, 200)
  assert.match(asset.headers.get('content-type')!, /image\/png/)
  console.log(`PASS: ${checked} localized article routes, headings and canonicals; 6 permanent redirects; reference image. Browser interactions are checked separately.`)
}
main().catch(error => { console.error(error); process.exitCode = 1 })
