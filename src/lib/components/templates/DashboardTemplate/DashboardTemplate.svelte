<script lang="ts">
	import type { Snippet } from 'svelte';
	import AppShell from '$lib/components/organisms/AppShell/AppShell.svelte';
	import type { SidebarGroup } from '$lib/components/organisms/Sidebar/Sidebar.svelte';
	import type { NavbarLink } from '$lib/components/organisms/Navbar/Navbar.svelte';
	import DashboardPage from '$lib/components/organisms/DashboardPage/DashboardPage.svelte';
	import type { DashboardPeriod } from '$lib/components/organisms/DashboardPage/DashboardPage.svelte';
	import type { MetricItem } from '$lib/components/molecules/MetricGrid/MetricGrid.svelte';
	import type { BreadcrumbItem } from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import type { SegmentItem } from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import NotificationCenter from '$lib/components/organisms/NotificationCenter/NotificationCenter.svelte';
	import type { NotificationItem } from '$lib/components/organisms/NotificationCenter/NotificationCenter.svelte';
	import UserMenu from '$lib/components/molecules/UserMenu/UserMenu.svelte';
	import type { UserMenuItem } from '$lib/components/molecules/UserMenu/UserMenu.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Search from '@lucide/svelte/icons/search';
	import HelpCircle from '@lucide/svelte/icons/circle-help';

	export type DashboardTemplateDensity = 'comfortable' | 'compact';

	interface DashboardTemplateProps {
		title?: string;
		description?: string;
		brand?: string;
		breadcrumbs?: BreadcrumbItem[];
		metrics?: MetricItem[];
		metricCols?: 2 | 3 | 4;
		period?: DashboardPeriod;
		periods?: SegmentItem[];
		updatedLabel?: string;
		statusLabel?: string;
		empty?: boolean;
		emptyTitle?: string;
		emptyDescription?: string;
		sidebarGroups?: SidebarGroup[];
		navLinks?: NavbarLink[];
		sidebarValue?: string;
		navValue?: string;
		collapsed?: boolean;
		showSidebar?: boolean;
		showNavbar?: boolean;
		showNotifications?: boolean;
		notifications?: NotificationItem[];
		userName?: string;
		userEmail?: string;
		userRole?: string;
		userPlan?: string;
		userAvatar?: string;
		userMenuItems?: UserMenuItem[];
		showUserMenu?: boolean;
		fullHeight?: boolean;
		framed?: boolean;
		density?: DashboardTemplateDensity;
		class?: string;
		mainClass?: string;
		/** Extra controls next to period switcher */
		actions?: Snippet;
		/** Navbar trailing actions (overrides default search / help / notifs / user menu) */
		navbarActions?: Snippet;
		primary?: Snippet;
		secondary?: Snippet;
		footer?: Snippet;
		children?: Snippet;
		onperiodchange?: (period: string) => void;
		onsearch?: () => void;
		onhelp?: () => void;
		onuserselect?: (id: string, item: UserMenuItem) => void;
	}

	let {
		title = 'Dashboard',
		description = 'Overview of your workspace.',
		brand = 'R2 Digi',
		breadcrumbs = [],
		metrics = [],
		metricCols = 4,
		period = $bindable('30d'),
		periods = [
			{ id: '7d', label: '7d' },
			{ id: '30d', label: '30d' },
			{ id: '90d', label: '90d' }
		],
		updatedLabel,
		statusLabel = 'Live',
		empty = false,
		emptyTitle,
		emptyDescription,
		sidebarGroups = [
			{
				id: 'main',
				label: 'Main',
				items: [
					{ id: 'dash', label: 'Dashboard' },
					{ id: 'analytics', label: 'Analytics' },
					{ id: 'projects', label: 'Projects' },
					{ id: 'team', label: 'Team' }
				]
			},
			{
				id: 'workspace',
				label: 'Workspace',
				items: [
					{ id: 'billing', label: 'Billing' },
					{ id: 'settings', label: 'Settings' }
				]
			}
		],
		navLinks = [
			{ id: 'overview', label: 'Overview' },
			{ id: 'reports', label: 'Reports' },
			{ id: 'customers', label: 'Customers' }
		],
		sidebarValue = $bindable('dash'),
		navValue = $bindable('overview'),
		collapsed = $bindable(false),
		showSidebar = true,
		showNavbar = true,
		showNotifications = true,
		notifications = [],
		userName = 'You',
		userEmail,
		userRole = 'Admin',
		userPlan,
		userAvatar,
		userMenuItems,
		showUserMenu = true,
		fullHeight = true,
		framed = false,
		density = 'comfortable',
		class: className = '',
		mainClass = '',
		actions,
		navbarActions,
		primary,
		secondary,
		footer,
		children,
		onperiodchange,
		onsearch,
		onhelp,
		onuserselect
	}: DashboardTemplateProps = $props();

	const padMain = $derived(
		density === 'compact' ? 'p-4 sm:p-5' : 'p-5 sm:p-6 lg:p-8'
	);
</script>

<AppShell
	{brand}
	{sidebarGroups}
	{navLinks}
	bind:sidebarValue
	bind:navValue
	bind:collapsed
	{showSidebar}
	{showNavbar}
	{fullHeight}
	{framed}
	mainClass={['!p-0', mainClass].filter(Boolean).join(' ')}
	class={className}
>
	{#snippet actions()}
		{#if navbarActions}
			{@render navbarActions()}
		{:else}
			<div class="flex items-center gap-1.5">
				<IconButton size="sm" variant="ghost" label="Search" onclick={() => onsearch?.()}>
					<Search class="h-4 w-4" />
				</IconButton>
				<IconButton size="sm" variant="ghost" label="Help" onclick={() => onhelp?.()}>
					<HelpCircle class="h-4 w-4" />
				</IconButton>
				{#if showNotifications}
					<NotificationCenter items={notifications} />
				{/if}
				{#if showUserMenu}
					<div class="mx-0.5 hidden h-5 w-px bg-border sm:block" aria-hidden="true"></div>
					<UserMenu
						name={userName}
						email={userEmail}
						role={userRole}
						plan={userPlan}
						src={userAvatar}
						items={userMenuItems}
						size="sm"
						variant="ghost"
						showSubtitle={false}
						align="end"
						onselect={(id, item) => onuserselect?.(id, item)}
					/>
				{/if}
			</div>
		{/if}
	{/snippet}

	<div class={['min-h-full', padMain]}>
		<DashboardPage
			{title}
			{description}
			{breadcrumbs}
			{metrics}
			{metricCols}
			bind:period
			{periods}
			{updatedLabel}
			{statusLabel}
			{empty}
			emptyTitle={emptyTitle}
			emptyDescription={emptyDescription}
			{actions}
			{primary}
			{secondary}
			{footer}
			{children}
			{onperiodchange}
			class={density === 'compact' ? 'max-w-none space-y-4' : 'max-w-none'}
		/>
	</div>
</AppShell>
