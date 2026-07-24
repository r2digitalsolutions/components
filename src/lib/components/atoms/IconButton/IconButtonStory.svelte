<script lang="ts">
	import IconButton from './IconButton.svelte';

	let props = $props<{
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		rounded?: boolean;
		loading?: boolean;
		disabled?: boolean;
	}>();
</script>

<div class="flex flex-wrap items-center gap-3">
	<IconButton
		label="Settings"
		variant={props.variant ?? 'ghost'}
		size={props.size ?? 'md'}
		rounded={props.rounded ?? false}
		loading={props.loading ?? false}
		disabled={props.disabled ?? false}
	>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-full w-full">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
			/>
			<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
		</svg>
	</IconButton>
	<IconButton label="Search" variant="secondary" size={props.size ?? 'md'} rounded={props.rounded ?? false}>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-full w-full">
			<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
		</svg>
	</IconButton>
	<IconButton label="Delete" variant="destructive" size={props.size ?? 'md'} rounded={props.rounded ?? false}>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-full w-full">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h8"
			/>
		</svg>
	</IconButton>
</div>
