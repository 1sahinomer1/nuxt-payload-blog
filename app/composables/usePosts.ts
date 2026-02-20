import type { Post, PayloadResponse } from '~/types'

export function usePosts() {
  const config = useRuntimeConfig()
  const baseUrl = `${config.public.payloadUrl}/api`

  function getPosts(page = 1, limit = 10) {
    return useAsyncData<PayloadResponse<Post>>(
      `posts-${page}-${limit}`,
      async () => {
        try {
          const url = `${baseUrl}/posts`
          const response = await $fetch<PayloadResponse<Post>>(url, {
            params: {
              page,
              limit,
              sort: '-publishedAt',
              depth: 1,
            },
          })
          return response
        } catch (error: any) {
          console.error('Failed to fetch posts:', error)
          console.error('API URL:', baseUrl)
          console.error('Payload URL from config:', config.public.payloadUrl)
          throw error
        }
      },
      {
        default: () => ({ docs: [], totalDocs: 0, limit: 10, totalPages: 0, page: 1, pagingCounter: 0, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null }),
      },
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
