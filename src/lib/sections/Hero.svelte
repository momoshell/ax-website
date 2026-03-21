<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import ParticleCanvas from '$lib/components/ParticleCanvas.svelte';
	import BinaryRain from '$lib/components/BinaryRain.svelte';
	import HUDCard from '$lib/components/HUDCard.svelte';
	import HUDGrid from '$lib/components/HUDGrid.svelte';

	let revealProgress = $state(0);
	let showBinary = $state(false);
	let showContent = $state(false);
	let titleVisible = $state(false);
	let glitchActive = $state(false);
	let subLabelVisible = $state(false);
	let taglineVisible = $state(false);
	let ctaVisible = $state(false);
	let cornerMarksVisible = $state(false);
	let crosshairVisible = $state(false);
	let hudCardsVisible = $state(false);

	let currentTime = $state('00:00:00');

	function scrollToSection(target: string): void {
		const element = document.getElementById(target);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}

	onMount(() => {
		if (!browser) return;

		// Update clock
		function updateClock() {
			const now = new Date();
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			currentTime = `${hours}:${minutes}:${seconds}`;
		}
		updateClock();
		const clockInterval = setInterval(updateClock, 1000);

		// Start reveal animation sequence
		setTimeout(() => {
			showBinary = true;
		}, 200);

		setTimeout(() => {
			cornerMarksVisible = true;
			crosshairVisible = true;
		}, 600);

		setTimeout(() => {
			revealProgress = 0.15;
		}, 800);

		setTimeout(() => {
			revealProgress = 0.4;
		}, 1200);

		setTimeout(() => {
			revealProgress = 0.7;
		}, 1600);

		setTimeout(() => {
			revealProgress = 1;
			showContent = true;
		}, 1800);

		setTimeout(() => {
			titleVisible = true;
		}, 1900);

		setTimeout(() => {
			glitchActive = true;
		}, 2200);

		setTimeout(() => {
			glitchActive = false;
			subLabelVisible = true;
		}, 2500);

		setTimeout(() => {
			taglineVisible = true;
		}, 2700);

		setTimeout(() => {
			ctaVisible = true;
		}, 2900);

		setTimeout(() => {
			hudCardsVisible = true;
		}, 3000);

		return () => {
			clearInterval(clockInterval);
		};
	});
</script>

<section class="hero" id="hero">
	<!-- Canvas layers (z-index order) -->
	<ParticleCanvas {revealProgress} />
	<BinaryRain visible={showBinary} />
	
	<!-- Grid overlay (z-index: 2) -->
	<div class="grid-overlay"></div>
	
	<!-- Vignette overlay (z-index: 3) -->
	<div class="vignette"></div>
	
	<!-- Scanlines effect (z-index: 4) -->
	<div class="scanlines"></div>
	
	<!-- Noise texture (z-index: 5) -->
	<div class="noise"></div>

	<!-- Corner marks -->
	<div class="corner-mark cm-tl" class:visible={cornerMarksVisible}></div>
	<div class="corner-mark cm-tr" class:visible={cornerMarksVisible}></div>
	<div class="corner-mark cm-bl" class:visible={cornerMarksVisible}></div>
	<div class="corner-mark cm-br" class:visible={cornerMarksVisible}></div>

	<!-- Center crosshair -->
	<div class="crosshair" class:visible={crosshairVisible}></div>

	<!-- HUD Cards -->
	<HUDCard position="tl" label="STATUS" value="ONLINE" slashes="////////////////////////" visible={hudCardsVisible} />
	<HUDCard position="tr" label="TIME" value={currentTime} slashes="////////////////////" visible={hudCardsVisible} />
	<HUDCard position="bl" label="NODE" value="0xAF91.ACTIVE" slashes="////////////////////////" visible={hudCardsVisible} />
	<HUDCard position="br" label="VERSION" value="V2.4.1" slashes="////////////////////" visible={hudCardsVisible} />
	<HUDGrid visible={hudCardsVisible} />

	<!-- Main content (z-index: 10) -->
	<div class="content" class:visible={showContent}>
		<div class="title-wrap">
			<div class="reveal-line"></div>
			<h1 class="title" class:visible={titleVisible}>
				<span class="slash">/</span>A&amp;X LABS
			</h1>
			<div class="title-glitch" class:active={glitchActive} aria-hidden="true">
				<span class="glitch-slash">/</span>A&amp;X LABS
			</div>
		</div>
		
		<div class="sub-label" class:visible={subLabelVisible}>A&amp;X LABS</div>
		<div class="tagline" class:visible={taglineVisible}>ENGINEERING INTEL TSCAVE</div>
		
		<button 
			class="cta" 
			class:visible={ctaVisible}
			onclick={() => scrollToSection('services')}
		>
			EXPLORE OUR WORK <span class="arrow">→</span>
		</button>
	</div>

	<!-- Scroll hint -->
	<div class="scroll-hint">
		<div class="scroll-hint-text">SCROLL</div>
		<div class="scroll-hint-line"></div>
	</div>
