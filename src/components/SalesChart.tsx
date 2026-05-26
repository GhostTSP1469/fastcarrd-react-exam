import { useState } from 'react'

const points = [
  { x: 20, y: 200, month: 'Jan', value: 310 },
  { x: 70, y: 230, month: 'Feb', value: 220 },
  { x: 120, y: 180, month: 'Mar', value: 430 },
  { x: 170, y: 210, month: 'Apr', value: 350 },
  { x: 220, y: 120, month: 'May', value: 864 },
  { x: 270, y: 95, month: 'Jun', value: 980 },
  { x: 320, y: 125, month: 'Jul', value: 760 },
  { x: 370, y: 60, month: 'Aug', value: 1220 },
  { x: 420, y: 85, month: 'Sep', value: 1030 },
  { x: 470, y: 160, month: 'Oct', value: 620 },
  { x: 520, y: 160, month: 'Nov', value: 620 },
  { x: 570, y: 120, month: 'Dec', value: 860 },
]

function getNearestPoint(mouseX: number) {
  let nearest = points[0]

  points.forEach((point) => {
    if (Math.abs(point.x - mouseX) < Math.abs(nearest.x - mouseX)) {
      nearest = point
    }
  })

  return nearest
}

export function SalesChart() {
  const [activePoint, setActivePoint] = useState(points[4])
  const line = points.map((point) => `${point.x},${point.y}`).join(' ')

  function moveDot(event: { currentTarget: SVGSVGElement; clientX: number }) {
    const rect = event.currentTarget.getBoundingClientRect()
    const mouseX = ((event.clientX - rect.left) / rect.width) * 600

    setActivePoint(getNearestPoint(mouseX))
  }

  return (
    <article className="admin-card admin-chart-card">
      <div className="admin-card-title">
        <h2>Sales Revenue</h2>
      </div>
      <svg viewBox="0 0 620 270" onMouseMove={moveDot}>
        {[50, 100, 150, 200, 250].map((lineY) => (
          <line key={lineY} x1="20" x2="590" y1={lineY} y2={lineY} />
        ))}
        <polyline points={line} />
        <line className="hover-line" x1={activePoint.x} x2={activePoint.x} y1="40" y2="235" />
        <circle cx={activePoint.x} cy={activePoint.y} r="8" />
        <g className="chart-tip" transform={`translate(${activePoint.x - 58} ${activePoint.y - 72})`}>
          <rect width="116" height="52" rx="4" />
          <text x="58" y="22" textAnchor="middle">
            {activePoint.value} Orders
          </text>
          <text x="58" y="40" textAnchor="middle">
            {activePoint.month}
          </text>
        </g>
        {points.map((point) => (
          <text key={point.month} x={point.x} y="260" textAnchor="middle">
            {point.month}
          </text>
        ))}
      </svg>
    </article>
  )
}
