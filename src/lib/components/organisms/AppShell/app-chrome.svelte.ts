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

export class AppChrome {
	/** Live reader so nested layouts stay reactive when `[id]` is reused. */
	source = $state.raw<(() => AppShellContextual | null) | null>(null);

	get contextual(): AppShellContextual | null {
		return this.source?.() ?? null;
	}

	setContextual(nav: AppShellContextual | (() => AppShellContextual | null) | null) {
		if (nav === null) {
			this.source = null;
			return;
		}
		this.source = typeof nav === 'function' ? nav : () => nav;
	}
}

export const [getAppChrome, setAppChrome] = createContext<AppChrome>();
