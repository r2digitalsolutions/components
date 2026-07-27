<script lang="ts">
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import CopyButton from '$lib/components/molecules/CopyButton/CopyButton.svelte';

	interface SecretFieldProps {
		value?: string;
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		revealLabel?: string;
		hideLabel?: string;
		class?: string;
		onchange?: (value: string) => void;
		onreveal?: () => void;
		oncopy?: () => void;
	}

	let {
		value = $bindable(''),
		label = 'Secret',
		placeholder = '••••••••••••',
		disabled = false,
		revealLabel = 'Reveal',
		hideLabel = 'Hide',
		class: className = '',
		onchange,
		onreveal,
		oncopy
	}: SecretFieldProps = $props();

	let revealed = $state(false);

	function toggle() {
		revealed = !revealed;
		if (revealed) onreveal?.();
	}
</script>

<div class={['flex flex-col gap-1.5', className]} data-secret-field>
	{#if label}
		<span class="text-xs font-medium text-secondary">{label}</span>
	{/if}
	<div class="flex items-center gap-2">
		<Input
			type={revealed ? 'text' : 'password'}
			bind:value
			{placeholder}
			{disabled}
			class="flex-1 font-mono"
			oninput={(e) => onchange?.((e.currentTarget as HTMLInputElement).value)}
		/>
		<Button size="sm" variant="secondary" {disabled} onclick={toggle}>
			{revealed ? hideLabel : revealLabel}
		</Button>
		<CopyButton {value} size="sm" oncopy={oncopy} />
	</div>
</div>
