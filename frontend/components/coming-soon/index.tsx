import locators from '../locators'

const Builder = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="440"
      height="330"
      viewBox="0 0 440 330"
      className="w-full h-auto"
    >
      <g>
        <path d="M207.4,239.3h-8V335h8V239.3z"></path>
        <path fill="white" d="M295,0H143.7v239.3H295V0z"></path>
        <path d="M191.5,71.8h-8v8h8V71.8z"></path>
        <path d="M199.5,79.8h-8v8h8V79.8z"></path>
        <path d="M207.4,71.8h-8v8h8V71.8z"></path>
        <path d="M191.5,87.7h-8v8h8V87.7z"></path>
        <path d="M295,126.9v-11.3l12,12h0h0v111.7h-8V130.9L295,126.9z"></path>
        <path d="M207.4,87.7h-8v8h8V87.7z"></path>
        <path d="M247.3,111.7h-55.7v8h55.7V111.7z"></path>
        <path d="M239.3,71.8h-8v8h8V71.8z"></path>
        <path d="M247.3,79.8h-8v8h8V79.8z"></path>
        <path d="M255.2,71.8h-8v8h8V71.8z"></path>
        <path d="M239.3,87.7h-8v8h8V87.7z"></path>
        <path d="M255.2,87.7h-8v8h8V87.7z"></path>
        <path d="M255.2,103.7h-8v8h8V103.7z"></path>
        <path d="M239.3,239.3h-8v8h8V239.3z"></path>
        <path d="M239.3,239.3h-8V335h8V239.3z"></path>
        <path d="M207.4,239.3h-8V335h8V239.3z"></path>
        <path d="M239.3,239.3h-8v8h8V239.3z"></path>
        <path d="M239.3,239.3h-8V335h8V239.3z"></path>
        <path d="M239.3,239.3h-8v8h8V239.3z"></path>
        <path fill="#5A20FF" d="M295,167.5H143.7v71.8H295V167.5z"></path>
        <path fill="#5A20FF" d="M215.4,239.3h-71.7v16h71.7V239.3z"></path>
        <path fill="#5A20FF" d="M295,239.3h-71.7v16H295V239.3z"></path>
        <path fill="#400ED0" d="M271.1,183.5H295v-16H143.7v16h111.5H271.1z"></path>
        <path fill="#D9DBDD" d="M247.3,199.4h-8v16h8V199.4z"></path>
        <path fill="#D9DBDD" d="M271.1,207.4h-8v-8h-8v8v8v8h8v-8h8v8h8v-8h-8V207.4z"></path>
        <path fill="#D9DBDD" d="M279.1,231.3h-23.9v8h23.9V231.3z"></path>
        <path fill="#D9DBDD" d="M279.1,199.4h-8v8h8V199.4z"></path>
        <path fill="#D9DBDD" d="M255.2,223.3h-8v8h8V223.3z"></path>
        <path fill="#D9DBDD" d="M247.3,231.3h-8v8h8V231.3z"></path>
        <path fill="#D9DBDD" d="M183.5,137.2L87,193.1l35.8,62.2l96.5-55.8L183.5,137.2z"></path>
        <path d="M154.6,190.8l-6.9,4l4,6.9l6.9-4L154.6,190.8z"></path>
        <path d="M143.7,126.9v-11.3l-12,12v111.7h8V130.9L143.7,126.9z"></path>
      </g>
    </svg>
  )
}

export const ComingSoon = () => {
  return (
    <div
      data-testid={locators.comingSoon}
      className="text-center flex flex-col items-center justify-center h-full bg-vega-purple-400"
    >
      <h1 className="text-3xl font-bold text-white mb-8">We're working on it! Coming soon.</h1>
      <Builder />
    </div>
  )
}
