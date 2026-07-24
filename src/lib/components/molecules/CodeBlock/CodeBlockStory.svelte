<script lang="ts">
	import CodeBlock from './CodeBlock.svelte';

	let {
		tone = 'adaptive',
		showLineNumbers = true,
		filename = 'Button.svelte'
	}: {
		tone?: 'adaptive' | 'contrast';
		showLineNumbers?: boolean;
		filename?: string;
	} = $props();

	const sample = `import { Button } from '@r2digisolutions/components';

// Primary CTA
const label = "Ship it";

export function Hero() {
  return <Button variant="primary">{label}</Button>;
}`;
</script>

<div class="w-[36rem] max-w-full">
	<CodeBlock
		code={sample}
		language="tsx"
		{filename}
		{tone}
		{showLineNumbers}
	/>
</div>
