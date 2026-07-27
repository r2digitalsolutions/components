<script lang="ts">
	import ThreadReply from './ThreadReply.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
</script>

<div class="max-w-lg space-y-3">
	<p class="text-sm font-semibold text-primary">Thread replies</p>
	<Stack gap="md">
		<ThreadReply
			author="Maya Chen"
			avatar="https://i.pravatar.cc/80?img=5"
			body="Can we align the spacing with the design tokens doc?"
			time="10:24 AM"
			onreply={() => {}}
		/>
		<ThreadReply
			author="Alex Rivera"
			body="Yes — I'll update the FormSection padding in the next PR."
			time="10:31 AM"
			depth={1}
			onreply={() => {}}
		/>
		<ThreadReply
			author="Jordan Lee"
			body="Sounds good. I'll review once it's up."
			time="10:35 AM"
			depth={2}
		/>
	</Stack>
</div>
