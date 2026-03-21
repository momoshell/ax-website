<script lang="ts">
	// GridOverlay - Full viewport CSS-based grid overlay
	// 50px grid lines using CSS gradients, very subtle white
</script>

<div class="fixed inset-0 pointer-events-none z-0">
	<div 
		class="w-full h-full"
		style="
			background-image: 
				linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
				linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
			background-size: 50px 50px;
		"
	></div>
</div>
