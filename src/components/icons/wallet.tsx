export const Wallet = ({
  className,
  squareFill,
}: {
  className?: string
  squareFill?: string
}) => {
  return (
    <svg
      className={className}
      width="21"
      height="19"
      viewBox="0 0 21 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1.33331" y="1" width="17" height="17" stroke="currentColor" />
      <rect
        x="13.3333"
        y="6"
        width="7"
        height="7"
        fill={squareFill}
        stroke="currentColor"
      />
      <rect x="15.8333" y="8.5" width="2" height="2" fill="currentColor" />
    </svg>
  )
}
