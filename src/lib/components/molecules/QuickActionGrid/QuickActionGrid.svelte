<script lang="ts">
	import type { Snippet } from 'svelte';
	import IconBox from '$lib/components/atoms/IconBox/IconBox.svelte';
	import type { IconBoxTone } from '$lib/components/atoms/IconBox/IconBox.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import Upload from '@lucide/svelte/icons/upload';
	import Share2 from '@lucide/svelte/icons/share-2';
	import Search from '@lucide/svelte/icons/search';
	import Zap from '@lucide/svelte/icons/zap';
	import FilePlus from '@lucide/svelte/icons/file-plus';
	import Users from '@lucide/svelte/icons/users';
	import Settings from '@lucide/svelte/icons/settings';
	import Download from '@lucide/svelte/icons/download';
	import Link from '@lucide/svelte/icons/link';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import Calendar from '@lucide/svelte/icons/calendar';
	import FolderPlus from '@lucide/svelte/icons/folder-plus';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	export type QuickActionTone = IconBoxTone;
	export type QuickActionSize = 'sm' | 'md' | 'lg';
	export type QuickActionLayout = 'tiles' | 'compact' | 'list';
	export type QuickActionIconName =
		| 'plus'
		| 'upload'
		| 'share'
		| 'search'
		| 'zap'
		| 'file'
		| 'users'
		| 'settings'
		| 'download'
		| 'link'
		| 'message'
		| 'calendar'
		| 'folder'
		| 'sparkles';

	export interface QuickAction {
		id: string;
		label: string;
		description?: string;
		/** Lucide name, emoji, or custom snippet */
		icon?: Snippet | QuickActionIconName | (string & {});
		tone?: QuickActionTone;
		badge?: string;
		disabled?: boolean;
	}

	interface QuickActionGridProps {
		actions?: QuickAction[];
		/** Max columns for tiles. Compact uses auto-fill and treats this as a soft max. */
		columns?: 2 | 3 | 4 | 5 | 6;
		size?: QuickActionSize;
		layout?: QuickActionLayout;
		/** Show chevron on list layout */
		showChevron?: boolean;
		title?: string;
		description?: string;
		class?: string;
		onaction?: (id: string) => void;
	}

	const {
		actions = [],
		columns = 3,
		size = 'md',
		layout = 'tiles',
		showChevron = true,
		title,
		description,
		class: className = '',
		onaction
	}: QuickActionGridProps = $props();

	const columnClasses: Record<2 | 3 | 4 | 5 | 6, string> = {
		2: 'grid-cols-1 sm:grid-cols-2',
		3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
		5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
		6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
	};

	const compactMin: Record<QuickActionSize, string> = {
		sm: '4.75rem',
		md: '5.5rem',
		lg: '6.25rem'
	};

	const iconSize: Record<QuickActionSize, 'sm' | 'md' | 'lg'> = {
		sm: 'sm',
		md: 'md',
		lg: 'lg'
	};

	const pad: Record<QuickActionSize, string> = {
		sm: 'p-2',
		md: 'p-2.5',
		lg: 'p-3'
	};

	const labelSize: Record<QuickActionSize, string> = {
		sm: 'text-[11px]',
		md: 'text-xs',
		lg: 'text-sm'
	};

	const descSize: Record<QuickActionSize, string> = {
		sm: 'text-[10px]',
		md: 'text-xs',
		lg: 'text-xs'
	};

	function isSnippet(icon: QuickAction['icon']): icon is Snippet {
		return typeof icon === 'function';
	}

	function isEmoji(icon: string): boolean {
		return !ICON_NAMES.has(icon) && [...icon].length <= 3;
	}

	const ICON_NAMES = new Set<string>([
		'plus',
		'upload',
		'share',
		'search',
		'zap',
		'file',
		'users',
		'settings',
		'download',
		'link',
		'message',
		'calendar',
		'folder',
		'sparkles'
	]);

	const isList = $derived(layout === 'list');
	const isCompact = $derived(layout === 'compact');

	const compactStyle = $derived(
		isCompact
			? `grid-template-columns: repeat(auto-fit, minmax(min(100%, ${compactMin[size]}), 1fr));`
			: undefined
	);
</script>

