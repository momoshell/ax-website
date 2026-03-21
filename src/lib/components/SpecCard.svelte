<script lang="ts">
	import SpecDiagram from './SpecDiagram.svelte';

	type DiagramShape = 'neural' | 'circuit' | 'arch' | 'radar';

	interface Meta {
		type: string;
		status: string;
		ref: string;
	}

	interface Props {
		number: string;
		codename: string;
		title: string;
		description: string;
		diagramShape: DiagramShape;
		meta: Meta;
	}

	let { number, codename, title, description, diagramShape, meta }: Props = $props();

	// Generate slashes for decoration
	const slashes = '////////////////////////////';
	const codenameSlashes = '////////';
</script>

<div class="spec-card">
	<div class="bracket-bl"></div>
	<div class="bracket-br"></div>
	<div class="spec-number">{number}</div>

	<div class="spec-header">
		<div>
			<div class="spec-codename">
				CODENAME <span class="spec-slashes-fixed">{codenameSlashes}</span>
			</div>
			<div class="spec-id">{codename}</div>
		</div>
		<div class="spec-slashes-overflow">{slashes}</div>
	</div>

	<div class="spec-body">
		<div class="spec-diagram">
			<SpecDiagram shape={diagramShape} />
			<div class="spec-crosshair"></div>
		</div>
		<div class="spec-content">
			<div class="spec-title">{title}</div>
			<div class="spec-desc">{description}</div>
		</div>
	</div>

	<div class="spec-footer">
		<div class="spec-meta">
			<div class="spec-meta-label">TYPE</div>
			<div class="spec-meta-value">{meta.type}</div>
		</div>
		<div class="spec-meta">
			<div class="spec-meta-label">STATUS</div>
			<div class="spec-meta-value">{meta.status}</div>
		</div>
		<div class="spec-meta">
			<div class="spec-meta-label">REF</div>
			<div class="spec-meta-value">{meta.ref}</div>
		</div>
	</div>
</div>

<style>
	.spec-card {
		border: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(255, 255, 255, 0.015);
		position: relative;
		padding: 0;
	}

	/* Corner brackets */
	.spec-card::before,
	.spec-card::after {
		content: '';
		position: absolute;
		width: 10px;
		height: 10px;
		border-color: rgba(255, 255, 255, 0.18);
		border-style: solid;
		z-index: 2;
	}

	.spec-card::before {
		top: -1px;
		left: -1px;
		border-width: 1px 0 0 1px;
	}

	.spec-card::after {
		top: -1px;
		right: -1px;
		border-width: 1px 1px 0 0;
	}

	.bracket-bl,
	.bracket-br {
		position: absolute;
		width: 10px;
		height: 10px;
		border-color: rgba(255, 255, 255, 0.18);
		border-style: solid;
		z-index: 2;
	}

	.bracket-bl {
		bottom: -1px;
		left: -1px;
		border-width: 0 0 1px 1px;
	}

	.bracket-br {
		bottom: -1px;
		right: -1px;
		border-width: 0 1px 1px 0;
	}

	/* Card header row */
	.spec-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 16px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		gap: 12px;
	}

	.spec-codename {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.42rem;
		letter-spacing: 0.4em;
		color: var(--color-dim, #6b7280);
		text-transform: uppercase;
	}

	.spec-id {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.65rem;
		letter-spacing: 0.15em;
		color: var(--color-white, #ffffff);
		font-weight: 600;
	}

	.spec-slashes-fixed {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.35rem;
		color: rgba(255, 255, 255, 0.07);
		letter-spacing: 0.05em;
	}

	.spec-slashes-overflow {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.35rem;
		color: rgba(255, 255, 255, 0.07);
		letter-spacing: 0.05em;
		flex: 1;
		text-align: right;
		overflow: hidden;
		white-space: nowrap;
	}

	/* Card body */
	.spec-body {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0;
		min-height: 140px;
	}

	/* Geometric diagram area */
	.spec-diagram {
		width: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-right: 1px solid rgba(255, 255, 255, 0.04);
		padding: 16px;
		position: relative;
	}

	/* Content area */
	.spec-content {
		padding: 16px 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 10px;
	}

	.spec-title {
		font-family: 'Outfit', sans-serif;
		font-weight: 700;
		font-size: 0.8rem;
		letter-spacing: 0.35em;
		color: var(--color-white, #ffffff);
		text-transform: uppercase;
	}

	.spec-desc {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		line-height: 1.75;
		color: var(--color-body-text, #9ca3af);
		letter-spacing: 0.01em;
	}

	/* Card footer with data points */
	.spec-footer {
		display: flex;
		border-top: 1px solid rgba(255, 255, 255, 0.04);
		font-family: 'IBM Plex Mono', monospace;
	}

	.spec-meta {
		padding: 8px 16px;
		border-right: 1px solid rgba(255, 255, 255, 0.04);
		flex: 1;
	}

	.spec-meta:last-child {
		border-right: none;
	}

	.spec-meta-label {
		font-size: 0.35rem;
		letter-spacing: 0.4em;
		color: var(--color-dim, #6b7280);
		margin-bottom: 2px;
		text-transform: uppercase;
	}

	.spec-meta-value {
		font-size: 0.55rem;
		letter-spacing: 0.15em;
		color: var(--color-mid, #9ca3af);
		font-weight: 500;
	}

	/* Number markers */
	.spec-number {
		position: absolute;
		top: 10px;
		right: 16px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 1.4rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.04);
		letter-spacing: 0.05em;
		z-index: 1;
		line-height: 1;
	}

	/* Crosshair on diagram */
	.spec-crosshair {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 30px;
		height: 30px;
		pointer-events: none;
	}

	.spec-crosshair::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		height: 1px;
		background: rgba(255, 255, 255, 0.02);
	}

	.spec-crosshair::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		width: 1px;
		height: 100%;
		background: rgba(255, 255, 255, 0.02);
	}
</style>
