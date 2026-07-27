/**
 * Reactive page visibility store — tab active vs hidden.
 *
 * Uses the Page Visibility API (`document.visibilityState`).
 *
 * @example
 * ```ts
 * import { pageVisibility } from '@r2digisolutions/components';
 * if (pageVisibility.visible) { poll(); }
 * ```
 */

export type VisibilityState = 'visible' | 'hidden';

class PageVisibilityStore {
	#state = $state<VisibilityState>(
		typeof document !== 'undefined' && document.visibilityState === 'hidden'
			? 'hidden'
			: 'visible'
	);
	#listening = false;

	constructor() {
		this.#ensureListening();
	}

	#ensureListening() {
		if (this.#listening || typeof document === 'undefined') return;
		this.#listening = true;
		this.#state = document.visibilityState === 'hidden' ? 'hidden' : 'visible';
		document.addEventListener('visibilitychange', () => {
			this.#state = document.visibilityState === 'hidden' ? 'hidden' : 'visible';
		});
	}

	get state(): VisibilityState {
		this.#ensureListening();
		return this.#state;
	}

	get visible(): boolean {
		return this.state === 'visible';
	}

	get hidden(): boolean {
		return this.state === 'hidden';
	}

	/** Force a state (useful in stories / tests). Pass null to clear override. */
	#forced = $state<VisibilityState | null>(null);

	get forced(): VisibilityState | null {
		return this.#forced;
	}

	setForced(value: VisibilityState | null) {
		this.#forced = value;
	}

	get effective(): VisibilityState {
		return this.#forced ?? this.state;
	}

	get isVisible(): boolean {
		return this.effective === 'visible';
	}

	get isHidden(): boolean {
		return this.effective === 'hidden';
	}
}

export const pageVisibility = new PageVisibilityStore();
