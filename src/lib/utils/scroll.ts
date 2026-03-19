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
