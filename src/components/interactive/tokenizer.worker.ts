import { getEncoding } from 'js-tiktoken'

const encoding = getEncoding('o200k_base')
const MAX_PREVIEW_TOKENS = 800

type TokenizeRequest = {
  id: number
  text: string
}

type TokenizeResponse = {
  id: number
  tokenCount: number
  preview: { token: string; id: number }[]
  error?: string
}

self.onmessage = (event: MessageEvent<TokenizeRequest>) => {
  const { id, text } = event.data

  try {
    const tokenIds = encoding.encode(text)
    const preview = tokenIds.slice(0, MAX_PREVIEW_TOKENS).map((tokenId) => ({
      token: encoding.decode([tokenId]),
      id: tokenId,
    }))

    const response: TokenizeResponse = {
      id,
      tokenCount: tokenIds.length,
      preview,
    }

    self.postMessage(response)
  } catch (error) {
    const response: TokenizeResponse = {
      id,
      tokenCount: 0,
      preview: [],
      error: error instanceof Error ? error.message : 'Unknown tokenizer worker error',
    }

    self.postMessage(response)
  }
}
