export const VegaIcon = ({ inverted = false }: { inverted?: boolean }) => {
  const color = inverted ? 'black' : 'white'
  const backgroundColor = inverted ? 'white' : 'black'
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="8" fill={backgroundColor} />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.3333 42.3333H20.3333V10.3333H14.3333V42.3333Z"
        fill={color}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M37.6667 36.3333H43.6667V10.3333H37.6667V36.3333Z"
        fill={color}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M26.3333 54H32.3333V48H26.3333V54Z"
        fill={color}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M32.3333 48.3333H38.3333V42.3333H32.3333V48.3333Z"
        fill={color}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M43.6667 42.3333H49.6667V36.3333H43.6667V42.3333Z"
        fill={color}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20.3333 48.3333H26.3333V42.3333H20.3333V48.3333Z"
        fill={color}
      />
    </svg>
  )
}
