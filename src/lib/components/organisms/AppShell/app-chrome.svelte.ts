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
	contextual = $state.raw<AppShellContextual | null>(null);

	setContextual(nav: AppShellContextual | null) {
		this.contextual = nav;
	}
}

export const [getAppChrome, setAppChrome] = createContext<AppChrome>();
