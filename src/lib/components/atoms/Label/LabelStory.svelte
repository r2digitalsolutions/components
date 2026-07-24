<script lang="ts">
	import Label from './Label.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';

	let props = $props<{
		required?: boolean;
		optional?: boolean;
		size?: 'sm' | 'md' | 'lg';
	}>();
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
	<div class="flex flex-col gap-1.5">
		<Label for="email" required={props.required ?? true} size={props.size ?? 'md'}>Email</Label>
		<Input id="email" type="email" placeholder="you@example.com" />
	</div>
	<div class="flex flex-col gap-1.5">
		<Label for="nickname" optional={props.optional ?? true} size={props.size ?? 'md'}>Nickname</Label>
		<Input id="nickname" placeholder="Optional nickname" />
	</div>
</div>
