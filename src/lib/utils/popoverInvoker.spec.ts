import { describe, expect, it, vi } from 'vitest';
import { bindPopoverInvokerToggle } from './popoverInvoker.js';

type Handler = (event: Event) => void;

function fakeNode(open: boolean) {
	const listeners = new Map<string, Handler>();
	const hidePopover = vi.fn();
	return {
		matches: (sel: string) => sel === ':popover-open' && open,
		hidePopover,
		addEventListener(type: string, fn: Handler, _opts?: unknown) {
			listeners.set(type, fn);
		},
		removeEventListener(type: string) {
			listeners.delete(type);
		},
		dispatch(type: string) {
			const event = {
				preventDefault: vi.fn(),
				stopImmediatePropagation: vi.fn()
			} as unknown as Event;
			listeners.get(type)?.(event);
			return event;
		}
	};
}

describe('bindPopoverInvokerToggle', () => {
	it('hides an open popover and stops the click from reopening it', () => {
		expect.hasAssertions();
		const panel = fakeNode(true);
		const trigger = fakeNode(false);
		const unbind = bindPopoverInvokerToggle(trigger as unknown as HTMLElement, () => panel as unknown as HTMLElement);
		trigger.dispatch('pointerdown');
		const click = trigger.dispatch('click');
		expect(click.preventDefault).toHaveBeenCalledTimes(1);
		expect(click.stopImmediatePropagation).toHaveBeenCalledTimes(1);
		expect(panel.hidePopover).toHaveBeenCalledTimes(1);
		unbind();
	});

	it('does not intercept a click when the popover was closed', () => {
		expect.hasAssertions();
		const panel = fakeNode(false);
		const trigger = fakeNode(false);
		const unbind = bindPopoverInvokerToggle(trigger as unknown as HTMLElement, () => panel as unknown as HTMLElement);
		trigger.dispatch('pointerdown');
		const click = trigger.dispatch('click');
		expect(click.preventDefault).not.toHaveBeenCalled();
		expect(panel.hidePopover).not.toHaveBeenCalled();
		unbind();
	});
});
