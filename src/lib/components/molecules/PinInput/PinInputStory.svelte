<script lang="ts">
	import PinInput from './PinInput.svelte';

	let props = $props<{
		length?: number;
		value?: string;
		label?: string;
		helperText?: string;
		status?: 'default' | 'error' | 'success';
		disabled?: boolean;
		type?: 'text' | 'number' | 'password';
	}>();
</script>

<div class="w-80 max-w-full">
	<PinInput
		length={props.length ?? 4}
		label={props.label ?? 'Security Code (OTP)'}
		helperText={props.helperText ?? 'Enter the 4-digit code sent to your mobile.'}
		status={props.status ?? 'default'}
		disabled={props.disabled ?? false}
		type={props.type ?? 'number'}
		value={props.value ?? ''}
	/>
</div>
