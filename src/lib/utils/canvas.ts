/**
 * Shared canvas utility functions for canvas-based components.
 * Provides thin wrappers to reduce boilerplate for common patterns.
 */

import { prefersReducedMotion } from './scroll';

export { prefersReducedMotion };

/**
 * Sets up a 2D canvas context with null safety.
 * Returns null if canvas is null or context cannot be obtained.
 */
export function setupCanvas(canvas: HTMLCanvasElement | null): CanvasRenderingContext2D | null {
	if (!canvas) return null;
	return canvas.getContext('2d');
}

/**
 * Creates an animation loop with proper start/stop controls.
 * The callback receives the timestamp from requestAnimationFrame.
 */
export function createAnimationLoop(callback: (timestamp: number) => void): {
	start: () => void;
	stop: () => void;
} {
	let animationId: number | null = null;
	let running = false;

	function tick(timestamp: number) {
		if (!running) return;
		callback(timestamp);
		animationId = requestAnimationFrame(tick);
	}

	return {
		start() {
			if (running) return;
			running = true;
			animationId = requestAnimationFrame(tick);
		},
		stop() {
			running = false;
			if (animationId !== null) {
				cancelAnimationFrame(animationId);
				animationId = null;
			}
		}
	};
}

/**
 * Creates a resize event listener with proper cleanup.
 * Calls the callback immediately when started, then on each resize event.
 */
export function createResizeHandler(callback: () => void): {
	start: () => void;
	stop: () => void;
} {
	let handler: (() => void) | null = null;

	return {
		start() {
			if (handler) return;
			handler = () => {
				callback();
			};
			window.addEventListener('resize', handler);
			callback();
		},
		stop() {
			if (handler) {
				window.removeEventListener('resize', handler);
				handler = null;
			}
		}
	};
}
