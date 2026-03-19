/**
 * Glitch text animation utilities
 * Generates random glitch characters that resolve to target text
 */

/**
 * Characters used for glitch effect
 */
export const GLITCH_CHARS = [
	'▓',
	'▒',
	'░',
	'▚',
	'▞',
	'╱',
	'╲',
	'│',
	'─',
	'█',
	'▄',
	'▀',
	'■',
	'□',
	'▪',
	'▫',
	'◊',
	'○',
	'●',
	'◐',
	'◑',
	'◒',
	'◓',
	'★',
	'☆',
	'◆',
	'◇',
	'▲',
	'△',
	'▼',
	'▽'
];

/**
 * The target text for the preloader
 */
export const TARGET_TEXT = 'A&X LABS';

/**
 * Returns a random glitch character
 */
export function randomGlitchChar(): string {
	return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

/**
 * Generate glitch text based on progress (0-1)
 * 
 * At progress 0: all random characters
 * As progress increases: more characters resolve to the target
 * At progress 1: fully resolved target text
 */
export function generateGlitchText(target: string, progress: number): string {
	if (progress >= 1) {
		return target;
	}

	const result: string[] = [];
	const targetLength = target.length;

	for (let i = 0; i < targetLength; i++) {
		// Each character has its own "threshold" for when it resolves
		// Characters at the start resolve first, characters at the end resolve last
		const charThreshold = i / targetLength;
		const charProgress = (progress - charThreshold) / (1 - charThreshold);

		if (charProgress >= 1 || progress > charThreshold + 0.3) {
			// Character is fully resolved
			result.push(target[i]);
		} else if (charProgress > 0.2 || progress > charThreshold) {
			// Character is partially resolved - show some glitch chars mixed with real char
			if (Math.random() > 0.3) {
				result.push(target[i]);
			} else {
				result.push(randomGlitchChar());
			}
		} else {
			// Character is still in glitch mode
			result.push(randomGlitchChar());
		}
	}

	return result.join('');
}

/**
 * Calculate how many frames needed for the animation
 * Based on 15-20 frames over the animation duration
 */
export function calculateFrames(durationMs: number, fps: number = 15): number {
	return Math.floor((durationMs / 1000) * fps);
}
