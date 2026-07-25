<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';

	interface UnsavedChangesProps {
		dirty?: boolean;
		showBanner?: boolean;
		/** inline = card alert · floating = bottom dock (Notion/Linear style) */
		variant?: 'inline' | 'floating';
		title?: string;
		description?: string;
		saveLabel?: string;
		discardLabel?: string;
		saving?: boolean;
		class?: string;
		actions?: Snippet;
		onsave?: () => void;
		ondiscard?: () => void;
	}

	let {
		dirty = false,
		showBanner = true,
		variant = 'floating',
		title = 'Unsaved changes',
		description = 'Save before leaving this page.',
		saveLabel = 'Save',
		discardLabel = 'Discard',
		saving = false,
		class: className = '',
		actions,
		onsave,
		ondiscard
	}: UnsavedChangesProps = $props();

	$effect(() => {
		if (typeof window === 'undefined') return;
		const handler = (e: BeforeUnloadEvent) => {
			if (!dirty) return;
			e.preventDefault();
			e.returnValue = '';
		};
		window.addEventListener('beforeunload', handler);
		return () => window.removeEventListener('beforeunload', handler);
	});
</script>

{#if dirty && showBanner}
	{#if variant === 'floating'}
		<div
			class={[
				'pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 sm:p-6',
				className
			]}
			role="status"
			aria-live="polite"
		>
			<div
				class="pointer-events-auto flex w-full max-w-xl items-center gap-3 rounded-2xl border border-amber-200/80 bg-surface-elevated/95 px-3.5 py-3 shadow-xl shadow-amber-950/10 ring-1 ring-black/5 backdrop-blur-md dark:border-amber-900/50 dark:bg-zinc-900/95 dark:shadow-black/40 dark:ring-white/10"
			>
				<span
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300"
				>
					<CircleAlert class="h-5 w-5" strokeWidth={2} />
				</span>

				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-semibold text-primary">{title}</p>
					<p class="truncate text-xs text-secondary">{description}</p>
				</div>

				<div class="flex shrink-0 items-center gap-2">
					{#if actions}
						{@render actions()}
					{:else}
						{#if ondiscard}
							<Button size="sm" variant="ghost" onclick={() => ondiscard?.()} disabled={saving}>
								{discardLabel}
							</Button>
						{/if}
						{#if onsave}
							<Button size="sm" onclick={() => onsave?.()} loading={saving}>
								{saveLabel}
							</Button>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	{:else}
		<div
			class={[
				'flex w-full flex-col gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 sm:flex-row sm:items-center dark:border-amber-900/50 dark:bg-amber-950/30',
				className
			]}
			role="status"
			aria-live="polite"
		>
			<div class="flex min-w-0 flex-1 items-start gap-3">
				<span
					class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
				>
					<CircleAlert class="h-4 w-4" strokeWidth={2} />
				</span>
				<div class="min-w-0">
					<p class="text-sm font-semibold text-amber-950 dark:text-amber-50">{title}</p>
					<p class="mt-0.5 text-xs leading-relaxed text-amber-900/75 dark:text-amber-100/70">
						{description}
					</p>
				</div>
			</div>

			<div class="flex shrink-0 items-center gap-2 sm:justify-end">
				{#if actions}
					{@render actions()}
				{:else}
					{#if ondiscard}
						<Button size="sm" variant="ghost" onclick={() => ondiscard?.()} disabled={saving}>
							{discardLabel}
						</Button>
					{/if}
					{#if onsave}
						<Button size="sm" onclick={() => onsave?.()} loading={saving}>
							{saveLabel}
						</Button>
					{/if}
				{/if}
			</div>
		</div>
	{/if}
{/if}
