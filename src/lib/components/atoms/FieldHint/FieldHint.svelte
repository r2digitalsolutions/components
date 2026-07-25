<script lang="ts">
	export type FieldHintTone = 'muted' | 'info' | 'success' | 'warning' | 'error';

	interface FieldHintProps {
		text: string;
		tone?: FieldHintTone;
		id?: string;
		class?: string;
	}

	const { text, tone = 'muted', id, class: className = '' }: FieldHintProps = $props();

	const tones: Record<FieldHintTone, string> = {
		muted: 'text-muted',
		info: 'text-sky-600 dark:text-sky-400',
		success: 'text-green-600 dark:text-green-400',
		warning: 'text-amber-600 dark:text-amber-400',
		error: 'text-red-600 dark:text-red-400'
	};
</script>

<p {id} class={['text-xs leading-relaxed', tones[tone], className]} role={tone === 'error' ? 'alert' : undefined}>
	{text}
</p>
