<script lang="ts">
	import Stories from './Stories.svelte';
	import type { StoryItem } from './Stories.svelte';

	const avatars = {
		elena: 'https://i.pravatar.cc/150?u=elena',
		kai: 'https://i.pravatar.cc/150?u=kai',
		nora: 'https://i.pravatar.cc/150?u=nora',
		omar: 'https://i.pravatar.cc/150?u=omar',
		ivy: 'https://i.pravatar.cc/150?u=ivy',
		sam: 'https://i.pravatar.cc/150?u=sam'
	};

	let items = $state<StoryItem[]>([
		{ id: 'add', name: 'You', add: true },
		{
			id: '2',
			name: 'Elena',
			avatar: avatars.elena,
			live: true,
			slides: [
				{
					src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80',
					caption: 'Morning coffee run ☕',
					duration: 4000
				},
				{
					src: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
					caption: 'New café downtown',
					duration: 4500
				}
			]
		},
		{
			id: '3',
			name: 'Kai',
			avatar: avatars.kai,
			slides: [
				{
					src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80',
					caption: 'Trail day',
					duration: 5000
				}
			]
		},
		{
			id: '4',
			name: 'Nora',
			avatar: avatars.nora,
			slides: [
				{
					src: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800&q=80',
					duration: 4000
				},
				{
					src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
					caption: 'Weekend lookbook',
					duration: 5000
				},
				{
					src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
					duration: 4000
				}
			]
		},
		{
			id: '5',
			name: 'Omar',
			avatar: avatars.omar,
			seen: true,
			slides: [
				{
					src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
					caption: 'Dinner recommendations',
					duration: 4500
				}
			]
		},
		{
			id: '6',
			name: 'Ivy',
			avatar: avatars.ivy,
			slides: [
				{
					src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
					caption: 'Blue hour',
					duration: 5000
				}
			]
		},
		{
			id: '7',
			name: 'Sam',
			avatar: avatars.sam,
			slides: [
				{
					src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
					duration: 4000
				}
			]
		}
	]);

	let open = $state(false);
	let activeId = $state<string | null>(null);
	let log = $state('Tap a story to open the viewer');
</script>

<div class="space-y-8">
	<section class="space-y-2">
		<h3 class="text-xs font-semibold uppercase tracking-wide text-muted">Reel + viewer</h3>
		<p class="text-xs text-secondary">
			Tap to open · hold to pause · swipe ←/→ between stories · Esc closes
		</p>
		<div class="max-w-md rounded-2xl border border-border bg-surface-elevated p-3">
			<Stories
				bind:items
				bind:open
				bind:activeId
				onadd={() => (log = 'Add story tapped')}
				onopen={(id) => (log = `Opened ${id}`)}
				onclose={() => (log = 'Viewer closed')}
				oncomplete={() => (log = 'Finished all stories')}
				onseen={(id) => (log = `Marked seen: ${id}`)}
			/>
		</div>
		<p class="text-xs text-muted">{log}</p>
	</section>

	<section class="space-y-2">
		<h3 class="text-xs font-semibold uppercase tracking-wide text-muted">Sizes</h3>
		<div class="max-w-md space-y-4 rounded-2xl border border-border bg-surface-elevated p-3">
			<Stories
				size="sm"
				showLabels={false}
				items={[
					{ id: 's1', name: 'A', avatar: avatars.elena },
					{ id: 's2', name: 'B', avatar: avatars.kai, seen: true },
					{ id: 's3', name: 'C', avatar: avatars.nora, live: true },
					{ id: 's4', name: 'D', avatar: avatars.omar },
					{ id: 's5', name: 'E', avatar: avatars.ivy }
				]}
			/>
			<Stories
				size="lg"
				items={[
					{ id: 'l1', name: 'Elena', avatar: avatars.elena },
					{ id: 'l2', name: 'Kai', avatar: avatars.kai },
					{ id: 'l3', name: 'Nora', avatar: avatars.nora, seen: true }
				]}
			/>
		</div>
	</section>
</div>
