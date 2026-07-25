<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import StatusDot from '$lib/components/atoms/StatusDot/StatusDot.svelte';
	import UnsavedChanges from '$lib/components/molecules/UnsavedChanges/UnsavedChanges.svelte';

	export type ActionBarVariant = 'dock' | 'inline';

	interface ActionBarProps {
		submitLabel?: string;
		cancelLabel?: string;
		loading?: boolean;
		disabled?: boolean;
		dirty?: boolean;
		message?: string;
		savedMessage?: string;
		/** dock = floating pill · inline = sticky panel footer */
		variant?: ActionBarVariant;
		sticky?: boolean;
		showCancel?: boolean;
		class?: string;
		extra?: Snippet;
		onsubmit?: () => void;
		oncancel?: () => void;
	}

	const {
		submitLabel = 'Save',
		cancelLabel = 'Discard',
		loading = false,
		disabled = false,
		dirty = false,
		message = 'Unsaved changes',
		savedMessage = 'All changes saved',
		variant = 'dock',
		sticky = true,
		showCancel = true,
		class: className = '',
		extra,
		onsubmit,
		oncancel
	}: ActionBarProps = $props();

	const busy = $derived(loading || disabled);
	const canSave = $derived(dirty && !busy);
</script>

<!-- Registers beforeunload when dirty; banner suppressed — ActionBar is the UI -->
<UnsavedChanges {dirty} showBanner={false} />

{#if variant === 'dock'}
	<div
		class={[
			'pointer-events-none z-20 flex justify-center',
			sticky ? 'sticky bottom-3 px-3' : 'relative',
			className
		]}
		role="status"
		aria-live="polite"
	>
		<div
			class={[
				'pointer-events-auto flex w-full max-w-lg items-center gap-3 rounded-2xl border px-3 py-2 shadow-lg backdrop-blur-md transition-colors',
				'ring-1 ring-black/5 dark:ring-white/10',
				dirty
					? 'border-amber-300/70 bg-surface-elevated/95 shadow-amber-950/10 dark:border-amber-800/60 dark:bg-zinc-900/95 dark:shadow-black/40'
					: 'border-border bg-surface-elevated/95 shadow-black/5 dark:shadow-black/40'
			]}
		>
			<div class="flex min-w-0 flex-1 items-center gap-2.5">
				<StatusDot
					status={dirty ? 'away' : 'online'}
					size="sm"
					pulse={dirty}
					label={dirty ? message : savedMessage}
				/>
				<div class="min-w-0">
					<p
						class={[
							'truncate text-xs font-semibold',
							dirty ? 'text-amber-800 dark:text-amber-200' : 'text-primary'
						]}
					>
						{dirty ? message : savedMessage}
					</p>
					{#if dirty}
						<p class="truncate text-[11px] text-muted">Save before leaving this page</p>
					{/if}
				</div>
			</div>

			{#if extra}
				<div class="hidden items-center gap-1 sm:flex">
					{@render extra()}
				</div>
			{/if}

			<div class="flex shrink-0 items-center gap-1.5">
				{#if showCancel}
					<Button
						type="button"
						size="xs"
						variant="ghost"
						disabled={busy || !dirty}
						onclick={() => oncancel?.()}
					>
						{cancelLabel}
					</Button>
				{/if}
				<Button
					type="button"
					size="xs"
					loading={loading}
					disabled={!canSave}
					onclick={() => onsubmit?.()}
				>
					{submitLabel}
				</Button>
			</div>
		</div>
	</div>
{:else}
	<div
		class={[
			'flex w-full flex-wrap items-center gap-3 border-t border-border bg-surface-elevated/90 px-4 py-2.5 backdrop-blur',
			sticky && 'sticky bottom-0 z-20',
			className
		]}
		role="status"
		aria-live="polite"
	>
		<div class="flex min-w-0 flex-1 items-center gap-2">
			<StatusDot
				status={dirty ? 'away' : 'online'}
				size="sm"
				pulse={dirty}
				label={dirty ? message : savedMessage}
			/>
			<p
				class={[
					'truncate text-xs font-medium',
					dirty ? 'text-amber-700 dark:text-amber-400' : 'text-muted'
				]}
			>
				{dirty ? message : savedMessage}
			</p>
			{#if extra}
				<div class="flex items-center gap-1">
					{@render extra()}
				</div>
			{/if}
		</div>

		<div class="ml-auto flex shrink-0 items-center gap-1.5">
			{#if showCancel}
				<Button
					type="button"
					size="xs"
					variant="ghost"
					disabled={busy || !dirty}
					onclick={() => oncancel?.()}
				>
					{cancelLabel}
				</Button>
			{/if}
			<Button
				type="button"
				size="xs"
				loading={loading}
				disabled={!canSave}
				onclick={() => onsubmit?.()}
			>
				{submitLabel}
			</Button>
		</div>
	</div>
{/if}
