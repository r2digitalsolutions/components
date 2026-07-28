/** Milliseconds ↔ pixels and timecode helpers for media timelines. */

export function msToPx(ms: number, pxPerMs: number): number {
	return ms * pxPerMs;
}

export function pxToMs(px: number, pxPerMs: number): number {
	if (pxPerMs <= 0) return 0;
	return px / pxPerMs;
}

/** px per ms from a zoom level (1 = 0.05 px/ms ≈ 50px/s). */
export function pxPerMsFromZoom(zoom: number): number {
	return Math.max(0.001, zoom) * 0.05;
}

export function snapMs(ms: number, snapToMs: number): number {
	if (snapToMs <= 0) return ms;
	return Math.round(ms / snapToMs) * snapToMs;
}

export function clampMs(ms: number, min = 0, max = Number.POSITIVE_INFINITY): number {
	return Math.min(max, Math.max(min, ms));
}

/** Format as HH:MM:SS or MM:SS.mmm when showMs. */
export function formatTimecode(ms: number, opts?: { showMs?: boolean; fps?: number }): string {
	const showMs = opts?.showMs ?? false;
	const fps = opts?.fps;
	const total = Math.max(0, Math.floor(ms));
	const hours = Math.floor(total / 3_600_000);
	const minutes = Math.floor((total % 3_600_000) / 60_000);
	const seconds = Math.floor((total % 60_000) / 1000);
	const millis = total % 1000;

	const hh = hours > 0 ? `${String(hours).padStart(2, '0')}:` : '';
	const mm = String(minutes).padStart(2, '0');
	const ss = String(seconds).padStart(2, '0');

	if (fps && fps > 0) {
		const frame = Math.floor((millis / 1000) * fps) % Math.round(fps);
		return `${hh}${mm}:${ss}:${String(frame).padStart(2, '0')}`;
	}

	if (showMs) {
		return `${hh}${mm}:${ss}.${String(millis).padStart(3, '0')}`;
	}
	return `${hh}${mm}:${ss}`;
}

export function ticksForDuration(
	durationMs: number,
	pxPerMs: number,
	minTickPx = 60
): { ms: number; major: boolean }[] {
	const candidates = [100, 250, 500, 1000, 2000, 5000, 10_000, 30_000, 60_000, 120_000, 300_000];
	let step = candidates[candidates.length - 1];
	for (const c of candidates) {
		if (msToPx(c, pxPerMs) >= minTickPx) {
			step = c;
			break;
		}
	}
	const ticks: { ms: number; major: boolean }[] = [];
	for (let t = 0; t <= durationMs + 0.5; t += step) {
		ticks.push({ ms: t, major: t % (step * 2) === 0 || t === 0 });
	}
	return ticks;
}
