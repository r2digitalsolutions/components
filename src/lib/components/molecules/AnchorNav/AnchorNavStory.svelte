<script lang="ts">
	import AnchorNav from './AnchorNav.svelte';

	let activeId = $state('intro');
</script>

<div class="grid max-w-2xl gap-6 sm:grid-cols-[10rem_1fr]">
	<AnchorNav
		bind:activeId
		items={[
			{ id: 'intro', label: 'Introduction' },
			{ id: 'install', label: 'Install' },
			{ id: 'usage', label: 'Usage' }
		]}
	/>
	<div class="space-y-8 text-sm text-secondary">
		<section id="intro" class="scroll-mt-4">
			<h3 class="mb-1 font-semibold text-primary">Introduction</h3>
			<p>Anchor nav jumps to page sections.</p>
		</section>
		<section id="install" class="scroll-mt-4">
			<h3 class="mb-1 font-semibold text-primary">Install</h3>
			<p>Add the package and import components.</p>
		</section>
		<section id="usage" class="scroll-mt-4">
			<h3 class="mb-1 font-semibold text-primary">Usage</h3>
			<p>Bind activeId or let clicks scroll for you.</p>
		</section>
	</div>
</div>
