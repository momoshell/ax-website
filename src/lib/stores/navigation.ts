import { writable } from 'svelte/store';

export const activeSection = writable<string>('hero');

export function updateActiveSection(sectionId: string) {
	activeSection.set(sectionId);
}
