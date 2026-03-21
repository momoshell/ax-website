<script lang="ts">
	interface Props {
		text: string;
		class?: string;
	}

	let { text, class: className = '' }: Props = $props();
</script>

<h2 class="{className}">
	<span class="text-[#666666]">/</span>{text}
</h2>
