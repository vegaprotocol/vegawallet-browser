export const LeftRightArrows = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="23"
      height="21"
      viewBox="0 0 23 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 6H1.5M1.5 6L6.5 0.5M1.5 6L6.5 11.5" stroke="currentColor" />
      <path
        d="M11 15H21.5M21.5 15L16.5 20.5M21.5 15L16.5 9.5"
        stroke="currentColor"
      />
    </svg>
  )
}
