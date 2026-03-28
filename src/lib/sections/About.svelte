<script lang="ts">
	import { onMount } from 'svelte';
	import Section from '$lib/components/Section.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import AboutVisual from '$lib/components/AboutVisual.svelte';
	import AboutBarcode from '$lib/components/AboutBarcode.svelte';
	import SlashDecor from '$lib/components/ui/SlashDecor.svelte';
	import { loadContent } from '$lib/content';
	import type { AboutContent } from '$lib/types';

	let content = $state<AboutContent | null>(null);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	onMount(() => {
		let animId: number | null = null;

		loadContent('about')
			.then((data) => {
				content = data as AboutContent;
				isLoading = false;
			})
			.catch((err) => {
				error = err instanceof Error ? err.message : 'Failed to load about content';
				isLoading = false;
			});

		// Starburst animation
		setTimeout(() => {
			const sc = document.getElementById('aboutBarStarburst') as HTMLCanvasElement | null;
			if (sc) {
				const ctx = sc.getContext('2d');
				if (ctx) {
					const S = 80, C = 40;
					const localCtx = ctx;
					function drawStar() {
						localCtx.clearRect(0, 0, S, S);
						const t = performance.now() * 0.001;
						localCtx.strokeStyle = 'rgba(200,210,225,0.35)';
						localCtx.lineWidth = 0.6;
						const n = 10;
						for (let i = 0; i < n; i++) {
							const a = (Math.PI * 2 / n) * i + t * 0.2;
							localCtx.beginPath();
							localCtx.moveTo(C, C);
							localCtx.lineTo(C + Math.cos(a) * 32, C + Math.sin(a) * 32);
							localCtx.stroke();
							localCtx.beginPath();
							localCtx.arc(C + Math.cos(a) * 32, C + Math.sin(a) * 32, 1.5, 0, Math.PI * 2);
							localCtx.fillStyle = 'rgba(200,210,225,0.3)';
							localCtx.fill();
						}
						localCtx.beginPath();
						localCtx.arc(C, C, 3, 0, Math.PI * 2);
						localCtx.fillStyle = 'rgba(200,210,225,0.5)';
						localCtx.fill();
						animId = requestAnimationFrame(drawStar);
					}
					drawStar();
				}
			}
		}, 100);

		return () => {
			if (animId) cancelAnimationFrame(animId);
		};
	});
</script>

