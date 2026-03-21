<script lang="ts">
	// CoordinateMarkers - Grid coordinate labels along viewport edges
	// Left edge: Letters A-E, Top edge: Numbers 12-1 (right to left)
	
	const leftMarkers = ['A', 'B', 'C', 'D', 'E'];
	const topMarkers = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
</script>

<!-- Left side markers -->
<div class="fixed left-2 top-0 bottom-0 hidden md:flex flex-col justify-around pointer-events-none z-10">
	{#each leftMarkers as letter (letter)}
		<span class="text-xs font-mono text-white/40">{letter}</span>
	{/each}
</div>

<!-- Top markers -->
<div class="fixed top-2 left-0 right-0 hidden md:flex justify-around pointer-events-none z-10">
	{#each topMarkers as num (num)}
		<span class="text-xs font-mono text-white/40">{num}</span>
	{/each}
</div>
