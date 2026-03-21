/**
 * Creates an IntersectionObserver for scroll-based reveal animations.
 * Adds 'visible' class to elements when they enter the viewport.
 */
export function createScrollObserver(options?: IntersectionObserverInit): IntersectionObserver {
	return new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
				}
			});
		},
		{
			threshold: 0.15,
			rootMargin: '0px 0px -60px 0px',
			...options
		}
	);
}

/**
 * Checks if the user prefers reduced motion.
 * Returns true if prefers-reduced-motion: reduce is set.
 */
export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scrollToSection(sectionId: string) {
	const element = document.getElementById(sectionId);
	if (element) {
		element.scrollIntoView({ behavior: 'smooth' });
	}
}

export function scrollToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function setupIntersectionObserver(callback: (id: string) => void) {
	const sections = ['hero', 'services', 'about', 'contact'];

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					callback(entry.target.id);
				}
			});
		},
		{ threshold: 0.3 }
	);

	sections.forEach((id) => {
		const element = document.getElementById(id);
		if (element) observer.observe(element);
	});

	return () => observer.disconnect();
}
