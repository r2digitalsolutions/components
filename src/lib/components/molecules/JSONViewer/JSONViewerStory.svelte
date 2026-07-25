<script lang="ts">
	import JSONViewer from './JSONViewer.svelte';

	let {
		collapsed = false,
		defaultExpandDepth = 1,
		showToolbar = true,
		variant = 'api'
	}: {
		collapsed?: boolean;
		defaultExpandDepth?: number;
		showToolbar?: boolean;
		variant?: 'api' | 'nested' | 'array' | 'string' | 'minimal';
	} = $props();

	const apiPayload = {
		ok: true,
		user: {
			id: 42,
			name: 'Alex Rivera',
			email: 'alex@r2digi.dev',
			roles: ['admin', 'editor'],
			profile: {
				locale: 'es-ES',
				theme: 'system',
				notifications: { email: true, push: false }
			}
		},
		meta: {
			version: '1.2.0',
			requestId: 'req_9f3a',
			durationMs: 18.4,
			active: true,
			deprecated: null
		},
		tags: ['svelte', 'ui', 'design-system']
	};

	const nested = {
		a: {
			b: {
				c: {
					d: { value: 'deep', count: 3 },
					list: [1, 2, { ok: true }]
				}
			}
		}
	};

	const list = [
		{ id: 1, title: 'Ship lightbox', done: true },
		{ id: 2, title: 'Polish markdown', done: true },
		{ id: 3, title: 'Improve JSON viewer', done: false }
	];

	const asString = JSON.stringify(apiPayload);

	const data = $derived(
		variant === 'nested'
			? nested
			: variant === 'array'
				? list
				: variant === 'string'
					? asString
					: apiPayload
	);

	const label = $derived(
		variant === 'array'
			? 'Tasks'
			: variant === 'nested'
				? 'Deep tree'
				: variant === 'string'
					? 'Parsed from string'
					: 'API response'
	);
</script>

<div class="w-full max-w-xl space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">JSON viewer</p>
		<p class="text-xs leading-relaxed text-secondary">
			Expand nodes, filter keys/values, and copy the formatted JSON. Strings, numbers, booleans and
			null are color-coded.
		</p>
	</div>

	<JSONViewer
		{data}
		{collapsed}
		{defaultExpandDepth}
		showToolbar={variant === 'minimal' ? false : showToolbar}
		{label}
		maxHeight="22rem"
	/>
</div>
