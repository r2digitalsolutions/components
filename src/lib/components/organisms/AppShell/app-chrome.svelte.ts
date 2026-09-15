import { createContext } from 'svelte';
import type { Snippet } from 'svelte';
import type { SidebarGroup } from '$lib/components/organisms/Sidebar/Sidebar.svelte';

export interface AppShellContextual {
	groups: SidebarGroup[];
	value: string;
	brand?: string;
	description?: string;
	status?: string;
	parentHref?: string;
	parentLabel?: string;
	header?: Snippet;
	onchange?: (id: string) => void;
}

export type AppChromeClear = () => void;

const GLOBAL_KEY = '__r2_app_chrome__';
const EPOCH_KEY = '__r2_app_chrome_epoch__';

type ChromeGlobal = typeof globalThis & {
	[GLOBAL_KEY]?: AppChrome;
	[EPOCH_KEY]?: { value: number };
};

function epochBox(): { value: number } {
	const g = globalThis as ChromeGlobal;
	if (!g[EPOCH_KEY]) g[EPOCH_KEY] = { value: 0 };
	return g[EPOCH_KEY]!;
}

/** Reactive epoch — always read via this so AppShell tracks updates across module copies. */
let chromeEpoch = $state(0);

export function getAppChromeEpoch(): number {
	// Prefer module signal; sync from global so duplicate graphs still move.
	const box = epochBox();
	if (box.value !== chromeEpoch) chromeEpoch = box.value;
	return chromeEpoch;
}

function bumpEpoch() {
	const box = epochBox();
	box.value += 1;
	chromeEpoch = box.value;
}

export class AppChrome {
	/** Live reader so nested layouts stay reactive when `[id]` is reused. */
	source = $state.raw<(() => AppShellContextual | null) | null>(null);
	/** Identity of the active source — cleanup no-ops if another layout already replaced it. */
	#owner: (() => AppShellContextual | null) | null = null;

	get contextual(): AppShellContextual | null {
		return this.source?.() ?? null;
	}

	/**
	 * Register contextual sidebar. Returns a disposer that only clears if this
	 * registration is still active (safe across layout navigation races).
	 */
	setContextual(
		nav: AppShellContextual | (() => AppShellContextual | null) | null
	): AppChromeClear {
		if (nav === null) {
			this.source = null;
			this.#owner = null;
			bumpEpoch();
			return () => {};
		}

		const reader = typeof nav === 'function' ? nav : () => nav;
		this.source = reader;
		this.#owner = reader;
		bumpEpoch();

		return () => {
			if (this.#owner !== reader) return;
			this.source = null;
			this.#owner = null;
			bumpEpoch();
		};
	}
}

export function getSharedAppChrome(): AppChrome {
	const g = globalThis as ChromeGlobal;
	if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = new AppChrome();
	return g[GLOBAL_KEY]!;
}

const [getAppChromeContext, setAppChromeContext] = createContext<AppChrome>();

export function getAppChrome(): AppChrome {
	return getAppChromeContext();
}

/** Sets Svelte context and keeps `globalThis` in sync for duplicate module graphs. */
export function setAppChrome(chrome: AppChrome) {
	const g = globalThis as ChromeGlobal;
	g[GLOBAL_KEY] = chrome;
	setAppChromeContext(chrome);
}
