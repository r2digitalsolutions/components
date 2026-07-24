<script lang="ts">
	import Descriptions from './Descriptions.svelte';
	import type { DescriptionItem } from './Descriptions.svelte';

	let props = $props<{
		columns?: 1 | 2 | 3;
		bordered?: boolean;
		size?: 'sm' | 'md';
		title?: string;
	}>();

	const items: DescriptionItem[] = [
		{ label: 'Name', value: 'Ada Lovelace' },
		{ label: 'Email', value: 'ada@example.com' },
		{ label: 'Role', value: 'Administrator' },
		{ label: 'Plan', value: 'Pro' },
		{ label: 'Joined', value: 'March 12, 2024', span: 2 },
		{ label: 'Notes', value: 'Early adopter and design partner.', span: 2 }
	];
</script>

<div class="w-full max-w-2xl">
	<Descriptions
		{items}
		title={props.title ?? 'User profile'}
		columns={props.columns ?? 2}
		bordered={props.bordered ?? true}
		size={props.size ?? 'md'}
	/>
</div>
