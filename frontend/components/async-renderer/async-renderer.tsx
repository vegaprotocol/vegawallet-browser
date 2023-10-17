import { ReactNode } from 'react'

export interface AsyncRendererProps {
  loading: boolean
  renderLoading?: () => ReactNode
  error?: Error | null
  errorView?: (error: Error) => ReactNode
  noData?: boolean
  renderNoData?: () => ReactNode
  render: () => ReactNode
}

export function AsyncRenderer({
  loading,
  renderLoading,
  error,
  errorView,
  noData,
  renderNoData,
  render
}: AsyncRendererProps) {
  if (loading) return renderLoading ? <>{renderLoading()}</> : null
  if (error) return errorView ? <>{errorView(error)}</> : null
  if (noData) return renderNoData ? <>{renderNoData()}</> : null
  return <>{render()}</>
}
