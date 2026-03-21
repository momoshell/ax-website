<script lang="ts">
	import GridOverlay from './GridOverlay.svelte';
	import CoordinateMarkers from './CoordinateMarkers.svelte';

	let { children } = $props();
</script>

<div class="relative min-h-screen bg-black">
	<GridOverlay />
	<CoordinateMarkers />
	<div class="relative z-10">
		{@render children()}
	</div>
</div>
