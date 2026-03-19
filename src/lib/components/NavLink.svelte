<script lang="ts">
	interface Props {
		href: string;
		label: string;
		isActive?: boolean;
		onclick?: () => void;
		class?: string;
	}

	let { href, label, isActive = false, onclick, class: className = '' }: Props = $props();
</script>

<a
	{href}
	onclick={(e) => {
		e.preventDefault();
		onclick?.();
	}}
	class="text-sm font-medium transition-colors duration-200 {className}"
	class:text-accent={isActive}
	class:text-muted-foreground={!isActive}
	class:hover:text-foreground={!isActive}
>
	{label}
</a>