</section>

<style>
	/* ═══ HERO ═══ */
	.hero {
		position: relative;
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: var(--background);
	}

	/* Grid overlay (z-index: 2) */
	.grid-overlay {
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none;
		opacity: 0;
		background-image: 
			linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, white, transparent);
		-webkit-mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, white, transparent);
		animation: fadeIn 2s ease forwards;
	}

	@keyframes fadeIn {
		to { opacity: 1; }
	}

	/* Vignette (z-index: 3) */
	.vignette {
		position: absolute;
		inset: 0;
		z-index: 3;
		background: radial-gradient(ellipse 55% 50% at 50% 50%, transparent 0%, rgba(5,5,8,0.3) 45%, rgba(5,5,8,0.94) 100%);
		pointer-events: none;
	}

	/* Scanlines (z-index: 4) */
	.scanlines {
		position: absolute;
		inset: 0;
		z-index: 4;
		pointer-events: none;
		opacity: 0.02;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 2px,
			rgba(255,255,255,0.06) 2px,
			rgba(255,255,255,0.06) 4px
		);
	}

	/* Noise texture (z-index: 5) */
	.noise {
		position: absolute;
		inset: 0;
		z-index: 5;
		pointer-events: none;
		opacity: 0.03;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
		background-size: 128px 128px;
	}

	/* Corner marks */
	.corner-mark {
		position: absolute;
		z-index: 10;
		width: 20px;
		height: 20px;
		opacity: 0;
		transition: opacity 0.6s ease;
	}
	.corner-mark.visible {
		opacity: 1;
	}
	.corner-mark::before,
	.corner-mark::after {
		content: '';
		position: absolute;
		background: rgba(255,255,255,0.15);
	}
	.cm-tl { top: 20px; left: 20px; }
	.cm-tl::before { top: 0; left: 0; width: 1px; height: 100%; }
	.cm-tl::after { top: 0; left: 0; width: 100%; height: 1px; }
	.cm-tr { top: 20px; right: 20px; }
	.cm-tr::before { top: 0; right: 0; width: 1px; height: 100%; }
	.cm-tr::after { top: 0; right: 0; width: 100%; height: 1px; }
	.cm-bl { bottom: 20px; left: 20px; }
	.cm-bl::before { bottom: 0; left: 0; width: 1px; height: 100%; }
	.cm-bl::after { bottom: 0; left: 0; width: 100%; height: 1px; }
	.cm-br { bottom: 20px; right: 20px; }
	.cm-br::before { bottom: 0; right: 0; width: 1px; height: 100%; }
	.cm-br::after { bottom: 0; right: 0; width: 100%; height: 1px; }

	/* Crosshair */
	.crosshair {
		position: absolute;
		z-index: 8;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 40px;
		height: 40px;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.6s ease;
	}
	.crosshair.visible {
		opacity: 1;
	}
	.crosshair::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		height: 1px;
		background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent);
	}
	.crosshair::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		width: 1px;
		height: 100%;
		background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.06), transparent);
	}

	/* Main content (z-index: 10) */
	.content {
		position: relative;
		z-index: 10;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		opacity: 0;
		transition: opacity 0.8s ease;
	}
	.content.visible {
		opacity: 1;
	}

	/* Title animation */
	.title-wrap {
		overflow: hidden;
		position: relative;
	}

	.title {
		font-family: 'Outfit', sans-serif;
		font-weight: 900;
		font-size: clamp(3rem, 8.5vw, 7.5rem);
		letter-spacing: 0.03em;
		line-height: 1;
		color: var(--white);
		opacity: 0;
		transform: translateY(100%);
		transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.title.visible {
		opacity: 1;
		transform: translateY(0);
	}
	.title .slash {
		color: var(--dim);
		font-weight: 300;
		margin-right: 0.02em;
	}

	/* Title glitch effect */
	.title-glitch {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Outfit', sans-serif;
		font-weight: 900;
		font-size: clamp(3rem, 8.5vw, 7.5rem);
		letter-spacing: 0.03em;
		line-height: 1;
		color: var(--white);
		opacity: 0;
		pointer-events: none;
	}
	.title-glitch .glitch-slash {
		color: var(--dim);
		font-weight: 300;
		margin-right: 0.02em;
	}
	.title-glitch.active {
		animation: glitch 0.3s ease;
	}

	@keyframes glitch {
		0%, 100% { opacity: 0; transform: translate(0); }
		20% { opacity: 0.8; transform: translate(-3px, 2px); }
		40% { opacity: 0.6; transform: translate(3px, -2px); }
		60% { opacity: 0.9; transform: translate(-2px, -1px); }
		80% { opacity: 0.7; transform: translate(2px, 1px); }
	}

	/* Reveal line */
	.reveal-line {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--white);
		transform: scaleX(0);
		transform-origin: center;
		z-index: 11;
		box-shadow: 0 0 25px rgba(200,210,230,0.4), 0 0 80px rgba(200,210,230,0.15);
		animation: revealLine 0.6s ease forwards;
		animation-delay: 1.9s;
	}

	@keyframes revealLine {
		to { transform: scaleX(1); }
	}

	/* Sub-label */
	.sub-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.58rem;
		letter-spacing: 0.45em;
		color: var(--dim);
		margin-top: 18px;
		opacity: 0;
		transform: translateY(8px);
		transition: opacity 0.6s ease, transform 0.6s ease;
	}
	.sub-label.visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* Tagline */
	.tagline {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.6rem;
		letter-spacing: 0.5em;
		color: var(--mid);
		margin-top: 8px;
		opacity: 0;
		transform: translateY(8px);
		transition: opacity 0.6s ease, transform 0.6s ease;
	}
	.tagline.visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* CTA Button */
	.cta {
		margin-top: 32px;
		padding: 12px 30px;
		border: 1px solid rgba(255,255,255,0.14);
		background: transparent;
		color: var(--white);
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.58rem;
		letter-spacing: 0.35em;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 12px;
		opacity: 0;
		transform: translateY(8px);
		transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease, transform 0.6s ease;
		position: relative;
		overflow: hidden;
	}
	.cta.visible {
		opacity: 1;
		transform: translateY(0);
	}
	.cta::before {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(255,255,255,0.04);
		transform: translateX(-100%);
		transition: transform 0.5s ease;
	}
	.cta:hover::before {
		transform: translateX(0);
	}
	.cta:hover {
		border-color: rgba(255,255,255,0.35);
		box-shadow: 0 0 40px rgba(200,210,230,0.06);
	}
	.cta .arrow {
		transition: transform 0.3s ease;
		font-size: 0.85rem;
	}
	.cta:hover .arrow {
		transform: translateX(5px);
	}

	/* Scroll hint */
	.scroll-hint {
		position: absolute;
		bottom: 180px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 15;
		opacity: 0;
		animation: scrollHintIn 0.8s ease 3.5s forwards;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.scroll-hint-text {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.45rem;
		letter-spacing: 0.5em;
		color: var(--dim);
	}

	.scroll-hint-line {
		width: 1px;
		height: 30px;
		position: relative;
		overflow: hidden;
	}

	.scroll-hint-line::after {
		content: '';
		position: absolute;
		top: -30px;
		left: 0;
		width: 1px;
		height: 30px;
		background: var(--white);
		animation: scrollLine 1.8s ease-in-out infinite;
	}

	@keyframes scrollHintIn {
		to { opacity: 1; }
	}

	@keyframes scrollLine {
		0% { top: -30px; }
		100% { top: 30px; }
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.corner-mark {
			display: none;
		}
	}
</style>
