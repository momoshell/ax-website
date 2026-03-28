<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { setupCanvas, createAnimationLoop, createResizeHandler, prefersReducedMotion } from '$lib/utils/canvas';

	interface Props {
		revealProgress?: number;
	}

	let { revealProgress = 0 }: Props = $props();

	let canvas: HTMLCanvasElement;

	interface ParticleTarget {
		x: number;
		y: number;
		g: string;
	}

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		br: number;
		r: number;
		ba: number;
		a: number;
		t: ParticleTarget | null;
		wa: number;
		ws: number;
		update: (revealProgress: number) => void;
		draw: (ctx: CanvasRenderingContext2D, revealProgress: number) => void;
	}

	function createParticle(i: number, formations: ParticleTarget[], W: number, H: number): Particle {
		const sr = Math.random();
		const br = sr < 0.55 ? Math.random() * 1.2 + 0.5 : sr < 0.85 ? Math.random() * 2 + 1.4 : Math.random() * 3.2 + 2.2;
		const wa = Math.random() * Math.PI * 2;
		const ws = Math.random() * 0.003 + 0.001;

		const particle: Particle = {
			x: Math.random() * W,
			y: Math.random() * H,
			vx: (Math.random() - 0.5) * 0.5,
			vy: (Math.random() - 0.5) * 0.5,
			br,
			r: br,
			ba: Math.random() * 0.4 + 0.25,
			a: Math.random() * 0.4 + 0.25,
			t: i < formations.length ? formations[i] : null,
			wa,
			ws,
			update: function(pr: number) {},
			draw: function(c: CanvasRenderingContext2D, pr: number) {}
		};

		particle.update = function(pr: number) {
			this.wa += this.ws;
			if (this.t && pr > 0.3) {
				const p = Math.min(1, (pr - 0.3) / 0.7);
				const str = p * 0.028;
				const cx = W / 2;
				const cy = H / 2;
				const tx = this.t.x - cx;
				const ty = this.t.y - cy;
				const rot = Date.now() * 0.00018;
				this.vx += (tx * Math.cos(rot) - ty * Math.sin(rot) + cx - this.x) * str;
				this.vy += (tx * Math.sin(rot) + ty * Math.cos(rot) + cy - this.y) * str;
			}
			this.vx += Math.cos(this.wa) * 0.008;
			this.vy += Math.sin(this.wa) * 0.008;

			const mouse = { x: mouseState.x, y: mouseState.y, active: mouseState.active };
			if (mouse.active) {
				const dx = this.x - mouse.x;
				const dy = this.y - mouse.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < 260) {
					const f = (1 - dist / 260) * 0.05;
					this.vx += dx * f;
					this.vy += dy * f;
					this.a = Math.min(1, this.ba + (1 - dist / 260) * 0.7);
					this.r = this.br + (1 - dist / 260) * 3;
				} else {
					this.a += (this.ba - this.a) * 0.03;
					this.r += (this.br - this.r) * 0.05;
				}
			} else {
				this.a += (this.ba - this.a) * 0.03;
				this.r += (this.br - this.r) * 0.05;
			}

			this.vx *= 0.96;
			this.vy *= 0.96;
			this.x += this.vx;
			this.y += this.vy;

			if (this.x < -60) this.x = W + 60;
			if (this.x > W + 60) this.x = -60;
			if (this.y < -60) this.y = H + 60;
			if (this.y > H + 60) this.y = -60;
		};

		particle.draw = function(c: CanvasRenderingContext2D, pr: number) {
			c.beginPath();
			c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
			c.fillStyle = `rgba(210, 218, 230, ${this.a})`;
			c.fill();

			if (this.br > 1.8) {
				c.beginPath();
				c.arc(this.x, this.y, this.r * 2.5, 0, Math.PI * 2);
				c.fillStyle = `rgba(190, 200, 220, ${this.a * 0.08})`;
				c.fill();
			}

			if (this.t && pr > 0.5) {
				const g = (pr - 0.5) * 2;
				c.beginPath();
				c.arc(this.x, this.y, this.r * 4, 0, Math.PI * 2);
				c.fillStyle = `rgba(180, 195, 220, ${0.05 * g})`;
				c.fill();
			}
		};

		return particle;
	}

	function getFormations(W: number, H: number): ParticleTarget[] {
		const cx = W / 2;
		const cy = H / 2;
		const s = Math.min(W, H) * 0.32;
		const pts: ParticleTarget[] = [];

		// Hexagon
		for (let i = 0; i < 6; i++) {
			const a1 = (Math.PI * 2 / 6) * i - Math.PI / 6;
			const a2 = (Math.PI * 2 / 6) * ((i + 1) % 6) - Math.PI / 6;
			for (let t = 0; t < 1; t += 0.25) {
				pts.push({ x: cx + Math.cos(a1 + (a2 - a1) * t) * s, y: cy + Math.sin(a1 + (a2 - a1) * t) * s, g: 'hex' });
			}
		}

		// Triangle
		for (let i = 0; i < 3; i++) {
			const a1 = (Math.PI * 2 / 3) * i - Math.PI / 2;
			const a2 = (Math.PI * 2 / 3) * ((i + 1) % 3) - Math.PI / 2;
			const r = s * 0.55;
			for (let t = 0; t < 1; t += 0.2) {
				const ax = cx + Math.cos(a1) * r;
				const ay = cy + Math.sin(a1) * r;
				const bx = cx + Math.cos(a2) * r;
				const by = cy + Math.sin(a2) * r;
				pts.push({ x: ax + (bx - ax) * t, y: ay + (by - ay) * t, g: 'tri' });
			}
		}

		// Diamond
		[[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy]) => {
			pts.push({ x: cx + dx * s * 0.2, y: cy + dy * s * 0.2, g: 'dia' });
		});

		// Orb
		for (let i = 0; i < 20; i++) {
			const a = (Math.PI * 2 / 20) * i;
			pts.push({ x: cx + Math.cos(a) * s * 0.78, y: cy + Math.sin(a) * s * 0.78, g: 'orb' });
		}

		return pts;
	}

	interface Frag {
		x: number;
		y: number;
		vx: number;
		vy: number;
		text: string;
	}

	const frags: Frag[] = [
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: '0xAF' },
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: 'NODE' },
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: '>>_' },
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: '::01' },
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: 'SYN' },
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: '//AX' },
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: '0x4B' },
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: 'REF' },
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: '<<' },
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: 'NET' },
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: 'AXIS' },
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: 'LAB' },
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: '//SYS' },
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: '>>INT' },
		{ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, text: '0xCE' }
	];

	let mouseState = { x: -9999, y: -9999, active: false };

	onMount(() => {
		if (!browser) return;

		if (prefersReducedMotion()) {
			return;
		}

		const ctx = setupCanvas(canvas);
		if (!ctx) return;
		const c = ctx;

		let W = window.innerWidth;
		let H = window.innerHeight;
		let time = 0;

		function resize() {
			W = canvas.width = window.innerWidth;
			H = canvas.height = window.innerHeight;
		}
		const resizer = createResizeHandler(resize);
		resizer.start();

		let formations = getFormations(W, H);
		const TOTAL = 420;
		let particles = Array.from({ length: TOTAL }, (_, i) => createParticle(i, formations, W, H));

		function drawConns(pr: number) {
			const md = 120 + pr * 35;
			const md2 = md * md;
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const d2 = dx * dx + dy * dy;
					if (d2 < md2) {
						let a = (1 - Math.sqrt(d2) / md) * 0.14;
						if (particles[i].t && particles[j].t) a *= 1 + pr * 3;
						c.beginPath();
						c.moveTo(particles[i].x, particles[i].y);
						c.lineTo(particles[j].x, particles[j].y);
						c.strokeStyle = `rgba(170, 180, 210, ${Math.min(a, 0.3)})`;
						c.lineWidth = 0.5;
						c.stroke();
					}
				}
			}
		}

		function drawGeo(pr: number) {
			if (pr < 0.35) return;
			const a = (pr - 0.35) * 0.18;
			const cx = W / 2;
			const cy = H / 2;
			const rot = time * 0.00015;
			const s = Math.min(W, H) * 0.32;

			c.strokeStyle = `rgba(140, 150, 185, ${a})`;
			c.lineWidth = 0.3;

			// Hexagon
			c.beginPath();
			for (let i = 0; i <= 6; i++) {
				const angle = (Math.PI * 2 / 6) * i + rot - Math.PI / 6;
				const x = cx + Math.cos(angle) * s;
				const y = cy + Math.sin(angle) * s;
				i === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
			}
			c.stroke();

			// Triangle
			c.beginPath();
			for (let i = 0; i <= 3; i++) {
				const angle = (Math.PI * 2 / 3) * i - Math.PI / 2 + rot * 0.7;
				const r = s * 0.55;
				const x = cx + Math.cos(angle) * r;
				const y = cy + Math.sin(angle) * r;
				i === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
			}
			c.stroke();

			// Circle
			c.beginPath();
			c.arc(cx, cy, s * 0.78, 0, Math.PI * 2);
			c.strokeStyle = `rgba(140, 150, 185, ${a * 0.5})`;
			c.stroke();

			// Radial lines
			c.strokeStyle = `rgba(140, 150, 185, ${a * 0.25})`;
			for (let i = 0; i < 8; i++) {
				const angle = (Math.PI * 2 / 8) * i + rot * 0.3;
				c.beginPath();
				c.moveTo(cx + Math.cos(angle) * s * 0.12, cy + Math.sin(angle) * s * 0.12);
				c.lineTo(cx + Math.cos(angle) * s * 0.95, cy + Math.sin(angle) * s * 0.95);
				c.stroke();
			}
		}

		function drawFrags(pr: number, currentW: number, currentH: number) {
			if (pr < 0.55) return;
			const p = (pr - 0.55) / 0.45;
			c.font = '9px "IBM Plex Mono", monospace';
			frags.forEach(f => {
				f.x += f.vx;
				f.y += f.vy;
				if (f.x < 0 || f.x > currentW) f.vx *= -1;
				if (f.y < 0 || f.y > currentH) f.vy *= -1;
				c.fillStyle = `rgba(170, 180, 210, ${p * 0.07 + Math.sin(time * 0.002 + f.x) * 0.025})`;
				c.fillText(f.text, f.x, f.y);
			});
		}

		const anim = createAnimationLoop((ts: number) => {
			time = ts;
			c.clearRect(0, 0, W, H);

			particles.forEach(p => p.update(revealProgress));
			drawConns(revealProgress);
			drawGeo(revealProgress);
			particles.forEach(p => p.draw(c, revealProgress));
			drawFrags(revealProgress, W, H);
		});

		const handleMouseMove = (e: MouseEvent) => {
			mouseState.x = e.clientX;
			mouseState.y = e.clientY;
			mouseState.active = true;
		};

		const handleMouseLeave = () => {
			mouseState.active = false;
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseleave', handleMouseLeave);

		// Additional resize handler for particle/formation recalculation
		const particleResizer = createResizeHandler(() => {
			formations = getFormations(window.innerWidth, window.innerHeight);
			particles = Array.from({ length: TOTAL }, (_, i) => createParticle(i, formations, window.innerWidth, window.innerHeight));
			// Reset frags positions to stay within new canvas bounds
			frags.forEach(f => {
				f.x = Math.random() * window.innerWidth;
				f.y = Math.random() * window.innerHeight;
			});
		});
		particleResizer.start();

		anim.start();

		return () => {
			anim.stop();
			resizer.stop();
			particleResizer.stop();
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseleave', handleMouseLeave);
		};
	});
</script>

<canvas bind:this={canvas} id="mainCanvas" aria-label="Animated particle network visualization"></canvas>

<style>
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
</style>
