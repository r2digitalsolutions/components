/**
 * Reactive network online/offline store.
 *
 * @example
 * ```ts
 * import { network } from '@r2digisolutions/components';
 * if (!network.online) showBanner();
 * ```
 */

class NetworkStore {
	#online = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);
	#listening = false;
	#forced = $state<boolean | null>(null);

	constructor() {
		this.#ensureListening();
	}

	#ensureListening() {
		if (this.#listening || typeof window === 'undefined') return;
		this.#listening = true;
		this.#online = navigator.onLine;
		const sync = () => (this.#online = navigator.onLine);
		window.addEventListener('online', sync);
		window.addEventListener('offline', sync);
	}

	get online(): boolean {
		this.#ensureListening();
		return this.#forced === null ? this.#online : this.#forced;
	}

	get offline(): boolean {
		return !this.online;
	}

	/** Force online/offline (stories / tests). Pass null to clear. */
	setForced(value: boolean | null) {
		this.#forced = value;
	}

	get forced(): boolean | null {
		return this.#forced;
	}
}

export const network = new NetworkStore();
