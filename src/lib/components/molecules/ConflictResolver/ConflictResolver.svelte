<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import DiffViewer from '$lib/components/molecules/DiffViewer/DiffViewer.svelte';
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';

	export type ConflictResolution = 'mine' | 'theirs' | 'manual';

	interface ConflictResolverProps {
		mine?: string;
		theirs?: string;
		mineLabel?: string;
		theirsLabel?: string;
		title?: string;
		class?: string;
		onresolve?: (result: { resolution: ConflictResolution; value: string }) => void;
	}

	let {
		mine = '',
		theirs = '',
		mineLabel = 'Yours',
		theirsLabel = 'Theirs',
		title = 'Resolve conflict',
		class: className = '',
		onresolve
	}: ConflictResolverProps = $props();

	let manual = $state(mine);
	let mode = $state<'diff' | 'manual'>('diff');

	function resolve(resolution: ConflictResolution) {
		const value = resolution === 'mine' ? mine : resolution === 'theirs' ? theirs : manual;
		onresolve?.({ resolution, value });
	}
</script>

<div
	class={['flex flex-col gap-3 rounded-xl border border-border bg-surface-elevated p-4', className]}
	data-conflict-resolver
>
	<div class="flex flex-wrap items-center justify-between gap-2">
		<div>
			<h3 class="text-sm font-semibold text-primary">{title}</h3>
			<p class="text-xs text-muted">Choose a side or edit a merged version.</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<Button size="sm" variant="secondary" onclick={() => resolve('mine')}>Keep mine</Button>
			<Button size="sm" variant="secondary" onclick={() => resolve('theirs')}>Keep theirs</Button>
			<Button
				size="sm"
				variant={mode === 'manual' ? 'primary' : 'ghost'}
				onclick={() => (mode = mode === 'manual' ? 'diff' : 'manual')}
			>
				Manual merge
			</Button>
		</div>
	</div>

	{#if mode === 'diff'}
		<DiffViewer
			before={theirs}
			after={mine}
			beforeLabel={theirsLabel}
			afterLabel={mineLabel}
			mode="split"
		/>
	{:else}
		<Textarea bind:value={manual} rows={12} class="font-mono text-xs" />
		<div class="flex justify-end">
			<Button size="sm" onclick={() => resolve('manual')}>Apply merge</Button>
		</div>
	{/if}
</div>
