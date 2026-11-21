import type { Attachment } from 'svelte/attachments';

/**
 * Keep a `[popover]` panel invisible until its first position is applied.
 *
 * Panels positioned from the async `toggle` event (or through a Svelte
 * `style={}` binding) are painted once by the browser at the UA default
 * spot — the top-left corner — and then jump next to their trigger. Hide the
 * panel in `beforetoggle` (synchronous, before the first paint) and reveal it
 * one frame after `toggle`, once the component's positioning has flushed.
 *
 * `visibility: hidden` keeps layout, so the panel can still be measured.
 */
export function bindHideUntilPlaced(panel: HTMLElement): () => void {
	let frame = 0;

	const reveal = () => {
		cancelAnimationFrame(frame);
		panel.style.removeProperty('visibility');
	};

	const onBeforeToggle = (event: Event) => {
		if (event.target !== panel) return;
		if ((event as ToggleEvent).newState === 'open') {
			cancelAnimationFrame(frame);
			panel.style.setProperty('visibility', 'hidden');
		} else {
			reveal();
		}
	};

	const onToggle = (event: Event) => {
		if (event.target !== panel) return;
		if ((event as ToggleEvent).newState !== 'open') {
			reveal();
			return;
		}
		// Component handlers position in a microtask (+ Svelte flush); a frame
		// later the panel is already in place.
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(reveal);
	};

	panel.addEventListener('beforetoggle', onBeforeToggle);
	panel.addEventListener('toggle', onToggle);
	return () => {
		cancelAnimationFrame(frame);
		panel.removeEventListener('beforetoggle', onBeforeToggle);
		panel.removeEventListener('toggle', onToggle);
	};
}

/** `{@attach hideUntilPlaced}` on a `[popover]` panel positioned with JS. */
export const hideUntilPlaced: Attachment<HTMLElement> = (node) => bindHideUntilPlaced(node);
