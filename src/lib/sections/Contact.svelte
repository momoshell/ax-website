<script lang="ts">
	import { onMount } from 'svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { loadContent } from '$lib/content';
	import type { ContactContent } from '$lib/types';

	let content = $state<ContactContent | null>(null);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	onMount(() => {
		loadContent('contact')
			.then((data) => {
				content = data as ContactContent;
				isLoading = false;
			})
			.catch((err) => {
				error = err instanceof Error ? err.message : 'Failed to load contact content';
				isLoading = false;
			});
	});
</script>

<section class="section pt-16 md:pt-20" id="contact">
	<ScrollReveal>
		<div>
			<div class="section-eyebrow sr">CONTACT</div>
			<div class="section-title sr" style="transition-delay: 0.1s">GET IN<br>TOUCH</div>
		</div>
	</ScrollReveal>

	<div class="contact-grid">
		<div>
			<ScrollReveal>
				<div class="contact-block sr" style="transition-delay: 0.2s">
					<div class="contact-label">EMAIL</div>
					<div class="contact-value">
						<a href="mailto:{content?.email || 'hello@axlabs.ai'}">{content?.email || 'hello@axlabs.ai'}</a>
					</div>
				</div>
			</ScrollReveal>
		</div>
		<div>
			<ScrollReveal>
				<div class="contact-block sr" style="transition-delay: 0.25s">
					<div class="contact-label">CONTACTS</div>
					<div class="sr-line" style="transition-delay: 0.3s"></div>
				</div>
			</ScrollReveal>

			<ScrollReveal>
				<div class="contact-block sr" style="transition-delay: 0.3s">
					<div class="contact-label">LINKEDIN</div>
					<div class="contact-value">
						<a href={content?.linkedin || '#'} target="_blank" rel="noopener noreferrer">
							@axlabs <span class="external-icon">↗</span>
						</a>
					</div>
				</div>
			</ScrollReveal>

			<ScrollReveal>
				<div class="contact-block sr" style="transition-delay: 0.35s">
					<div class="contact-label">GITHUB</div>
					<div class="contact-value">
						<a href={content?.github || '#'} target="_blank" rel="noopener noreferrer">
							@axlabs <span class="external-icon">↗</span>
						</a>
					</div>
				</div>
			</ScrollReveal>

			<ScrollReveal>
				<div class="contact-block sr" style="transition-delay: 0.4s">
					<div class="contact-label">LOCATION</div>
					<div class="contact-value">{content?.location || 'Global · Remote-First'}</div>
				</div>
			</ScrollReveal>

			<ScrollReveal>
				<div class="contact-cta sr" style="transition-delay: 0.45s">
					{content?.body || 'Ready to explore how AI can transform your hardware products or operations? We\'d love to hear from you. Reach out and let\'s discuss your challenges, ideas, and goals.'}
				</div>
			</ScrollReveal>
		</div>
	</div>
</section>

<style>
	.section {
		padding: var(--spacing-section) var(--pad);
		max-width: 1400px;
		margin: 0 auto;
	}

	.contact-grid {
		display: grid;
		grid-template-columns: 1fr 1.3fr;
		gap: clamp(40px, 8vw, 120px);
		align-items: start;
		margin-top: 50px;
	}

	.contact-label {
		font-family: var(--font-mono);
		font-size: 0.5rem;
		letter-spacing: 0.45em;
		color: var(--dim);
		text-transform: uppercase;
		margin-bottom: 6px;
	}

	.contact-value {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		letter-spacing: 0.05em;
		color: var(--white);
		font-weight: 500;
	}

	.contact-value a {
		color: var(--white);
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.contact-value a:hover {
		color: var(--mid);
	}

	.external-icon {
		font-size: 0.8em;
	}

	.contact-block {
		margin-bottom: 48px;
	}

	.contact-block .sr-line {
		margin-bottom: 16px;
	}

	.contact-cta {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		line-height: 1.8;
		color: var(--body-text);
		margin-top: 40px;
	}

	@media (max-width: 768px) {
		.contact-grid {
			grid-template-columns: 1fr;
		}

		.section {
			padding: var(--spacing-section) 20px;
		}
	}
</style>
