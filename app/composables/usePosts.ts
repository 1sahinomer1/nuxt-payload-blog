import type { Post, PayloadResponse } from '~/types'

export function usePosts() {
  const config = useRuntimeConfig()
  const baseUrl = `${config.public.payloadUrl}/api`

  function getPosts(page = 1, limit = 10) {
    return useAsyncData<PayloadResponse<Post>>(
      `posts-${page}-${limit}`,
      () => $fetch<PayloadResponse<Post>>(`${baseUrl}/posts`, {
        params: {
          page,
          limit,
          sort: '-publishedAt',
          depth: 1,
        },
        retry: 2,
        retryDelay: 500,
      }),
      {
        lazy: true,
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
        retry: 2,
        retryDelay: 500,
      }),
      {
        lazy: true,
      },
    )
  }

  return { getPosts, getPostBySlug }
}
