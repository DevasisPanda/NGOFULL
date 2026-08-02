"use client"

import { useCallback, useState } from "react"

/**
 * Streams a POST response body token-by-token, calling onChunk with the
 * accumulated text. Returns [stream, isLoading, error].
 */
export function useStreamingResponse() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stream = useCallback(
    async (
      url: string,
      body: Record<string, unknown>,
      onChunk: (fullText: string) => void,
      onError?: (status: number) => void
    ): Promise<string> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })

        if (!response.ok) {
          onError?.(response.status)
          throw new Error(`Request failed: ${response.status}`)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let fullText = ""

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            fullText += decoder.decode(value, { stream: true })
            onChunk(fullText)
          }
        }

        return fullText
      } catch (e: any) {
        setError(e?.message || "Something went wrong")
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return { stream, isLoading, error }
}
