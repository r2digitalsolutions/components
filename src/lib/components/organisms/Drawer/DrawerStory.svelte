<script lang="ts">
	import Drawer from './Drawer.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		title?: string;
		description?: string;
		side?: 'left' | 'right' | 'top' | 'bottom';
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		showClose?: boolean;
		blurBackdrop?: boolean;
	}>();

	let open = $state(false);
</script>

<div class="space-y-3">
	<Button onclick={() => (open = true)}>Open drawer</Button>

	<Drawer
		bind:open
		title={props.title ?? 'Filters'}
		description={props.description ?? 'Narrow results by status and owner.'}
		side={props.side ?? 'right'}
		size={props.size ?? 'md'}
		closeOnBackdrop={props.closeOnBackdrop ?? true}
		closeOnEscape={props.closeOnEscape ?? true}
		showClose={props.showClose ?? true}
		blurBackdrop={props.blurBackdrop ?? true}
	>
		<div class="space-y-4">
			<label class="block space-y-1.5">
				<span class="text-xs font-medium text-secondary">Status</span>
				<select class="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary">
					<option>All</option>
					<option>Active</option>
					<option>Archived</option>
				</select>
			</label>
			<label class="block space-y-1.5">
				<span class="text-xs font-medium text-secondary">Owner</span>
				<input
					class="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary"
					placeholder="Search owner…"
				/>
			</label>
			<p class="text-xs text-secondary">
				Drawer uses native <code class="text-primary">&lt;dialog&gt;</code> with side docking.
			</p>
		</div>

		{#snippet footer()}
			<div class="flex justify-end gap-2">
				<Button variant="secondary" size="sm" onclick={() => (open = false)}>Cancel</Button>
				<Button size="sm" onclick={() => (open = false)}>Apply</Button>
			</div>
		{/snippet}
	</Drawer>
</div>
