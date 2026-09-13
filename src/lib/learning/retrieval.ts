const stopwords = new Set(['a','an','and','about','is','it','me','of','the','tell','to','what','ist','sind','der','die','das','ein','eine','und','von','über','mir','was','wie','in'])
export function searchTerms(text: string) {
  return Array.from(new Set((text.toLocaleLowerCase().match(/[a-z0-9äöüßéèáàç]+/g) ?? []).filter(w => !stopwords.has(w))))
}
export function retrieve<T extends { id: number; title: string; content: string }>(query: string, documents: readonly T[]) {
  const terms = searchTerms(query)
  return documents.map(doc => {
    const words = new Set(searchTerms(doc.title+' '+doc.content))
    const matches = terms.filter(word => words.has(word))
    return { ...doc, matches }
  }).filter(doc => doc.matches.length > 0).sort((a,b) => b.matches.length-a.matches.length || a.id-b.id)
}
