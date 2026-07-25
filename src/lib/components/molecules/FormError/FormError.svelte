<script lang="ts">
	import { getFormContext } from '$lib/utils/formContext.js';

	interface FormErrorProps {
		/**
		 * Field key in form errors. Use `_form` for form-level messages.
		 * Ignored when `message` is set.
		 */
		name?: string;
		/** Explicit message (skips context lookup when provided, including empty string). */
		message?: string;
		class?: string;
	}

	let {
		name = '_form',
		message,
		class: className = ''
	}: FormErrorProps = $props();

	const form = getFormContext();

	const text = $derived(
		message !== undefined ? message : (form?.getError(name) ?? '')
	);
</script>

{#if text}
	<p
		class={['text-xs leading-relaxed text-red-600 dark:text-red-400', className]}
		role="alert"
	>
		{text}
	</p>
{/if}
