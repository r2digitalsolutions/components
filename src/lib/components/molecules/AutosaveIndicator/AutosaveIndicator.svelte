<script lang="ts">
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Check from '@lucide/svelte/icons/check';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import Pencil from '@lucide/svelte/icons/pencil';

	export type AutosaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

	interface AutosaveIndicatorProps {
		status?: AutosaveStatus;
		/** Shown when status is `saved` */
		savedLabel?: string;
		savingLabel?: string;
		dirtyLabel?: string;
		errorLabel?: string;
		idleLabel?: string;
		/** Optional timestamp / relative text next to saved */
		lastSaved?: string;
		size?: 'sm' | 'md';
		class?: string;
	}

	let {
		status = 'idle',
		savedLabel = 'Saved',
		savingLabel = 'Saving…',
		dirtyLabel = 'Unsaved changes',
		errorLabel = 'Save failed',
		idleLabel = '',
		lastSaved,
		size = 'sm',
		class: className = ''
	}: AutosaveIndicatorProps = $props();

	const text = $derived.by(() => {
		switch (status) {
			case 'saving':
				return savingLabel;
			case 'saved':
				return lastSaved ? `${savedLabel} · ${lastSaved}` : savedLabel;
			case 'dirty':
				return dirtyLabel;
			case 'error':
				return errorLabel;
			default:
				return idleLabel;
		}
	});

	const tone = $derived.by(() => {
		switch (status) {
			case 'saving':
				return 'text-muted';
			case 'saved':
				return 'text-green-600 dark:text-green-400';
			case 'dirty':
				return 'text-amber-600 dark:text-amber-400';
			case 'error':
				return 'text-red-500';
			default:
				return 'text-muted';
		}
	});

	const textSize = $derived(size === 'sm' ? 'text-[11px]' : 'text-xs');
	const iconSize = $derived(size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5');
</script>

{#if text || status !== 'idle'}
	<div
		class={['inline-flex items-center gap-1.5 font-medium', textSize, tone, className]}
		role="status"
		aria-live="polite"
	>
		{#if status === 'saving'}
			<LoaderCircle class={[iconSize, 'animate-spin']} aria-hidden="true" />
		{:else if status === 'saved'}
			<Check class={iconSize} aria-hidden="true" />
		{:else if status === 'dirty'}
			<Pencil class={iconSize} aria-hidden="true" />
		{:else if status === 'error'}
			<CircleAlert class={iconSize} aria-hidden="true" />
		{/if}
		{#if text}
			<span>{text}</span>
		{/if}
	</div>
{/if}
