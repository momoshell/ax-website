export interface TimelineAction {
	delay: number;
	action: () => void;
}

export function runTimeline(actions: TimelineAction[]): () => void {
	const timeouts: ReturnType<typeof setTimeout>[] = [];

	for (const { delay, action } of actions) {
		timeouts.push(setTimeout(action, delay));
	}

	return () => {
		for (const t of timeouts) {
			clearTimeout(t);
		}
	};
}
