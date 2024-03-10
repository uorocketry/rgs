<script lang="ts">
	import { tweened } from 'svelte/motion';
	let w = 100;
	let h = 100;
	export let heading = 0;
	let headingTweened = tweened(0, {
		duration: 250,
		// Custom interpolation function for 0-360 degrees
		// 10 to 350 goes the short way around
		interpolate: (a, b) => {
			const diff = b - a;
			if (diff > 180) {
				return (t) => {
					let v = a + (diff - 360) * t;
					if (v < 0) {
						v += 360;
					}
					return v;
				};
			}
			if (diff < -180) {
				return (t) => {
					let v = a + (diff + 360) * t;
					if (v >= 360) {
						v -= 360;
					}
					return v;
				};
			}
			return (t) => {
				let v = a + diff * t;
				if (v < 0) {
					v += 360;
				}
				if (v >= 360) {
					v -= 360;
				}
				return v;
			};
		}
	});

	const RAD2DEG = 180 / Math.PI;

	$: headingTweened.set(heading);
	const breaksPoints = {
		0: 'N',
		45: 'NE',
		90: 'E',
		135: 'SE',
		180: 'S',
		225: 'SW',
		270: 'W',
		315: 'NW'
	} as const;
	let angle = 0;
	$: radius = Math.min(w, h - 80) / 2;
	type Lines = {
		x: number;
		y: number;
		x2: number;
		y2: number;
	};
	type Texts = {
		x: number;
		y: number;
		text: string;
		r: number;
		color?: string;
	};
	let lines: Lines[] = [];
	let texts: Texts[] = [];
	$: {
		lines = [];
		texts = [];
		angle = 0;
		while (angle < 360) {
			const center_x = w / 2;
			const center_y = h / 2;
			const x = center_x + Math.cos((angle * Math.PI) / 180) * radius;
			const y = center_y + Math.sin((angle * Math.PI) / 180) * radius;
			let lineDist = 0.05;
			if (angle % 10 === 0) {
				lineDist = 0.1;
			}
			if (angle % 30 === 0) {
				lineDist = 0.1;
				// Add text if not a label
				if (breaksPoints[angle as keyof typeof breaksPoints] === undefined) {
					const text = angle;
					const textDist = 0.15;
					const x = center_x + Math.cos((angle * Math.PI) / 180) * radius * (1 - textDist);
					const y = center_y + Math.sin((angle * Math.PI) / 180) * radius * (1 - textDist);
					const rad = angle + 90;
					texts.push({ x, y, text: text.toString(), r: rad });
				}
			}
			if (angle % 45 === 0) {
				lineDist = 0.2;
			}
			const text = breaksPoints[angle as keyof typeof breaksPoints];
			if (text) {
				const x = center_x + Math.cos((angle * Math.PI) / 180) * radius * 0.75;
				const y = center_y + Math.sin((angle * Math.PI) / 180) * radius * 0.75;
				const rad = angle + 90;
				texts.push({ x, y, text, r: rad, color: 'red' });
			}
			const x2 = center_x + Math.cos((angle * Math.PI) / 180) * radius * (1 - lineDist);
			const y2 = center_y + Math.sin((angle * Math.PI) / 180) * radius * (1 - lineDist);
			lines.push({ x, y, x2, y2 });
			angle += 5;
		}
	}
</script>

<div
	bind:clientHeight={h}
	bind:clientWidth={w}
	class="h-full w-full select-none flex-col text-center"
>
	<svg
		class="h-full w-full"
		transform="rotate({-90 + heading * RAD2DEG})"
		width={w}
		height={h}
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx={w / 2} cy={h / 2} r={radius} stroke="white" stroke-width="2" fill="none" />

		{#each lines as line}
			<line x1={line.x} y1={line.y} x2={line.x2} y2={line.y2} stroke="white" />
		{/each}

		{#each texts as text}
			<text
				x={text.x}
				y={text.y}
				fill={text.color ?? 'white'}
				transform={`rotate(${text.r} ${text.x} ${text.y})`}
				text-anchor="middle"
				alignment-baseline="middle"
				font-size="12"
			>
				{text.text}
			</text>
		{/each}
	</svg>

	<!-- SVG for the compass needle -->
	<svg
		class="absolute left-0 top-0 h-full w-full"
		width={w}
		height={h}
		xmlns="http://www.w3.org/2000/svg"
	>
		<line
			x1={w / 2}
			y1={h / 2 - radius * 0.9}
			x2={w / 2}
			y2={h / 2 - radius}
			stroke="red"
			stroke-width="2"
		/>
		<!-- Text -->
		<rect
			x={w / 2 - 25}
			y={h / 2 - radius - 10}
			width={50}
			height={20}
			fill="white"
			stroke-width="2"
			rx="5"
			ry="5"
		/>

		<text
			x={w / 2}
			y={h / 2 - radius}
			fill="black"
			text-anchor="middle"
			alignment-baseline="middle"
			font-size="12"
		>
			{($headingTweened * RAD2DEG).toFixed(2)}°
		</text>
	</svg>
</div>
