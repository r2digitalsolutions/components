<script lang="ts">
	import ContactForm from './ContactForm.svelte';

	interface Props {
		variant?: 'default' | 'loading' | 'success' | 'async';
	}

	let { variant = 'default' }: Props = $props();
	let last = $state('');
	let success = $state(variant === 'success');
</script>

<div class="flex flex-col items-center gap-3 p-4">
	{#if variant === 'loading'}
		<ContactForm loading />
	{:else if variant === 'success'}
		<ContactForm bind:success />
	{:else if variant === 'async'}
		<ContactForm
			onsubmit={async (p) => {
				await new Promise((r) => setTimeout(r, 900));
				last = `${p.name} · ${p.email} · ${p.topic}`;
			}}
		/>
	{:else}
		<ContactForm
			onsubmit={(p) => {
				last = `${p.name} · ${p.email} · ${p.topic}`;
			}}
		/>
	{/if}

	{#if last}
		<p class="text-center text-xs text-muted">Submitted: {last}</p>
	{/if}
</div>
