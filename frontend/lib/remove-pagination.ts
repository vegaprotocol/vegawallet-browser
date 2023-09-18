import compact from 'lodash/compact'

export function removePaginationWrapper<T>(edges: Array<{ node: T } | null> | undefined | null): T[] {
  return compact(edges?.map((edge) => edge?.node))
}
