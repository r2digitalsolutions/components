<script lang="ts">
	import DesktopTemplate from './DesktopTemplate.svelte';
</script>

<div class="p-2">
	<DesktopTemplate brand="R2 Desktop">
		{#snippet render(win)}
			<div class="space-y-2 p-4 text-sm text-secondary">
				<p class="font-medium text-primary">{win.title}</p>
				{#if win.id === 'files'}
					<ul class="list-disc space-y-1 pl-4 text-muted">
						<li>Contracts.pdf</li>
						<li>Brand kit.zip</li>
						<li>Screenshots/</li>
					</ul>
				{:else if win.id === 'notes'}
					<p>Ship the dashboard builder and desktop shell this week.</p>
				{:else if win.id === 'settings'}
					<p>Theme, language, and notification preferences go here.</p>
				{:else}
					<p>Mini dashboard widgets live in this window.</p>
				{/if}
			</div>
		{/snippet}
	</DesktopTemplate>
</div>
