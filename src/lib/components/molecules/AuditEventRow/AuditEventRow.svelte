<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Time from '$lib/components/atoms/Time/Time.svelte';
	import Activity from '@lucide/svelte/icons/activity';

	export type AuditEventSeverity = 'info' | 'warning' | 'error' | 'critical';

	interface AuditEventRowProps {
		action: string;
		actor?: string;
		target?: string;
		time?: Date | string | number;
		severity?: AuditEventSeverity;
		ip?: string;
		class?: string;
		onclick?: (e: MouseEvent) => void;
	}

	let {
		action,
		actor,
		target,
		time,
		severity = 'info',
		ip,
		class: className = '',
		onclick
	}: AuditEventRowProps = $props();

	const severityVariant: Record<
		AuditEventSeverity,
		'default' | 'info' | 'warning' | 'error' | 'primary'
	> = {
		info: 'info',
		warning: 'warning',
		error: 'error',
		critical: 'error'
	};

	const iconTones: Record<AuditEventSeverity, string> = {
		info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
		warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
		error: 'bg-red-500/10 text-red-600 dark:text-red-400',
		critical: 'bg-red-600/15 text-red-700 dark:text-red-400'
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	role={onclick ? 'button' : undefined}
	tabindex={onclick ? 0 : undefined}
	onclick={(e) => onclick?.(e)}
	onkeydown={(e) => {
		if (!onclick) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick(e as unknown as MouseEvent);
		}
	}}
	class={[
		'flex gap-3 rounded-xl border border-border bg-surface-elevated p-3 transition-colors',
		onclick && 'cursor-pointer hover:border-border-strong',
		className
	]}
>
	<span
		class={['flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', iconTones[severity]]}
	>
		<Activity class="h-4 w-4" strokeWidth={2} />
	</span>

	<div class="min-w-0 flex-1 space-y-1">
		<div class="flex flex-wrap items-center gap-2">
			<p class="text-sm font-medium text-primary">{action}</p>
			<Badge size="sm" variant={severityVariant[severity]}>{severity}</Badge>
		</div>
		<p class="text-xs text-muted">
			{#if actor}
				<span class="font-medium text-secondary">{actor}</span>
				{#if target}
					→ <span class="text-secondary">{target}</span>
				{/if}
			{:else if target}
				<span class="text-secondary">{target}</span>
			{/if}
			{#if time}
				{#if actor || target}
					·
				{/if}
				<Time date={time} format="datetime" class="text-xs text-muted" />
			{/if}
			{#if ip}
				· <span class="font-mono">{ip}</span>
			{/if}
		</p>
	</div>
</div>
