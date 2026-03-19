<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { generateGlitchText, TARGET_TEXT } from '$lib/animations/glitch';
	import { PRELOADER_SESSION_KEY } from '$lib/constants';

	interface Props {
		onComplete?: () => void;
	}

	let { onComplete }: Props = $props();

	// Animation state
	let isComplete = $state(false);
	let isVisible = $state(true);
	let progress = $state(0);

	// Derived text based on progress
	let currentText = $derived(generateGlitchText(TARGET_TEXT, progress));

	// Animation configuration
	const ANIMATION_DURATION = 2700; // 2.7 seconds total
	let animationStartTime: number | null = null;
	let animationId: number | null = null;

	// Session check - only show once per session

	function markPreloaderShown(): void {
		if (typeof window !== 'undefined') {
			sessionStorage.setItem(PRELOADER_SESSION_KEY, 'true');
		}
	}

	// Animation loop using requestAnimationFrame for smooth animation
	function startAnimation(): void {
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
		}
		
		animationStartTime = performance.now();

		function animate(currentTime: number): void {
			if (animationStartTime === null) return;
			
			const elapsed = currentTime - animationStartTime;
			const newProgress = Math.min(elapsed / ANIMATION_DURATION, 1);
			progress = newProgress;

			if (newProgress < 1) {
				animationId = requestAnimationFrame(animate);
			} else {
				// Animation complete
				animationId = null;
				animationStartTime = null;
				handleComplete();
			}
		}

		animationId = requestAnimationFrame(animate);
	}

	function handleComplete(): void {
		markPreloaderShown();
		
		// Small delay before fade out for dramatic effect
		setTimeout(() => {
			isComplete = true;
		}, 300);

		// Fade out duration
		setTimeout(() => {
			isVisible = false;
			onComplete?.();
		}, 800);
	}

	function cleanup(): void {
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
		animationStartTime = null;
	}

	// Start animation on mount
	onMount(() => {
		// Check for reduced motion preference
		if (prefersReducedMotion.current) {
			// Skip glitch animation, just show final text briefly then fade
			const timer = setTimeout(() => {
				handleComplete();
			}, 500);
			return cleanup;
		}

		startAnimation();
		return cleanup;
	});
</script>

{#if isVisible}
	<div
		class="preloader"
		class:complete={isComplete}
		transition:fade={{ duration: 500 }}
	>
		<div class="preloader-content">
			<h1 class="preloader-text" aria-label={TARGET_TEXT}>
				{currentText}
			</h1>
			<div class="preloader-subtitle">
				<span class="loading-dots">
					<span class="dot"></span>
					<span class="dot"></span>
					<span class="dot"></span>
				</span>
			</div>
		</div>

		<!-- Optional: Scanline overlay effect -->
		<div class="scanlines" aria-hidden="true"></div>
	</div>
{/if}

<style>
	.preloader {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #0a0a0a;
		transition: opacity 0.5s ease-out;
	}

	.preloader.complete {
		opacity: 0;
		pointer-events: none;
	}

	.preloader-content {
		text-align: center;
		position: relative;
		z-index: 2;
	}

	.preloader-text {
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
			'Liberation Mono', monospace;
		font-size: clamp(2rem, 8vw, 5rem);
		font-weight: 700;
		color: #fafafa;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		line-height: 1.2;
		
		/* Subtle glow effect */
		text-shadow: 
			0 0 10px rgba(250, 250, 250, 0.3),
			0 0 20px rgba(250, 250, 250, 0.1);
		
		/* Prevent text selection during animation */
		user-select: none;
		-webkit-user-select: none;
	}

	.preloader-subtitle {
		margin-top: 1.5rem;
		opacity: 0.5;
	}

	.loading-dots {
		display: inline-flex;
		gap: 0.5rem;
	}

	.dot {
		width: 0.375rem;
		height: 0.375rem;
		background-color: #fafafa;
		border-radius: 50%;
		animation: pulse 1.4s ease-in-out infinite;
	}

	.dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes pulse {
		0%, 80%, 100% {
			opacity: 0.3;
			transform: scale(0.8);
		}
		40% {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* Scanline overlay for CRT effect */
	.scanlines {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.1) 0px,
			rgba(0, 0, 0, 0.1) 1px,
			transparent 1px,
			transparent 2px
		);
		opacity: 0.4;
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.preloader-text {
			text-shadow: none;
		}

		.dot {
			animation: none;
			opacity: 0.6;
		}

		.scanlines {
			display: none;
		}
	}
</style>
