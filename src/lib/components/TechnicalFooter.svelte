<script lang="ts">
	import Barcode from './Barcode.svelte';

	// Live clock state
	let currentTime = $state(new Date());

	// Update every second
	$effect(() => {
		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});

	// Derived date string: DD/MM/YYYY
	const dateStr = $derived(
		currentTime.toLocaleDateString('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		})
	);

	// Derived time string: HH:MM:SS
	const timeStr = $derived(
		currentTime.toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		})
	);
</script>

<footer class="w-full border-t border-white/20 bg-black py-6 mt-20">
	<div class="container mx-auto px-4">
		<!-- 5-column grid -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-8">
			<!-- Column 1: Trademark -->
			<div class="space-y-2">
				<p class="tech-label">TRADEMARK</p>
				<Barcode value="A&X INDUSTRIAL" width={120} height={40} displayValue={false} />
				<p class="text-xs font-mono text-white/60">A&X INDUSTRIAL</p>
			</div>

			<!-- Column 2: Company -->
			<div class="space-y-2">
				<p class="tech-label">COMPANY</p>
				<p class="text-sm font-mono text-white">A&X LABS</p>
				<p class="text-xs font-mono text-white/60">INDUSTRIAL STUDIO</p>
			</div>

			<!-- Column 3: Date -->
			<div class="space-y-2">
				<p class="tech-label">DATE</p>
				<p class="text-sm font-mono text-white">{dateStr}</p>
			</div>

			<!-- Column 4: Time -->
			<div class="space-y-2">
				<p class="tech-label">TIME</p>
				<p class="text-sm font-mono text-white">{timeStr}</p>
			</div>

			<!-- Column 5: Description -->
			<div class="space-y-2">
				<p class="tech-label">DESCRIPTION</p>
				<p class="text-xs font-mono text-white/60 leading-relaxed">
					AI ENGINEERING CONSULTANCY. BRIDGING THE GAP BETWEEN ARTIFICIAL INTELLIGENCE AND PHYSICAL SYSTEMS.
				</p>
			</div>
		</div>

		<!-- Bottom row: Copyright -->
		<div class="mt-8 pt-4 border-t border-white/10">
			<p class="text-xs font-mono text-white/40 text-center">
				© {currentTime.getFullYear()} A&X LABS. ALL RIGHTS RESERVED.
			</p>
		</div>
	</div>
</footer>
