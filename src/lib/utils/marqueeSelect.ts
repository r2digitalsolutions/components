/** Axis-aligned selection rectangle (container-local coordinates). */
export interface MarqueeRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

/** Hit-test target with an id and box in the same coordinate space as {@link MarqueeRect}. */
export interface MarqueeItemRect {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export type MarqueeModifier = 'replace' | 'add' | 'toggle';

export interface MarqueeDragState {
	rect: MarqueeRect;
	ids: string[];
	modifier: MarqueeModifier;
}

export interface AttachMarqueeSelectOptions {
	/** Pixels of movement before a drag becomes a marquee (keeps clicks clean). Default 4. */
	threshold?: number;
	/** Supply item boxes; called on each move after threshold. */
	getItems: () => MarqueeItemRect[];
	/** Live updates while dragging (after threshold). */
	onDrag?: (state: MarqueeDragState) => void;
	/** Fired on pointerup if a marquee drag occurred. */
	onSelect: (state: MarqueeDragState) => void;
	/** Skip starting a marquee from this event target. */
	shouldIgnore?: (target: EventTarget | null) => boolean;
	/** Called when the overlay rect changes (including null when idle / below threshold). */
	onRect?: (rect: MarqueeRect | null) => void;
}

export function normalizeRect(x0: number, y0: number, x1: number, y1: number): MarqueeRect {
	const left = Math.min(x0, x1);
	const top = Math.min(y0, y1);
	return {
		x: left,
		y: top,
		width: Math.abs(x1 - x0),
		height: Math.abs(y1 - y0)
	};
}

export function rectsIntersect(a: MarqueeRect, b: MarqueeRect): boolean {
	return (
		a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y
	);
}

export function hitTestIds(marquee: MarqueeRect, items: MarqueeItemRect[]): string[] {
	const ids: string[] = [];
	for (const item of items) {
		if (rectsIntersect(marquee, item)) ids.push(item.id);
	}
	return ids;
}

export function getMarqueeModifier(e: Pick<PointerEvent, 'shiftKey' | 'metaKey' | 'ctrlKey'>): MarqueeModifier {
	if (e.metaKey || e.ctrlKey) return 'toggle';
	if (e.shiftKey) return 'add';
	return 'replace';
}

export function resolveMarqueeSelection(
	hitIds: string[],
	previousIds: string[],
	modifier: MarqueeModifier
): string[] {
	if (modifier === 'replace') return [...hitIds];
	if (modifier === 'add') return [...new Set([...previousIds, ...hitIds])];
	const set = new Set(previousIds);
	for (const id of hitIds) {
		if (set.has(id)) set.delete(id);
		else set.add(id);
	}
	return [...set];
}

/** Collect `[data-marquee-id]` children in container-local (incl. scroll) coordinates. */
export function collectMarqueeItems(
	container: HTMLElement,
	selector = '[data-marquee-id]'
): MarqueeItemRect[] {
	const cRect = container.getBoundingClientRect();
	const nodes = container.querySelectorAll(selector);
	const items: MarqueeItemRect[] = [];
	for (const node of nodes) {
		if (!(node instanceof HTMLElement)) continue;
		const id = node.getAttribute('data-marquee-id');
		if (!id) continue;
		const r = node.getBoundingClientRect();
		items.push({
			id,
			x: r.left - cRect.left + container.scrollLeft,
			y: r.top - cRect.top + container.scrollTop,
			width: r.width,
			height: r.height
		});
	}
	return items;
}

export function defaultMarqueeIgnore(target: EventTarget | null): boolean {
	if (!(target instanceof Element)) return false;
	return Boolean(
		target.closest(
			'input, textarea, select, button, a, label, [data-marquee-ignore], [role="separator"], [contenteditable="true"]'
		)
	);
}

function pointerInContainer(e: PointerEvent, container: HTMLElement) {
	const r = container.getBoundingClientRect();
	return {
		x: e.clientX - r.left + container.scrollLeft,
		y: e.clientY - r.top + container.scrollTop
	};
}

/**
 * Attach Windows-style rubber-band selection to a container.
 * Returns a disposer.
 */
export function attachMarqueeSelect(
	container: HTMLElement,
	options: AttachMarqueeSelectOptions
): () => void {
	const threshold = options.threshold ?? 4;
	const shouldIgnore = options.shouldIgnore ?? defaultMarqueeIgnore;

	let originX = 0;
	let originY = 0;
	let active = false;
	let dragging = false;
	let pointerId: number | null = null;

	function unbindWindow() {
		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', onPointerUp);
		window.removeEventListener('pointercancel', onPointerUp);
	}

	function finish(e: PointerEvent) {
		if (!active) return;
		active = false;
		const wasDragging = dragging;
		dragging = false;
		unbindWindow();
		if (pointerId != null) {
			try {
				container.releasePointerCapture(pointerId);
			} catch {
				/* already released */
			}
			pointerId = null;
		}
		if (!wasDragging) {
			options.onRect?.(null);
			return;
		}
		const pt = pointerInContainer(e, container);
		const rect = normalizeRect(originX, originY, pt.x, pt.y);
		const ids = hitTestIds(rect, options.getItems());
		const modifier = getMarqueeModifier(e);
		options.onSelect({ rect, ids, modifier });
		options.onRect?.(null);
		window.getSelection()?.removeAllRanges();
	}

	function onPointerDown(e: PointerEvent) {
		if (e.button !== 0) return;
		if (shouldIgnore(e.target)) return;
		const pt = pointerInContainer(e, container);
		originX = pt.x;
		originY = pt.y;
		active = true;
		dragging = false;
		pointerId = e.pointerId;
		// Defer capture until drag threshold so cell/row clicks still fire.
		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerUp);
		window.addEventListener('pointercancel', onPointerUp);
	}

	function onPointerMove(e: PointerEvent) {
		if (!active) return;
		if (pointerId != null && e.pointerId !== pointerId) return;
		const pt = pointerInContainer(e, container);
		const dx = pt.x - originX;
		const dy = pt.y - originY;
		if (!dragging) {
			if (Math.hypot(dx, dy) < threshold) return;
			dragging = true;
			if (pointerId != null) {
				try {
					container.setPointerCapture(pointerId);
				} catch {
					/* ignore */
				}
			}
			e.preventDefault();
			window.getSelection()?.removeAllRanges();
		} else {
			e.preventDefault();
		}
		const rect = normalizeRect(originX, originY, pt.x, pt.y);
		options.onRect?.(rect);
		const ids = hitTestIds(rect, options.getItems());
		const modifier = getMarqueeModifier(e);
		options.onDrag?.({ rect, ids, modifier });
	}

	function onPointerUp(e: PointerEvent) {
		if (pointerId != null && e.pointerId !== pointerId) return;
		finish(e);
	}

	function onLostCapture(e: PointerEvent) {
		if (e.pointerId === pointerId) finish(e);
	}

	container.addEventListener('pointerdown', onPointerDown);
	container.addEventListener('lostpointercapture', onLostCapture);

	return () => {
		unbindWindow();
		container.removeEventListener('pointerdown', onPointerDown);
		container.removeEventListener('lostpointercapture', onLostCapture);
	};
}
