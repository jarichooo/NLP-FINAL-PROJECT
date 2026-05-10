export default function DotGrid({ rows = 7, cols = 7, step = 22, radius = 1.5, className }) {
  const width = cols * step
  const height = rows * step
  const circles = []

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      circles.push(
        <circle
          key={`${row}-${col}`}
          cx={col * step + step / 2}
          cy={row * step + step / 2}
          r={radius}
          fill="currentColor"
        />,
      )
    }
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {circles}
    </svg>
  )
}

