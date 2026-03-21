<script lang="ts">
	interface Props {
		value: string;
		width?: number;
		height?: number;
		displayValue?: boolean;
	}

	let {
		value,
		width = 200,
		height = 60,
		displayValue = true
	}: Props = $props();

	// Generate barcode pattern from value
	// Creates visual bars based on character codes
	function generateBars(text: string): string {
		let bars = '';
		for (let i = 0; i < text.length; i++) {
			const charCode = text.charCodeAt(i);
			// Vary bar width based on character
			const barWidth = (charCode % 3) + 1;
			bars += '1'.repeat(barWidth);
			// Variable gap between bars
			const gapWidth = (charCode % 2) + 1;
			bars += '0'.repeat(gapWidth);
		}
		return bars;
	}

	const bars = $derived(generateBars(value));

	// Calculate SVG viewBox dimensions
	const barUnit = 3;
	const totalWidth = $derived(bars.length * barUnit);
	const barHeight = $derived(height - (displayValue ? 20 : 0));
</script>

<div class="flex flex-col items-center">
	<svg
		{width}
		{height}
		viewBox="0 0 {totalWidth} {height}"
		class="overflow-visible"
		aria-label="Barcode for {value}"
		role="img"
	>
		<rect x="0" y="0" width={totalWidth} height={height} fill="transparent" />
		{#each bars.split('') as bar, i}
			{#if bar === '1'}
				<rect
					x={i * barUnit}
					y="0"
					width="2"
					height={barHeight}
					fill="white"
				/>
			{/if}
		{/each}
	</svg>
	{#if displayValue}
		<span class="tech-label mt-2">{value}</span>
	{/if}
</div>