{#snippet iconGlyph(name: string)}
	{#if name === 'plus'}
		<Plus class="h-4 w-4" aria-hidden="true" />
	{:else if name === 'upload'}
		<Upload class="h-4 w-4" aria-hidden="true" />
	{:else if name === 'share'}
		<Share2 class="h-4 w-4" aria-hidden="true" />
	{:else if name === 'search'}
		<Search class="h-4 w-4" aria-hidden="true" />
	{:else if name === 'file'}
		<FilePlus class="h-4 w-4" aria-hidden="true" />
	{:else if name === 'users'}
		<Users class="h-4 w-4" aria-hidden="true" />
	{:else if name === 'settings'}
		<Settings class="h-4 w-4" aria-hidden="true" />
	{:else if name === 'download'}
		<Download class="h-4 w-4" aria-hidden="true" />
	{:else if name === 'link'}
		<Link class="h-4 w-4" aria-hidden="true" />
	{:else if name === 'message'}
		<MessageSquare class="h-4 w-4" aria-hidden="true" />
	{:else if name === 'calendar'}
		<Calendar class="h-4 w-4" aria-hidden="true" />
	{:else if name === 'folder'}
		<FolderPlus class="h-4 w-4" aria-hidden="true" />
	{:else if name === 'sparkles'}
		<Sparkles class="h-4 w-4" aria-hidden="true" />
	{:else}
		<Zap class="h-4 w-4" aria-hidden="true" />
	{/if}
{/snippet}

<div class={['w-full space-y-3', className]}>
	{#if title || description}
		<div class="min-w-0">
			{#if title}
				<p class="text-sm font-semibold text-primary">{title}</p>
			{/if}
			{#if description}
				<p class="mt-0.5 text-xs text-muted">{description}</p>
			{/if}
		</div>
	{/if}

	<div
		class={[
			isList ? 'flex flex-col gap-1.5' : isCompact ? 'grid gap-2' : ['grid gap-2', columnClasses[columns]],
			isCompact && 'gap-2'
		]}
		style={compactStyle}
		role="group"
		aria-label={title ?? 'Quick actions'}
	>
		{#each actions as action (action.id)}
			<button
				type="button"
				disabled={action.disabled}
				class={[
					'group text-left transition-all duration-150',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
					'disabled:cursor-not-allowed disabled:opacity-45',
					isList
						? [
								'flex w-full items-center gap-3 rounded-xl border border-border bg-surface-elevated px-3 py-2.5',
								'hover:border-brand-500/25 hover:bg-surface-overlay active:scale-[0.995]'
							]
						: isCompact
							? [
									'flex min-h-[4.75rem] flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface-elevated text-center',
									pad[size],
									'hover:border-brand-500/30 hover:bg-surface-overlay hover:shadow-sm active:scale-[0.98]'
								]
							: [
									'flex flex-col items-start gap-2.5 rounded-2xl border border-border bg-surface-elevated',
									pad[size],
									'hover:border-brand-500/30 hover:bg-surface-overlay hover:shadow-sm active:scale-[0.985]'
								]
				]}
				onclick={() => {
					if (action.disabled) return;
					onaction?.(action.id);
				}}
			>
				{#if isList}
					<IconBox tone={action.tone ?? 'brand'} size={iconSize[size]} rounded="lg">
						{#if isSnippet(action.icon)}
							{@render action.icon()}
						{:else if typeof action.icon === 'string' && isEmoji(action.icon)}
							<span class="text-sm leading-none">{action.icon}</span>
						{:else}
							{@render iconGlyph(typeof action.icon === 'string' ? action.icon : 'zap')}
						{/if}
					</IconBox>
					<span class="min-w-0 flex-1">
						<span class="flex flex-wrap items-center gap-1.5">
							<span class={['font-semibold text-primary', labelSize[size]]}>{action.label}</span>
							{#if action.badge}
								<Badge size="sm" variant="secondary" rounded>{action.badge}</Badge>
							{/if}
						</span>
						{#if action.description}
							<span class={['mt-0.5 block leading-snug text-muted', descSize[size]]}>
								{action.description}
							</span>
						{/if}
					</span>
					{#if showChevron}
						<ChevronRight
							class="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-secondary"
							aria-hidden="true"
						/>
					{/if}
				{:else}
					<div class={['flex w-full items-start', isCompact ? 'justify-center' : 'justify-between gap-2']}>
						<IconBox
							tone={action.tone ?? 'brand'}
							size={isCompact ? 'md' : iconSize[size]}
							rounded={isCompact ? 'full' : 'xl'}
						>
							{#if isSnippet(action.icon)}
								{@render action.icon()}
							{:else if typeof action.icon === 'string' && isEmoji(action.icon)}
								<span class="text-sm leading-none">{action.icon}</span>
							{:else}
								{@render iconGlyph(typeof action.icon === 'string' ? action.icon : 'zap')}
							{/if}
						</IconBox>
						{#if action.badge && !isCompact}
							<Badge size="sm" variant="secondary" rounded>{action.badge}</Badge>
						{/if}
					</div>
					<span class={['min-w-0', isCompact && 'w-full']}>
						<span
							class={[
								'block font-semibold text-primary',
								labelSize[size],
								isCompact && 'truncate text-center'
							]}
						>
							{action.label}
						</span>
						{#if action.description && !isCompact}
							<span class={['mt-0.5 block leading-snug text-muted', descSize[size]]}>
								{action.description}
							</span>
						{/if}
						{#if action.badge && isCompact}
							<span class="mt-1 flex justify-center">
								<Badge size="sm" variant="secondary" rounded>{action.badge}</Badge>
							</span>
						{/if}
					</span>
				{/if}
			</button>
		{/each}
	</div>
</div>
