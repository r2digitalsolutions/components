<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import FloatButton from '$lib/components/molecules/FloatButton/FloatButton.svelte';

	interface FeedbackWidgetProps {
		title?: string;
		question?: string;
		class?: string;
		onsubmit?: (payload: { score: number; comment: string }) => void;
	}

	let {
		title = 'How likely are you to recommend us?',
		question = 'Your feedback helps us improve.',
		class: className = '',
		onsubmit
	}: FeedbackWidgetProps = $props();

	let open = $state(false);
	let score = $state<number | null>(null);
	let comment = $state('');
	let sent = $state(false);

	function submit() {
		if (score === null) return;
		onsubmit?.({ score, comment });
		sent = true;
	}

	function reset() {
		open = false;
		score = null;
		comment = '';
		sent = false;
	}
</script>

<div class={className}>
	{#if open}
		<div
			class="fixed bottom-24 right-6 z-40 w-[min(100%-2rem,22rem)] rounded-2xl border border-border bg-surface-elevated p-4 shadow-xl"
			role="dialog"
			aria-label="Feedback"
		>
			{#if sent}
				<p class="text-sm font-semibold text-primary">Thanks for your feedback!</p>
				<p class="mt-1 text-sm text-secondary">We appreciate you taking the time.</p>
				<div class="mt-4 flex justify-end">
					<Button size="sm" onclick={reset}>Close</Button>
				</div>
			{:else}
				<p class="text-sm font-semibold text-primary">{title}</p>
				<p class="mt-1 text-xs text-muted">{question}</p>
				<div class="mt-3 flex flex-wrap gap-1">
					{#each Array.from({ length: 11 }, (_, i) => i) as n}
						<button
							type="button"
							class={[
								'h-8 w-8 rounded-lg text-xs font-medium',
								score === n
									? 'bg-brand-500 text-white'
									: 'bg-surface-overlay text-secondary hover:bg-surface'
							]}
							onclick={() => (score = n)}
						>
							{n}
						</button>
					{/each}
				</div>
				<textarea
					class="mt-3 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500/30"
					rows="3"
					placeholder="Anything we should improve?"
					bind:value={comment}
				></textarea>
				<div class="mt-3 flex justify-between">
					<Button size="sm" variant="ghost" onclick={reset}>Cancel</Button>
					<Button size="sm" disabled={score === null} onclick={submit}>Send</Button>
				</div>
			{/if}
		</div>
	{/if}

	<FloatButton label="Feedback" position="bottom-right" onclick={() => (open = !open)}>
		<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
			><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg
		>
	</FloatButton>
</div>
