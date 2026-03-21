<script lang="ts">
	interface Props {
		text: string;
		class?: string;
	}

	let { text, class: className = '' }: Props = $props();
</script>

<h2 class="tech-heading {className}">
	<span class="text-white/40">/</span>{text}
</h2>
