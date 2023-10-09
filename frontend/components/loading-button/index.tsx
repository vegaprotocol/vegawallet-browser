import { Button, ButtonProps, Loader } from '@vegaprotocol/ui-toolkit'

export interface LoadingButtonProps extends ButtonProps {
  text: string
  loadingText: string
  loading: boolean
}

export const LoadingButton = ({ text, loading, loadingText, disabled, ...rest }: LoadingButtonProps) => {
  return (
    <Button {...rest} disabled={disabled || loading}>
      <div className="flex items-center justify-center">
        {loading ? `${loadingText}…` : text}
        {loading && (
          <span className="ml-2">
            <Loader size="small" forceTheme="light" />
          </span>
        )}
      </div>
    </Button>
  )
}
