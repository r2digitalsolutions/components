<script lang="ts">
	import type { Snippet } from 'svelte';
	import { i18n, type LocaleCode, type UiMessages } from '$lib/utils/i18n.svelte.js';

	interface I18nProviderProps {
		locale?: LocaleCode;
		/** Partial overrides merged over the built-in dictionary */
		messages?: Partial<UiMessages>;
		children?: Snippet;
	}

	let {
		locale = $bindable<LocaleCode>(i18n.locale),
		messages,
		children
	}: I18nProviderProps = $props();

	$effect.pre(() => {
		if (messages) i18n.extend(messages);
	});

	$effect(() => {
		if (locale !== i18n.locale) i18n.set(locale);
	});

	$effect(() => {
		if (i18n.locale !== locale) locale = i18n.locale;
	});
</script>

{#if children}
	{@render children()}
{/if}
