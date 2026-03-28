<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { setupCanvas, createAnimationLoop, createResizeHandler, prefersReducedMotion } from '$lib/utils/canvas';

	interface Body {
		cx: number;
		tableY: number;
		totalH: number;
		topY: number;
		profile: number[][];
		breathPhase: number;
		breathRate: number;
	}

	interface BodyParticle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		bi: number;
		r: number;
		a: number;
		init: boolean;
		life: number;
		maxLife: number;
	}

	interface BgParticle {
		x: number;
		y: number;
		vy: number;
		vx: number;
		r: number;
		baseA: number;
		a: number;
	}

	interface AmbParticle {
		x: number;
		y: number;
		vy: number;
		vx: number;
		r: number;
		a: number;
		seed: number;
	}

	interface MatrixDrop {
		y: number;
		char: string;
		trail: number;
		speed: number;
		chars: string[];
	}

	interface MatrixStream {
		x: number;
		drops: MatrixDrop[];
		nextSpawn: number;
		speed: number;
	}

	let canvas: HTMLCanvasElement;
	let mxInit = false;
	let mxCols = 0;
	const mxFS = 11;
	let mxStreams: MatrixStream[] = [];
	let mxFrame = 0;

	function makeBody(cx: number, tableY: number, totalH: number, sw: number): Body {
		return {
			cx,
			tableY,
			totalH,
			topY: tableY - totalH,
			profile: [
				[0.0, 0],
				[0.012, totalH * 0.032],
				[0.035, totalH * 0.05],
				[0.07, totalH * 0.058],
				[0.1, totalH * 0.056],
				[0.13, totalH * 0.048],
				[0.155, totalH * 0.03],
				[0.18, totalH * 0.025],
				[0.22, totalH * 0.08 * sw],
				[0.28, totalH * 0.15 * sw],
				[0.33, totalH * 0.165 * sw],
				[0.4, totalH * 0.155 * sw],
				[0.48, totalH * 0.14 * sw],
				[0.56, totalH * 0.13],
				[0.65, totalH * 0.12],
				[0.75, totalH * 0.115],
				[0.85, totalH * 0.13],
				[0.94, totalH * 0.14],
				[1.0, totalH * 0.15]
			],
			breathPhase: Math.random() * Math.PI * 2,
			breathRate: 0.3 + Math.random() * 0.25
		};
	}

	function getHW(body: Body, ny: number): number {
		const p = body.profile;
		const cny = Math.max(0, Math.min(1, ny));
		for (let i = 0; i < p.length - 1; i++) {
			if (cny >= p[i][0] && cny <= p[i + 1][0]) {
				const t = (cny - p[i][0]) / (p[i + 1][0] - p[i][0]);
				return p[i][1] + (p[i + 1][1] - p[i][1]) * t;
			}
		}
		return p[p.length - 1][1];
	}

	function isInside(body: Body, px: number, py: number, t: number): boolean {
		const ny = (py - body.topY) / body.totalH;
		if (ny < -0.01 || ny > 1.01) return false;
		let hw = getHW(body, ny);
		const breath = Math.sin(t * body.breathRate + body.breathPhase) * 1;
		if (ny > 0.18 && ny < 0.5) hw += breath * (0.5 - ny) * 2.5;
		return Math.abs(px - body.cx) < hw;
	}

	function surfaceDist(body: Body, px: number, py: number, t: number): number {
		const ny = (py - body.topY) / body.totalH;
		if (ny < -0.05 || ny > 1.05) return 999;
		let hw = getHW(body, Math.max(0, Math.min(1, ny)));
		const breath = Math.sin(t * body.breathRate + body.breathPhase) * 1;
		if (ny > 0.18 && ny < 0.5) hw += breath * (0.5 - ny) * 2.5;
		const hDist = Math.abs(px - body.cx) - hw;
		const headTopY = body.topY;
		const vertTop = headTopY - py;
		if (vertTop > 0 && Math.abs(px - body.cx) < getHW(body, 0.05) * 1.5) return vertTop;
		return hDist;
	}

	onMount(() => {
		if (!browser) return;

		if (prefersReducedMotion()) {
			return;
		}

		const ctx = setupCanvas(canvas);
		if (!ctx) return;

		// Extract ctx for closure (TypeScript narrowing)
		const c = ctx;

		let W = canvas.width;
		let H = canvas.height;

		const bodies: Body[] = [];

		function initBodies() {
			bodies.length = 0;
			const tableY = H * 0.88;
			const spacing = W / 5;
			const heights = [0.73, 0.67, 0.71, 0.64];
			const shoulders = [1.0, 0.93, 1.06, 0.96];
			for (let i = 0; i < 4; i++) {
				const cx = spacing * (i + 1) + (Math.random() - 0.5) * spacing * 0.1;
				bodies.push(makeBody(cx, tableY, H * heights[i], shoulders[i]));
			}
		}

		function resize() {
			const rect = canvas.parentElement?.getBoundingClientRect();
			if (!rect) return;
			W = canvas.width = rect.width;
			H = canvas.height = rect.height;
			initBodies();
			mxInit = false;
			mxStreams = [];
		}

		const resizer = createResizeHandler(resize);
		resizer.start();

		// Body particles
		const BODY_P = 1800;
		const bodyPts: BodyParticle[] = [];
		for (let i = 0; i < BODY_P; i++) {
			bodyPts.push({
				x: 0,
				y: 0,
				vx: 0,
				vy: 0,
				bi: i % 4,
				r: Math.random() < 0.1 ? Math.random() * 2 + 1 : Math.random() * 1.1 + 0.2,
				a: 0,
				init: false,
				life: Math.random() * 250,
				maxLife: 150 + Math.random() * 350
			});
		}

		// Background falling particles
		const BG_P = 1200;
		const bgPts: BgParticle[] = [];
		for (let i = 0; i < BG_P; i++) {
			bgPts.push({
				x: Math.random(),
				y: Math.random(),
				vy: 0.08 + Math.random() * 0.45,
				vx: (Math.random() - 0.5) * 0.08,
				r: Math.random() * 1.1 + 0.2,
				baseA: Math.random() * 0.045 + 0.008,
				a: 0
			});
		}

		// Ambient particles
		const AMB_P = 500;
		const ambPts: AmbParticle[] = [];
		for (let i = 0; i < AMB_P; i++) {
			ambPts.push({
				x: Math.random() * 2000,
				y: Math.random() * 1200,
				vy: 0.15 + Math.random() * 0.35,
				vx: (Math.random() - 0.5) * 0.06,
				r: Math.random() * 0.9 + 0.2,
				a: Math.random() * 0.04 + 0.01,
				seed: Math.random() * Math.PI * 2
			});
		}

		function drawMatrixRain() {
			if (!mxInit) {
				mxCols = Math.floor(W / mxFS);
				mxStreams = [];
				for (let i = 0; i < mxCols; i++) {
					mxStreams.push({
						x: i * mxFS,
						drops: [],
						nextSpawn: Math.random() * 60,
						speed: 0.3 + Math.random() * 0.5
					});
				}
				mxInit = true;
				mxFrame = 0;
			}
			mxFrame++;

			if (mxStreams.length > 0 && mxStreams[0].x > W) {
				mxInit = false;
				return;
			}

			c.font = mxFS + 'px "IBM Plex Mono", monospace';

			mxStreams.forEach((stream) => {
				stream.nextSpawn--;
				if (stream.nextSpawn <= 0) {
					stream.drops.push({
						y: -mxFS,
						char: Math.random() > 0.5 ? '1' : '0',
						trail: Math.floor(8 + Math.random() * 18),
						speed: stream.speed * (0.8 + Math.random() * 0.4),
						chars: []
					});
					const d = stream.drops[stream.drops.length - 1];
					for (let t = 0; t < d.trail; t++) {
						d.chars.push(Math.random() > 0.5 ? '1' : '0');
					}
					stream.nextSpawn = 15 + Math.random() * 80;
				}

				stream.drops.forEach((drop) => {
					drop.y += drop.speed;

					if (Math.random() < 0.03) {
						drop.char = Math.random() > 0.5 ? '1' : '0';
					}
					if (Math.random() < 0.02) {
						const idx = Math.floor(Math.random() * drop.chars.length);
						drop.chars[idx] = Math.random() > 0.5 ? '1' : '0';
					}

					c.fillStyle = 'rgba(120,135,165,0.08)';
					c.fillText(drop.char, stream.x, drop.y);

					for (let t = 1; t <= drop.trail; t++) {
						const ty = drop.y - t * mxFS;
						if (ty < -mxFS) continue;
						const fade = 1 - t / drop.trail;
						const alpha = fade * fade * 0.05;
						c.fillStyle = 'rgba(90,105,140,' + alpha + ')';
						c.fillText(drop.chars[t % drop.chars.length], stream.x, ty);
					}
				});

				stream.drops = stream.drops.filter((d) => d.y - d.trail * mxFS < H + 20);
			});
		}

		function drawBgParticles(t: number) {
			bgPts.forEach((bp) => {
				bp.y += (bp.vy / H) * 0.7;
				bp.x += (bp.vx / W) * 0.2 + Math.sin(t * 0.25 + bp.y * 4) * 0.0002;
				if (bp.y > 1.05) {
					bp.y = -0.03;
					bp.x = Math.random();
				}
				if (bp.x < -0.02) bp.x = 1.02;
				if (bp.x > 1.02) bp.x = -0.02;
				const px = bp.x * W;
				const py = bp.y * H;
				let nearFig = false;
				for (const body of bodies) {
					if (isInside(body, px, py, t)) {
						const side = px < body.cx ? -1 : 1;
						bp.x += side * 0.004;
						bp.vy *= 0.92;
						nearFig = true;
						break;
					}
					const sd = surfaceDist(body, px, py, t);
					if (sd < 35) {
						bp.a = bp.baseA + (1 - sd / 35) * 0.1;
						nearFig = true;
					}
				}
				if (!nearFig) bp.a = bp.baseA;
				c.beginPath();
				c.arc(px, py, bp.r, 0, Math.PI * 2);
				c.fillStyle = `rgba(140,150,180,${bp.a})`;
				c.fill();
			});
		}

		function drawBacklight() {
			bodies.forEach((b) => {
				const grad = c.createRadialGradient(
					b.cx,
					b.topY + b.totalH * 0.28,
					0,
					b.cx,
					b.topY + b.totalH * 0.28,
					b.totalH * 0.42
				);
				grad.addColorStop(0, 'rgba(115,135,180,0.025)');
				grad.addColorStop(1, 'transparent');
				c.fillStyle = grad;
				c.fillRect(b.cx - b.totalH * 0.5, b.topY - 15, b.totalH, b.totalH + 20);
			});
		}

		function drawTable() {
			if (bodies.length === 0) return;

			const tY = bodies[0].tableY;
			c.strokeStyle = 'rgba(255,255,255,0.03)';
			c.lineWidth = 0.5;
			c.beginPath();
			c.moveTo(0, tY);
			c.lineTo(W, tY);
			c.stroke();
		}

		function drawBodyParticles(t: number) {
			bodyPts.forEach((pt) => {
				if (pt.bi >= bodies.length) return;
				const body = bodies[pt.bi];

				if (!pt.init || pt.life > pt.maxLife) {
					const ny = Math.random();
					const hw = getHW(body, ny);
					if (ny < 0.025) {
						pt.x = body.cx + (Math.random() - 0.5) * hw * 2.5;
						pt.y = body.topY - Math.random() * 8;
					} else {
						const side = Math.random() > 0.5 ? 1 : -1;
						pt.x = body.cx + side * (hw + Math.random() * 5 - 0.5);
						pt.y = body.topY + ny * body.totalH;
					}
					pt.vx = (Math.random() - 0.5) * 0.45;
					pt.vy = (Math.random() - 0.5) * 0.35;
					pt.life = 0;
					pt.init = true;
				}

				pt.vy += 0.0012;
				pt.vx += (body.cx - pt.x) * 0.00005;
				pt.vy += (body.topY + body.totalH * 0.38 - pt.y) * 0.00001;

				const nx = pt.x + pt.vx;
				const ny2 = pt.y + pt.vy;
				if (isInside(body, nx, ny2, t)) {
					const dx = pt.x - body.cx;
					const bny = (pt.y - body.topY) / body.totalH;
					if (bny < 0.035) {
						pt.vy = -(Math.abs(pt.vy) + 0.08 + Math.random() * 0.25);
						pt.vx += (Math.random() - 0.5) * 0.25;
						pt.y -= 1.2;
					} else {
						const norm = dx !== 0 ? (dx > 0 ? 1 : -1) : Math.random() > 0.5 ? 1 : -1;
						pt.vx = norm * (Math.abs(pt.vx) + 0.1 + Math.random() * 0.3);
						pt.vy *= -0.12 + (Math.random() - 0.5) * 0.35;
						pt.x += norm * 1.2;
					}
				}

				pt.vx *= 0.988;
				pt.vy *= 0.988;
				pt.x += pt.vx;
				pt.y += pt.vy;
				pt.life++;

				if (pt.y > H + 10 || pt.y < -35 || pt.x < -50 || pt.x > W + 50) {
					pt.init = false;
					return;
				}

				const dist = surfaceDist(body, pt.x, pt.y, t);
				if (dist < 0) pt.a = 0.03;
				else if (dist < 4) pt.a = 0.5 + Math.random() * 0.3;
				else if (dist < 16) pt.a = 0.5 * (1 - (dist - 4) / 12);
				else if (dist < 40) pt.a = 0.1 * (1 - (dist - 16) / 24);
				else pt.a = 0.01;
				if (pt.life > pt.maxLife * 0.8)
					pt.a *= 1 - (pt.life - pt.maxLife * 0.8) / (pt.maxLife * 0.2);
			});
		}

		function drawConnections() {
			for (let i = 0; i < bodyPts.length; i++) {
				const pi = bodyPts[i];
				if (!pi.init || pi.a < 0.04) continue;
				for (let j = i + 1; j < Math.min(i + 12, bodyPts.length); j++) {
					const pj = bodyPts[j];
					if (!pj.init || pj.bi !== pi.bi || pj.a < 0.04) continue;
					const dx = pi.x - pj.x;
					const dy = pi.y - pj.y;
					const d2 = dx * dx + dy * dy;
					if (d2 < 484) {
						const d = Math.sqrt(d2);
						c.beginPath();
						c.moveTo(pi.x, pi.y);
						c.lineTo(pj.x, pj.y);
						c.strokeStyle = `rgba(150,165,200,${(1 - d / 22) * Math.min(pi.a, pj.a) * 0.4})`;
						c.lineWidth = 0.35;
						c.stroke();
					}
				}
			}
		}

		function drawBodyParticlesOnCanvas() {
			bodyPts.forEach((pt) => {
				if (!pt.init || pt.a < 0.008) return;
				c.beginPath();
				c.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
				c.fillStyle = `rgba(185,198,222,${pt.a})`;
				c.fill();
				if (pt.a > 0.28 && pt.r > 0.7) {
					c.beginPath();
					c.arc(pt.x, pt.y, pt.r * 3, 0, Math.PI * 2);
					c.fillStyle = `rgba(150,168,208,${pt.a * 0.05})`;
					c.fill();
				}
			});
		}

		function drawReflection() {
			if (bodies.length === 0) return;

			const tY = bodies[0].tableY;
			c.save();
			c.globalAlpha = 0.04;
			c.translate(0, tY * 2);
			c.scale(1, -1);
			bodyPts.forEach((pt) => {
				if (!pt.init || pt.a < 0.12 || pt.y < tY - 50) return;
				c.beginPath();
				c.arc(pt.x, pt.y, pt.r * 0.6, 0, Math.PI * 2);
				c.fillStyle = `rgba(165,180,210,${pt.a * 0.35})`;
				c.fill();
			});
			c.restore();
		}

		function drawAmbientParticles(t: number) {
			ambPts.forEach((ap) => {
				ap.y += ap.vy;
				ap.x += ap.vx + Math.sin(t * 0.2 + ap.seed) * 0.02;
				if (ap.y > H + 5) {
					ap.y = -3;
					ap.x = Math.random() * W;
				}
				if (ap.x < -5) ap.x = W + 5;
				if (ap.x > W + 5) ap.x = -5;
				c.beginPath();
				c.arc(ap.x, ap.y, ap.r, 0, Math.PI * 2);
				c.fillStyle = `rgba(100,110,140,${ap.a})`;
				c.fill();
			});
		}

		function drawCorners() {
			const m = 12;
			c.strokeStyle = 'rgba(255,255,255,0.05)';
			c.lineWidth = 0.5;
			[
				[m, m, 1, 1],
				[W - m, m, -1, 1],
				[m, H - m, 1, -1],
				[W - m, H - m, -1, -1]
			].forEach(([x, y, dx, dy]) => {
				c.beginPath();
				c.moveTo(x, y);
				c.lineTo(x + dx * 10, y);
				c.stroke();
				c.beginPath();
				c.moveTo(x, y);
				c.lineTo(x, y + dy * 10);
				c.stroke();
			});
		}

		const anim = createAnimationLoop((ts: number) => {
			const t = ts * 0.001;

			c.clearRect(0, 0, W, H);

			// Matrix rain background
			drawMatrixRain();

			// Background falling particles
			drawBgParticles(t);

			// Backlight
			drawBacklight();

			// Table
			drawTable();

			// Body particles
			drawBodyParticles(t);

			// Connections
			drawConnections();

			// Draw body particles
			drawBodyParticlesOnCanvas();

			// Reflection
			drawReflection();

			// Ambient particles
			drawAmbientParticles(t);

			// Corners
			drawCorners();
		});

		anim.start();

		return () => {
			anim.stop();
			resizer.stop();
		};
	});
</script>

<canvas bind:this={canvas} class="about-visual-canvas" aria-label="Animated geometric visualization"></canvas>

<style>
	.about-visual-canvas {
		width: 100%;
		height: 100%;
		position: absolute;
		inset: 0;
	}
</style>
