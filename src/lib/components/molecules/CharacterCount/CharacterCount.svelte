<script lang="ts">
	export type CharacterCountMode = 'characters' | 'words' | 'both';

	interface CharacterCountProps {
		value?: string;
		max?: number;
		mode?: CharacterCountMode;
		warnAt?: number;
		class?: string;
	}

	const {
		value = '',
		max,
		mode = 'characters',
		warnAt = 0.9,
		class: className = ''
	}: CharacterCountProps = $props();

	const chars = $derived(value.length);
	const words = $derived(
		value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0
	);

	const ratio = $derived(max && max > 0 ? chars / max : 0);
	const over = $derived(max !== undefined && chars > max);
	const warn = $derived(!over && max !== undefined && ratio >= warnAt);

	const tone = $derived(
		over ? 'text-red-600 dark:text-red-400' : warn ? 'text-amber-600 dark:text-amber-400' : 'text-muted'
	);

	const label = $derived.by(() => {
		if (mode === 'words') {
			return max !== undefined ? `${words} / ${max} words` : `${words} words`;
		}
		if (mode === 'both') {
			const c = max !== undefined ? `${chars}/${max}` : String(chars);
			return `${c} chars · ${words} words`;
		}
		return max !== undefined ? `${chars} / ${max}` : String(chars);
	});
</script>

<p class={['text-xs tabular-nums', tone, className]} aria-live="polite">
	{label}
</p>
