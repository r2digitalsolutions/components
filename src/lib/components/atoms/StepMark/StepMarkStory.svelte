<script lang="ts">
	import StepMark from './StepMark.svelte';
</script>

<div class="flex flex-col gap-3">
	<StepMark step={1} state="complete" label="Account" />
	<StepMark step={2} state="current" label="Workspace" />
	<StepMark step={3} state="upcoming" label="Invite team" />
</div>
