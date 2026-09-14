import type { Attachment } from 'svelte/attachments';

/**
 * Second click on a popover invoker must close it.
 *
 * `popover="auto"` light-dismisses when the trigger (outside the panel) is
 * clicked, then `popovertargetaction="toggle"` / a custom `onclick` opens it
 * again. Remember "was open" on pointerdown and cancel that reopen.
 */
export function bindPopoverInvokerToggle(
	trigger: HTMLElement,
	getPanel: () => HTMLElement | null | undefined
): () => void {
	let closeOnClick = false;

	const onPointerDown = () => {
		closeOnClick = !!getPanel()?.matches(':popover-open');
	};

	const onClick = (event: Event) => {
		if (!closeOnClick) return;
		closeOnClick = false;
		event.preventDefault();
		event.stopImmediatePropagation();
		const panel = getPanel();
		if (panel?.matches(':popover-open')) {
			try {
				panel.hidePopover();
			} catch {
				/* ignore */
			}
		}
	};

	trigger.addEventListener('pointerdown', onPointerDown, true);
	trigger.addEventListener('click', onClick, true);
	return () => {
		trigger.removeEventListener('pointerdown', onPointerDown, true);
		trigger.removeEventListener('click', onClick, true);
	};
}

/** `{@attach popoverInvokerToggle(() => panelEl)}` on a popover invoker button. */
export function popoverInvokerToggle(
	getPanel: () => HTMLElement | null | undefined
): Attachment<HTMLElement> {
	return (node) => bindPopoverInvokerToggle(node, getPanel);
}
