"use client";

interface RadarChartAxis {
    label: string;
    value: number; // 0-100
}

interface RadarChartProps {
    axes: RadarChartAxis[];
    size?: number;
}

const RINGS = [20, 40, 60, 80, 100];

function pointOnAxis(index: number, total: number, radius: number, center: number) {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle),
    };
}

export default function RadarChart({ axes, size = 320 }: RadarChartProps) {
    const center = size / 2;
    const maxRadius = size / 2 - 48;
    const total = axes.length;

    const dataPoints = axes.map((axis, i) => {
        const r = (Math.max(0, Math.min(100, axis.value)) / 100) * maxRadius;
        return pointOnAxis(i, total, r, center);
    });
    const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

    return (
        <div className="flex flex-col items-center">
            <svg
                viewBox={`0 0 ${size} ${size}`}
                width={size}
                height={size}
                role="img"
                aria-label={`Radar chart: ${axes.map((a) => `${a.label} ${a.value}`).join(", ")}`}
            >
                {/* Grid rings */}
                {RINGS.map((ring) => {
                    const r = (ring / 100) * maxRadius;
                    const ringPoints = axes
                        .map((_, i) => {
                            const p = pointOnAxis(i, total, r, center);
                            return `${p.x},${p.y}`;
                        })
                        .join(" ");
                    return (
                        <polygon
                            key={ring}
                            points={ringPoints}
                            fill="none"
                            stroke="var(--color-border)"
                            strokeOpacity={0.5}
                            strokeWidth={1}
                        />
                    );
                })}

                {/* Spokes + axis labels */}
                {axes.map((axis, i) => {
                    const edge = pointOnAxis(i, total, maxRadius, center);
                    const labelPoint = pointOnAxis(i, total, maxRadius + 22, center);
                    return (
                        <g key={axis.label}>
                            <line
                                x1={center}
                                y1={center}
                                x2={edge.x}
                                y2={edge.y}
                                stroke="var(--color-border)"
                                strokeOpacity={0.5}
                                strokeWidth={1}
                            />
                            <text
                                x={labelPoint.x}
                                y={labelPoint.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={11}
                                fontWeight={600}
                                fill="var(--color-text-secondary)"
                            >
                                {axis.label}
                            </text>
                        </g>
                    );
                })}

                {/* Data polygon */}
                <polygon
                    points={dataPath}
                    fill="var(--color-primary)"
                    fillOpacity={0.22}
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    strokeLinejoin="round"
                />
                {dataPoints.map((p, i) => (
                    <circle
                        key={axes[i].label}
                        cx={p.x}
                        cy={p.y}
                        r={4}
                        fill="var(--color-primary)"
                        stroke="var(--color-surface-elevated)"
                        strokeWidth={2}
                    />
                ))}
            </svg>

            {/* Accessible data table (screen-reader / no-JS fallback) */}
            <table className="sr-only">
                <caption>Trait scores</caption>
                <tbody>
                    {axes.map((axis) => (
                        <tr key={axis.label}>
                            <th scope="row">{axis.label}</th>
                            <td>{axis.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
