<script lang="ts">
	interface Props {
		href: string;
		label: string;
		isActive?: boolean;
		onclick?: () => void;
		class?: string;
	}

	let { href, label, isActive = false, onclick, class: className = '' }: Props = $props();

	const linkClass = $derived(isActive ? 'text-white' : 'text-white/60 hover:text-white');
</script>

<a
	{href}
	onclick={(e) => {
		e.preventDefault();
		onclick?.();
	}}
	class="tech-label transition-colors duration-200 {linkClass} {className}"
>
	{label}
</a>
