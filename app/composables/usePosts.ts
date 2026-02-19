import type { Post, PayloadResponse } from '~/types'

export function usePosts() {
  const config = useRuntimeConfig()
  const baseUrl = `${config.public.payloadUrl}/api`

  function getPosts(page = 1, limit = 10) {
    return useAsyncData<PayloadResponse<Post>>(
      `posts-${page}-${limit}`,
      () => $fetch(`${baseUrl}/posts`, {
        params: {
          page,
          limit,
          sort: '-publishedAt',
          depth: 1,
        },
      }),
    )
  }

  function getPostBySlug(slug: string) {
    return useAsyncData<PayloadResponse<Post>>(
      `post-${slug}`,
      () => $fetch(`${baseUrl}/posts`, {
        params: {
          'where[slug][equals]': slug,
          depth: 2,
        },
      }),
    )
  }

  return { getPosts, getPostBySlug }
}
