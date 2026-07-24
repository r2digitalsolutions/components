<script lang="ts">
	import Timeline, { type TimelineItem } from './Timeline.svelte';

	let props = $props<{
		example?: 'deploy' | 'order' | 'onboarding' | 'activity';
		size?: 'sm' | 'md' | 'lg';
		showConnectors?: boolean;
	}>();

	const deploy: TimelineItem[] = [
		{
			id: '1',
			title: 'Deployment started',
			description: 'Build #482 queued on production.',
			timestamp: '10:02',
			status: 'default'
		},
		{
			id: '2',
			title: 'Tests passed',
			description: '142 checks green across unit, e2e and a11y.',
			timestamp: '10:08',
			status: 'success'
		},
		{
			id: '3',
			title: 'Smoke warning',
			description: 'Latency spike detected on EU region (p95 > 800ms).',
			timestamp: '10:11',
			status: 'warning'
		},
		{
			id: '4',
			title: 'Canary promoted',
			description: '10% traffic moved to the new release.',
			timestamp: '10:18',
			status: 'info'
		},
		{
			id: '5',
			title: 'Rollback available',
			description: 'Previous release still healthy if needed.',
			timestamp: '10:22',
			status: 'error'
		}
	];

	const order: TimelineItem[] = [
		{
			id: 'o1',
			title: 'Order placed',
			description: 'Order #10482 confirmed · €128.40',
			timestamp: 'Mon 09:14',
			status: 'success'
		},
		{
			id: 'o2',
			title: 'Payment captured',
			description: 'Visa •••• 4242',
			timestamp: 'Mon 09:14',
			status: 'success'
		},
		{
			id: 'o3',
			title: 'Packed at warehouse',
			description: 'Madrid FC · 2 items',
			timestamp: 'Tue 15:40',
			status: 'info'
		},
		{
			id: 'o4',
			title: 'Out for delivery',
			description: 'Courier: SEUR · ETA today 18:00',
			timestamp: 'Wed 08:05',
			status: 'default'
		},
		{
			id: 'o5',
			title: 'Delivered',
			description: 'Signed by Rafa G.',
			timestamp: 'Wed 17:22',
			status: 'success'
		}
	];

	const onboarding: TimelineItem[] = [
		{
			id: 'n1',
			title: 'Account created',
			description: 'Welcome email sent to rafa@r2digi.dev',
			timestamp: 'Step 1',
			status: 'success'
		},
		{
			id: 'n2',
			title: 'Workspace setup',
			description: 'Team “R2 Digi” created with 3 seats.',
			timestamp: 'Step 2',
			status: 'success'
		},
		{
			id: 'n3',
			title: 'Invite teammates',
			description: '2 invites pending acceptance.',
			timestamp: 'Step 3',
			status: 'warning'
		},
		{
			id: 'n4',
			title: 'Connect billing',
			description: 'Add a payment method to unlock production.',
			timestamp: 'Step 4',
			status: 'default'
		}
	];

	const activity: TimelineItem[] = [
		{
			id: 'a1',
			title: 'Sofia commented',
			description: '“Looks good — ship after the copy tweak on the empty state.”',
			timestamp: '2m ago',
			status: 'info'
		},
		{
			id: 'a2',
			title: 'Luis pushed',
			description: 'feat(timeline): continuous connectors',
			timestamp: '18m ago',
			status: 'default'
		},
		{
			id: 'a3',
			title: 'CI failed',
			description: 'lint · 1 error in NumberInput.svelte',
			timestamp: '22m ago',
			status: 'error'
		},
		{
			id: 'a4',
			title: 'Ana approved PR',
			description: '#318 · New molecules batch',
			timestamp: '1h ago',
			status: 'success'
		},
		{
			id: 'a5',
			title: 'Design review',
			description: 'Tokens and dark mode checked on Storybook.',
			timestamp: '3h ago',
			status: 'success'
		},
		{
			id: 'a6',
			title: 'Branch opened',
			description: 'feature/atomic-lote from main',
			timestamp: 'Yesterday',
			status: 'default'
		}
	];

	const map = { deploy, order, onboarding, activity } as Record<string, TimelineItem[]>;
	const items = $derived(map[props.example ?? 'deploy'] ?? deploy);
</script>

<div class="w-[26rem] max-w-full">
	<Timeline
		{items}
		size={props.size ?? 'md'}
		showConnectors={props.showConnectors ?? true}
	/>
</div>