<Section id="about" class="pt-16 md:pt-20">
	<div class="max-w-6xl mx-auto px-6 mb-12">
		<p class="section-label mb-6">About</p>
	</div>

	{#if isLoading}
		<div class="about-wrapper max-w-6xl mx-auto">
			<div class="about-loading">
				<div class="w-32 h-3 bg-surface animate-pulse mb-4"></div>
				<div class="w-48 h-12 bg-surface animate-pulse mb-8"></div>
				<div class="space-y-4">
					<div class="h-4 bg-surface w-full animate-pulse"></div>
					<div class="h-4 bg-surface w-full animate-pulse"></div>
					<div class="h-4 bg-surface w-2/3 animate-pulse"></div>
				</div>
			</div>
		</div>
	{:else if error}
		<div class="max-w-6xl mx-auto px-6">
			<p class="body-text text-center">Unable to load about content</p>
		</div>
	{:else if content}
		<ScrollReveal>
			<div class="about-wrapper max-w-6xl mx-auto">
				<!-- Corner brackets -->
				<div class="about-bracket-bl"></div>
				<div class="about-bracket-br"></div>

				<!-- Registration dots at border intersections -->
				<div class="reg-dot rd-tl"></div>
				<div class="reg-dot rd-tr"></div>
				<div class="reg-dot rd-bl"></div>
				<div class="reg-dot rd-br"></div>
				<div class="reg-dot rd-tc"></div>
				<div class="reg-dot rd-bc"></div>

				<!-- Side letter markers -->
				<div class="about-markers">
					<span>F</span>
					<span>E</span>
					<span>D</span>
					<span>C</span>
					<span>B</span>
					<span>A</span>
				</div>

				<!-- Main split: text | visual -->
				<div class="about-main">
					<div class="about-left">
						<ScrollReveal>
							<div class="about-slash-title">
								<span>/</span>about
							</div>
						</ScrollReveal>
						<ScrollReveal>
							<div class="about-body">
								<p>A&X Labs is an engineering consultancy specializing in the intersection of artificial intelligence and hardware systems. The team has adopted a progressive concept with the addition of scientific elements since the inception of our practice.</p>
								<p>Founded by engineers with backgrounds in robotics, machine learning, and embedded systems, we help companies navigate the complex landscape of AI integration. Our approach combines rigorous engineering principles with cutting-edge research.</p>
								<p>We don't just build models—we build systems that work in the real world, under real constraints, delivering real value. Whether you're looking to add intelligence to existing hardware, develop new AI-powered products, or understand how AI can transform your operations, we provide the expertise to make it happen.</p>
							</div>
						</ScrollReveal>
					</div>

					<div class="about-right">
						<AboutVisual />
					</div>
				</div>

				<!-- Founder row -->
				<div class="about-founder-row">
					<div class="reg-dot rd-fl"></div>
					<div class="reg-dot rd-fr"></div>
					<div class="reg-dot rd-fc"></div>
					<ScrollReveal>
						<div class="about-founder">
							<div class="about-founder-label">
								FOUNDER <SlashDecor count={50} class="sl" />
							</div>
							<div class="about-founder-name">A&X LABS</div>
						</div>
					</ScrollReveal>
					<a href="#contact" class="about-contact-btn">
						Contact <span class="arrow-icon">↗</span>
					</a>
				</div>

				<!-- Bottom data bar -->
				<div class="about-data-bar">
					<div class="reg-dot rd-dl"></div>
					<div class="reg-dot rd-dr"></div>
					<ScrollReveal>
						<div class="about-data-starburst">
							<div class="starburst-barcode-wrap">
								<canvas id="aboutBarStarburst" width="80" height="80"></canvas>
								<AboutBarcode />
							</div>
							<div class="barcode-label">A&X LABS</div>
						</div>
					</ScrollReveal>
					<ScrollReveal>
						<div class="about-data-cell">
							<div class="about-data-label">
								COMPANY <SlashDecor count={11} class="sl" />
							</div>
							<div class="about-data-value">A&X.LABS.ENGINEERING</div>
							<div class="mt-4">
								<div class="about-data-label">
									DESIGNER <SlashDecor count={10} class="sl" />
								</div>
								<div class="about-data-value">C'TAN</div>
							</div>
						</div>
					</ScrollReveal>
					<ScrollReveal>
						<div class="about-data-cell">
							<div class="about-data-label">
								DESCRIPTION <SlashDecor count={58} class="sl" />
							</div>
							<div class="about-data-value about-data-desc">
								A&X Labs has adopted a progressive concept with the addition of scientific elements since the inception of our practice. Our approach uses future-ready engineering as the major idea.
							</div>
						</div>
					</ScrollReveal>
					<ScrollReveal>
						<div class="about-data-cell">
							<div class="about-data-label">
								NOTE <SlashDecor count={15} class="sl" />
							</div>
							<div class="about-data-value about-data-note">
								CONTENTS OF THIS WEBSITE ARE THE PROPERTY OF A&X LABS. ALL RIGHTS RESERVED. © 2026.
							</div>
						</div>
					</ScrollReveal>
				</div>
			</div>
		</ScrollReveal>
	{/if}
</Section>

<style>
	/* ═══ ABOUT — IP Axis Blueprint Style ═══ */
	:global(.about-section) {
		padding: 0;
	}

	.about-wrapper {
		border: 1px solid rgba(255, 255, 255, 0.06);
		position: relative;
	}

	/* Corner brackets on about wrapper */
	.about-wrapper::before,
	.about-wrapper::after {
		content: '';
		position: absolute;
		width: 12px;
		height: 12px;
		border-color: rgba(255, 255, 255, 0.2);
		border-style: solid;
		z-index: 2;
	}

	.about-wrapper::before {
		top: -1px;
		left: -1px;
		border-width: 1px 0 0 1px;
	}

	.about-wrapper::after {
		top: -1px;
		right: -1px;
		border-width: 1px 1px 0 0;
	}

	.about-bracket-bl,
	.about-bracket-br {
		position: absolute;
		width: 12px;
		height: 12px;
		border-color: rgba(255, 255, 255, 0.2);
		border-style: solid;
		z-index: 2;
	}

	.about-bracket-bl {
		bottom: -1px;
		left: -1px;
		border-width: 0 0 1px 1px;
	}

	.about-bracket-br {
		bottom: -1px;
		right: -1px;
		border-width: 0 1px 1px 0;
	}

	/* Registration dots at intersections */
	.reg-dot {
		position: absolute;
		width: 5px;
		height: 5px;
		background: rgba(255, 255, 255, 0.35);
		z-index: 3;
		pointer-events: none;
	}

	/* Outer corners */
	.reg-dot.rd-tl {
		top: -3px;
		left: -3px;
	}

	.reg-dot.rd-tr {
		top: -3px;
		right: -3px;
	}

	.reg-dot.rd-bl {
		bottom: -3px;
		left: -3px;
	}

	.reg-dot.rd-br {
		bottom: -3px;
		right: -3px;
	}

	/* Mid-column intersection */
	.reg-dot.rd-tc {
		top: -3px;
		left: calc(50% - 2px);
	}

	.reg-dot.rd-bc {
		bottom: -3px;
		left: calc(50% - 2px);
	}

	/* Founder row intersection dots */
	.reg-dot.rd-fl {
		top: -3px;
		left: -3px;
	}

	.reg-dot.rd-fr {
		top: -3px;
		right: -3px;
	}

	.reg-dot.rd-fc {
		top: -3px;
		left: calc(50% - 2px);
	}

	/* Data bar top intersection */
	.reg-dot.rd-dl {
		top: -3px;
		left: -3px;
	}

	.reg-dot.rd-dr {
		top: -3px;
		right: -3px;
	}

	/* Side letter markers */
	.about-markers {
		position: absolute;
		left: -28px;
		top: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20px 0;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.4rem;
		letter-spacing: 0.2em;
		color: rgba(255, 255, 255, 0.1);
	}

	.about-main {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: 500px;
	}

	/* Left: text content */
	.about-left {
		padding: clamp(30px, 4vw, 50px);
		border-right: 1px solid rgba(255, 255, 255, 0.05);
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.about-slash-title {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(2.8rem, 5vw, 4.5rem);
		letter-spacing: 0.02em;
		line-height: 1;
		color: var(--white);
		margin-bottom: 30px;
	}

	.about-slash-title span {
		color: var(--dim);
		font-weight: 300;
	}

	.about-body {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.78rem;
		line-height: 1.85;
		color: var(--body-text);
		letter-spacing: 0.01em;
	}

	.about-body p {
		margin-bottom: 20px;
	}

	.about-body p:last-child {
		margin-bottom: 0;
	}

	/* Right: animated visual area */
	.about-right {
		position: relative;
		background: rgba(255, 255, 255, 0.01);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Founder row */
	.about-founder-row {
		display: grid;
		grid-template-columns: 1fr auto;
		border-top: 1px solid rgba(255, 255, 255, 0.05);
		position: relative;
	}

	.about-founder {
		padding: 16px clamp(30px, 4vw, 50px);
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.about-founder-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.38rem;
		letter-spacing: 0.45em;
		color: var(--dim);
		text-transform: uppercase;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.about-founder-label :global(.slash-decor.sl) {
		font-size: 0.35rem;
	}

	.about-founder-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.2rem;
		letter-spacing: 0.12em;
		color: var(--white);
	}

	.about-contact-btn {
		border-left: 1px solid rgba(255, 255, 255, 0.05);
		padding: 16px 30px;
		display: flex;
		align-items: center;
		gap: 12px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.85rem;
		color: var(--white);
		letter-spacing: 0.05em;
		text-decoration: none;
		transition: background 0.3s ease;
		cursor: pointer;
	}

	.about-contact-btn:hover {
		background: rgba(255, 255, 255, 0.03);
	}

	.about-contact-btn .arrow-icon {
		font-size: 1.1rem;
		transition: transform 0.3s ease;
	}

	.about-contact-btn:hover .arrow-icon {
		transform: translate(2px, -2px);
	}

	/* Bottom data bar */
	.about-data-bar {
		display: grid;
		grid-template-columns: auto auto 1fr 1fr;
		border-top: 1px solid rgba(255, 255, 255, 0.05);
		font-family: 'IBM Plex Mono', monospace;
		position: relative;
	}

	.about-data-cell {
		padding: 10px clamp(14px, 2vw, 20px);
		border-right: 1px solid rgba(255, 255, 255, 0.04);
	}

	.about-data-cell:last-child {
		border-right: none;
	}

	.about-data-label {
		font-size: 0.35rem;
		letter-spacing: 0.4em;
		color: var(--dim);
		margin-bottom: 2px;
		display: flex;
		align-items: center;
		gap: 6px;
		text-transform: uppercase;
	}

	.about-data-label :global(.slash-decor.sl) {
		font-size: 0.33rem;
	}

	.about-data-value {
		font-size: 0.55rem;
		letter-spacing: 0.12em;
		color: var(--mid);
		font-weight: 500;
	}

	.about-data-starburst {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		padding: 8px 14px;
		border-right: 1px solid rgba(255, 255, 255, 0.04);
	}

	.starburst-barcode-wrap {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	#aboutBarStarburst {
		display: block;
		width: 40px;
		height: 40px;
		flex-shrink: 0;
	}

	.barcode-label {
		font-size: 0.42rem;
		letter-spacing: 0.25em;
		color: var(--dim);
		margin-top: 4px;
		font-family: 'IBM Plex Mono', monospace;
	}

	.about-data-desc {
		font-size: 0.45rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.25);
		max-width: 400px;
	}

	.about-data-note {
		font-size: 0.42rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.18);
		max-width: 280px;
	}

	/* Loading state */
	.about-loading {
		padding: 50px;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.about-main {
			grid-template-columns: 1fr;
		}

		.about-left {
			border-right: none;
			border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		}

		.about-right {
			min-height: 350px;
		}

		.about-founder-row {
			grid-template-columns: 1fr;
		}

		.about-contact-btn {
			border-left: none;
			border-top: 1px solid rgba(255, 255, 255, 0.05);
			justify-content: center;
		}

		.about-data-bar {
			grid-template-columns: 1fr;
		}

		.about-data-starburst {
			border-right: none;
			border-bottom: 1px solid rgba(255, 255, 255, 0.04);
		}

		.about-data-cell {
			border-right: none;
			border-bottom: 1px solid rgba(255, 255, 255, 0.04);
		}

		.about-data-cell:last-child {
			border-bottom: none;
		}

		.about-markers {
			display: none;
		}
	}
</style>
