<script lang="ts">
	import type { Snippet } from 'svelte';
	import Spinner from '$lib/components/atoms/Spinner/Spinner.svelte';

	interface LoadingOverlayProps {
		active?: boolean;
		label?: string;
		blur?: boolean;
		fullscreen?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		active = false,
		label = 'Loading...',
		blur = true,
		fullscreen = false,
		class: className = '',
		children
	}: LoadingOverlayProps = $props();
</script>

{#if fullscreen}
	{#if active}
		<div
			class={[
				'fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-surface/70',
				blur && 'backdrop-blur-sm',
				className
			]}
			role="status"
			aria-live="polite"
			aria-busy="true"
		>
			<Spinner size="lg" label={label} />
			{#if label}
				<p class="text-sm font-medium text-secondary">{label}</p>
			{/if}
		</div>
	{/if}
{:else}
	<div class={['relative', className]}>
		{#if children}
			{@render children()}
		{/if}
		{#if active}
			<div
				class={[
					'absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[inherit] bg-surface/70',
					blur && 'backdrop-blur-sm'
				]}
				role="status"
				aria-live="polite"
				aria-busy="true"
			>
				<Spinner size="md" label={label} />
				{#if label}
					<p class="text-sm font-medium text-secondary">{label}</p>
				{/if}
			</div>
		{/if}
	</div>
{/if}
