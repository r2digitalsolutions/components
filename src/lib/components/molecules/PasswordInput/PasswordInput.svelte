<script lang="ts">
	import Input from '$lib/components/atoms/Input/Input.svelte';

	interface PasswordInputProps {
		id?: string;
		name?: string;
		value?: string;
		label?: string;
		placeholder?: string;
		helperText?: string;
		disabled?: boolean;
		required?: boolean;
		size?: 'sm' | 'md' | 'lg';
		status?: 'default' | 'error' | 'success' | 'warning';
		class?: string;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
	}

	let {
		id,
		name,
		value = $bindable(''),
		label = 'Password',
		placeholder = 'Enter password',
		helperText,
		disabled = false,
		required = false,
		size = 'md',
		status = 'default',
		class: className = '',
		oninput,
		onchange
	}: PasswordInputProps = $props();

	let visible = $state(false);
</script>

<div class={className}>
	<Input
		{id}
		{name}
		{label}
		{placeholder}
		{helperText}
		{disabled}
		{required}
		{size}
		{status}
		type={visible ? 'text' : 'password'}
		bind:value
		{oninput}
		{onchange}
	>
		{#snippet trailIcon()}
			<button
				type="button"
				{disabled}
				onclick={() => (visible = !visible)}
				class="rounded text-muted hover:text-primary disabled:opacity-40"
				aria-label={visible ? 'Hide password' : 'Show password'}
			>
				{#if visible}
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18M10.6 10.6A2 2 0 0012 14a2 2 0 001.4-.6M9.9 5.1A9.8 9.8 0 0112 5c5 0 9.3 3.1 11 7.5a11.4 11.4 0 01-4.1 5.1M6.1 6.1A11.4 11.4 0 001 12.5C2.7 16.9 7 20 12 20c1.4 0 2.7-.2 3.9-.7" />
					</svg>
				{:else}
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M1 12.5C2.7 8.1 7 5 12 5s9.3 3.1 11 7.5C21.3 16.9 17 20 12 20S2.7 16.9 1 12.5z" />
						<circle cx="12" cy="12.5" r="3" />
					</svg>
				{/if}
			</button>
		{/snippet}
	</Input>
</div>
