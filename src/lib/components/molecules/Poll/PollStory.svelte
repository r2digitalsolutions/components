<script lang="ts">
	import Poll, { type PollLayout, type PollOption, type PollSize } from './Poll.svelte';

	type Example =
		| 'release'
		| 'results'
		| 'binary'
		| 'multiple'
		| 'cards'
		| 'changeable'
		| 'closed';

	let props = $props<{
		example?: Example;
		size?: PollSize;
		layout?: PollLayout;
		showResults?: boolean;
		allowChange?: boolean;
		multiple?: boolean;
		showPercent?: boolean;
		showCounts?: boolean;
		sortByVotes?: boolean;
		disabled?: boolean;
	}>();

	const example = $derived(props.example ?? 'release');

	let releaseOptions = $state<PollOption[]>([
		{ id: 'a', label: 'Ship weekly', description: 'Predictable cadence', votes: 12 },
		{ id: 'b', label: 'Ship when ready', description: 'Quality first', votes: 28 },
		{ id: 'c', label: 'Continuous deploy', description: 'Every merge', votes: 19 }
	]);
	let releaseValue = $state<string | null>(null);
	let releaseTotal = $state(59);

	let binaryOptions = $state<PollOption[]>([
		{ id: 'yes', label: 'Yes — launch Friday', votes: 142 },
		{ id: 'no', label: 'No — wait for QA', votes: 87 }
	]);
	let binaryValue = $state<string | null>(null);
	let binaryTotal = $state(229);

	let multiOptions = $state<PollOption[]>([
		{ id: 'docs', label: 'Better docs', votes: 44 },
		{ id: 'perf', label: 'Performance', votes: 61 },
		{ id: 'a11y', label: 'Accessibility', votes: 38 },
		{ id: 'themes', label: 'Themes', votes: 25 },
		{ id: 'mobile', label: 'Mobile polish', votes: 52 }
	]);
	let multiValue = $state<string[]>([]);
	let multiTotal = $state(220);

	let cardOptions = $state<PollOption[]>([
		{ id: 'svelte', label: 'Svelte', description: 'Compiler-first', votes: 90 },
		{ id: 'react', label: 'React', description: 'Huge ecosystem', votes: 110 },
		{ id: 'vue', label: 'Vue', description: 'Approachable', votes: 70 },
		{ id: 'solid', label: 'Solid', description: 'Fine-grained', votes: 40 }
	]);
	let cardValue = $state<string | null>(null);
	let cardTotal = $state(310);

	let last = $state('—');
</script>

<div class="w-full max-w-md space-y-2">
	<p class="text-xs text-secondary">
		Last vote: <span class="font-medium text-primary">{last}</span>
	</p>

	{#if example === 'results'}
		<Poll
			question="Preferred release cadence?"
			description="Engineering team pulse check"
			bind:options={releaseOptions}
			bind:value={releaseValue}
			bind:totalVotes={releaseTotal}
			showResults={true}
			showCounts={props.showCounts ?? true}
			showPercent={props.showPercent ?? true}
			sortByVotes={props.sortByVotes ?? true}
			size={props.size ?? 'md'}
			hint="Anonymous · closed"
			disabled={props.disabled ?? false}
		/>
	{:else if example === 'binary'}
		<Poll
			question="Ship the beta this week?"
			bind:options={binaryOptions}
			bind:value={binaryValue}
			bind:totalVotes={binaryTotal}
			size={props.size ?? 'md'}
			showResults={props.showResults ?? false}
			allowChange={props.allowChange ?? false}
			showCounts={props.showCounts ?? false}
			hint="Closes in 2 days"
			onchange={(v) => (last = String(v))}
		/>
	{:else if example === 'multiple'}
		<Poll
			question="What should we prioritize next?"
			description="Pick up to 2 themes"
			bind:options={multiOptions}
			bind:value={multiValue}
			bind:totalVotes={multiTotal}
			multiple
			maxSelections={2}
			size={props.size ?? 'md'}
			showCounts={props.showCounts ?? true}
			showPercent={props.showPercent ?? true}
			hint="Multi-select"
			onchange={(v) => (last = Array.isArray(v) ? v.join(', ') : String(v))}
		/>
	{:else if example === 'cards'}
		<Poll
			question="Favorite UI framework?"
			bind:options={cardOptions}
			bind:value={cardValue}
			bind:totalVotes={cardTotal}
			layout="cards"
			size={props.size ?? 'md'}
			showResults={props.showResults ?? false}
			allowChange={props.allowChange ?? false}
			onchange={(v) => (last = String(v))}
		/>
	{:else if example === 'changeable'}
		<Poll
			question="Preferred release cadence?"
			bind:options={releaseOptions}
			bind:value={releaseValue}
			bind:totalVotes={releaseTotal}
			allowChange={true}
			showCounts={true}
			size={props.size ?? 'md'}
			hint="You can change your vote"
			onchange={(v) => (last = String(v))}
		/>
	{:else if example === 'closed'}
		<Poll
			question="Office snack budget?"
			options={[
				{ id: 'fruit', label: 'Fresh fruit', votes: 34 },
				{ id: 'coffee', label: 'Better coffee', votes: 58 },
				{ id: 'both', label: 'Both, obviously', votes: 91 }
			]}
			value="both"
			totalVotes={183}
			showResults
			sortByVotes
			showCounts
			disabled
			hint="Poll closed"
			size={props.size ?? 'md'}
		/>
	{:else}
		<Poll
			question="Preferred release cadence?"
			description="Help shape the engineering calendar"
			bind:options={releaseOptions}
			bind:value={releaseValue}
			bind:totalVotes={releaseTotal}
			size={props.size ?? 'md'}
			layout={props.layout ?? 'list'}
			showResults={props.showResults ?? false}
			allowChange={props.allowChange ?? false}
			showPercent={props.showPercent ?? true}
			showCounts={props.showCounts ?? false}
			sortByVotes={props.sortByVotes ?? false}
			disabled={props.disabled ?? false}
			hint="Anonymous"
			onchange={(v) => (last = String(v))}
		/>
	{/if}
</div>
