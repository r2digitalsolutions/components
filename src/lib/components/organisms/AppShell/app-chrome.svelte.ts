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

export class AppChrome {
	/** Live reader so nested layouts stay reactive when `[id]` is reused. */
	source = $state.raw<(() => AppShellContextual | null) | null>(null);
	/** Bumped on every `setContextual` so AppShell `$derived` re-runs. */
	revision = $state(0);
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
			this.revision += 1;
			return () => {};
		}

		const reader = typeof nav === 'function' ? nav : () => nav;
		this.source = reader;
		this.#owner = reader;
		this.revision += 1;

		return () => {
			if (this.#owner !== reader) return;
			this.source = null;
			this.#owner = null;
			this.revision += 1;
		};
	}
}

export function getSharedAppChrome(): AppChrome {
	const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: AppChrome };
	if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = new AppChrome();
	return g[GLOBAL_KEY]!;
}

const [getAppChromeContext, setAppChromeContext] = createContext<AppChrome>();

export function getAppChrome(): AppChrome {
	return getAppChromeContext();
}

/** Sets Svelte context and keeps `globalThis` in sync for duplicate module graphs. */
export function setAppChrome(chrome: AppChrome) {
	const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: AppChrome };
	g[GLOBAL_KEY] = chrome;
	setAppChromeContext(chrome);
}
