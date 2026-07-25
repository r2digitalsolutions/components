<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import type { AccessLevel } from '$lib/components/molecules/AccessLevelToggle/AccessLevelToggle.svelte';
	import Shield from '@lucide/svelte/icons/shield';
	import Users from '@lucide/svelte/icons/users';

	export interface RolePermissionSummary {
		resource: string;
		levels: AccessLevel[];
	}

	interface RoleCardProps {
		id?: string;
		name: string;
		description?: string;
		memberCount?: number;
		/** System roles cannot be deleted */
		system?: boolean;
		selected?: boolean;
		permissions?: RolePermissionSummary[];
		class?: string;
		onclick?: () => void;
		onedit?: () => void;
	}

	let {
		id,
		name,
		description,
		memberCount,
		system = false,
		selected = false,
		permissions = [],
		class: className = '',
		onclick,
		onedit
	}: RoleCardProps = $props();

	const preview = $derived(permissions.slice(0, 4));
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	data-id={id}
	role={onclick ? 'button' : undefined}
	tabindex={onclick ? 0 : undefined}
	onclick={() => onclick?.()}
	onkeydown={(e) => {
		if (!onclick) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick();
		}
	}}
	class={[
		'w-full rounded-2xl border bg-surface-elevated p-4 text-left shadow-sm transition-colors',
		selected
			? 'border-brand-500/50 ring-2 ring-brand-500/20'
			: 'border-border hover:border-border-strong',
		onclick && 'cursor-pointer',
		className
	]}
>
	<div class="flex items-start gap-3">
		<span
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400"
		>
			<Shield class="h-5 w-5" strokeWidth={2} />
		</span>
		<div class="min-w-0 flex-1 space-y-1">
			<div class="flex flex-wrap items-center gap-2">
				<p class="text-sm font-semibold text-primary">{name}</p>
				{#if system}
					<Badge size="sm" variant="secondary">System</Badge>
				{/if}
			</div>
			{#if description}
				<p class="text-xs leading-relaxed text-muted">{description}</p>
			{/if}
			{#if memberCount !== undefined}
				<p class="inline-flex items-center gap-1 text-[11px] text-muted">
					<Users class="h-3 w-3" strokeWidth={2} />
					{memberCount} {memberCount === 1 ? 'member' : 'members'}
				</p>
			{/if}
		</div>
		{#if onedit}
			<Button
				size="xs"
				variant="ghost"
				onclick={(e) => {
					e.stopPropagation();
					onedit?.();
				}}
			>
				Edit
			</Button>
		{/if}
	</div>

	{#if preview.length}
		<ul class="mt-3 space-y-1.5 border-t border-border pt-3">
			{#each preview as perm (perm.resource)}
				<li class="flex items-center justify-between gap-2 text-[11px]">
					<span class="truncate text-secondary">{perm.resource}</span>
					<span class="shrink-0 font-mono uppercase tracking-wide text-muted">
						{perm.levels.length ? perm.levels.map((l) => l[0]).join('') : '—'}
					</span>
				</li>
			{/each}
			{#if permissions.length > preview.length}
				<li class="text-[11px] text-muted">+{permissions.length - preview.length} more</li>
			{/if}
		</ul>
	{/if}
</div>
