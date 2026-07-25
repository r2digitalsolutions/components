<script lang="ts">
	import Code from './Code.svelte';

	let props = $props<{ block?: boolean; size?: 'sm' | 'md' }>();
</script>

<div class="space-y-3 text-sm text-secondary">
	<p>
		Install with
		<Code size={props.size ?? 'sm'}>npm i @r2digisolutions/components</Code>
	</p>
	{#if props.block}
		<Code block size={props.size ?? 'sm'}>import {'{ Button }'} from '@r2digisolutions/components';</Code>
	{:else}
		<Code block>import {'{ Button }'} from '@r2digisolutions/components';</Code>
	{/if}
</div>
