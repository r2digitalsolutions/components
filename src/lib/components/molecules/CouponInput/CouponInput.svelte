<script lang="ts">
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export type CouponStatus = 'idle' | 'loading' | 'valid' | 'invalid';

	interface CouponInputProps {
		value?: string;
		label?: string;
		placeholder?: string;
		applyLabel?: string;
		removeLabel?: string;
		status?: CouponStatus;
		message?: string;
		disabled?: boolean;
		size?: 'sm' | 'md';
		class?: string;
		onapply?: (code: string) => void;
		onremove?: () => void;
	}

	let {
		value = $bindable(''),
		label = 'Coupon code',
		placeholder = 'SAVE20',
		applyLabel = 'Apply',
		removeLabel = 'Remove',
		status = 'idle',
		message,
		disabled = false,
		size = 'md',
		class: className = '',
		onapply,
		onremove
	}: CouponInputProps = $props();

	const applied = $derived(status === 'valid');
	const busy = $derived(status === 'loading');

	function apply() {
		const code = value.trim();
		if (!code || disabled || busy || applied) return;
		onapply?.(code);
	}

	function remove() {
		onremove?.();
	}

	function onsubmit(e: Event) {
		e.preventDefault();
		if (applied) remove();
		else apply();
	}
</script>

<form class={['w-full', className]} {onsubmit}>
	{#if label}
		<p class="mb-1.5 text-sm font-medium text-primary">{label}</p>
	{/if}
	<div class="flex gap-2">
		<div class="min-w-0 flex-1">
			<Input
				bind:value
				{placeholder}
				{disabled}
				readonly={applied}
				size={size === 'sm' ? 'sm' : 'md'}
				status={status === 'invalid' ? 'error' : status === 'valid' ? 'success' : 'default'}
			/>
		</div>
		{#if applied}
			<Button variant="secondary" size={size === 'sm' ? 'sm' : 'md'} {disabled} type="submit">
				{removeLabel}
			</Button>
		{:else}
			<Button
				variant="primary"
				size={size === 'sm' ? 'sm' : 'md'}
				disabled={disabled || busy || !value.trim()}
				loading={busy}
				type="submit"
			>
				{applyLabel}
			</Button>
		{/if}
	</div>
	{#if message}
		<p
			class={[
				'mt-1.5 text-xs',
				status === 'invalid' && 'text-red-600 dark:text-red-400',
				status === 'valid' && 'text-emerald-600 dark:text-emerald-400',
				status !== 'invalid' && status !== 'valid' && 'text-secondary'
			]}
		>
			{message}
		</p>
	{/if}
</form>
