<script lang="ts">
	import BlogPost from './BlogPost.svelte';
	import type { BlogPostLayout } from './BlogPost.svelte';
	import Callout from '$lib/components/molecules/Callout/Callout.svelte';
	import CommentThread from '$lib/components/organisms/CommentThread/CommentThread.svelte';
	import type { CommentItem } from '$lib/components/organisms/CommentThread/CommentThread.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Bookmark from '@lucide/svelte/icons/bookmark';

	interface Props {
		layout?: BlogPostLayout;
		showToc?: boolean;
	}

	let { layout = 'with-toc', showToc = true }: Props = $props();

	let bookmarked = $state(false);
	let thread = $state<CommentItem[]>([
		{
			id: '1',
			author: 'Maya Chen',
			avatar: 'https://i.pravatar.cc/80?img=20',
			content: 'The TOC + author card combo is exactly what our handbook was missing.',
			date: Date.now() - 1000 * 60 * 55,
			replies: [
				{
					id: '1a',
					author: 'Rafael Gonzalez',
					avatar: 'https://i.pravatar.cc/80?img=12',
					content: 'Glad it helps — next up is series navigation.',
					date: Date.now() - 1000 * 60 * 20
				}
			]
		},
		{
			id: '2',
			author: 'Jordan Lee',
			avatar: 'https://i.pravatar.cc/80?img=33',
			content: 'Love the related posts grid. Can we pin a “start here” article?',
			date: Date.now() - 1000 * 60 * 180
		}
	]);

	const toc = [
		{ id: 'primitives', label: 'Start with primitives', depth: 1 },
		{ id: 'composition', label: 'Composition rules', depth: 1 },
		{ id: 'tokens', label: 'Tokens before variants', depth: 2 },
		{ id: 'templates', label: 'Page templates as glue', depth: 1 },
		{ id: 'checklist', label: 'Ship checklist', depth: 1 }
	];
</script>

<div class="p-4 sm:p-8">
	<BlogPost
		title="Designing component libraries that scale"
		excerpt="Patterns for atoms, molecules, organisms, and page templates that stay coherent as the product grows — without slowing teams down."
		category="Design systems"
		tags={['Svelte', 'Architecture', 'DX']}
		date={Date.now() - 1000 * 60 * 60 * 48}
		updatedAt={Date.now() - 1000 * 60 * 60 * 6}
		readingMinutes={9}
		cover="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&q=80"
		coverCaption="A calm editor surface leaves room for the system to do the talking."
		featuredNote="This post is part of our “Build once, ship everywhere” series."
		layout={showToc ? layout : 'stacked'}
		toc={showToc ? toc : []}
		breadcrumbs={[
			{ id: 'home', label: 'Blog', href: '#' },
			{ id: 'ds', label: 'Design systems', href: '#' },
			{ id: 'current', label: 'Libraries that scale' }
		]}
		authors={[
			{
				name: 'Rafael Gonzalez',
				avatar: 'https://i.pravatar.cc/80?img=12',
				role: 'Design Engineer · R2DigiSolutions',
				bio: 'Builds product UI systems in Svelte. Obsessed with clear layers, boring APIs, and delightful defaults.',
				href: '#'
			},
			{
				name: 'Alex Rivera',
				avatar: 'https://i.pravatar.cc/80?img=32',
				role: 'Staff Designer'
			}
		]}
		prev={{ id: 'tokens', title: 'Token naming that survives rebrands' }}
		next={{ id: 'docs', title: 'Docs that feel like a product' }}
		related={[
			{
				id: 'r1',
				title: 'Atomic layers without the dogma',
				excerpt: 'When to break the pyramid — and when not to.',
				cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
				readingMinutes: 5,
				date: Date.now() - 1000 * 60 * 60 * 24 * 9,
				tags: ['Architecture']
			},
			{
				id: 'r2',
				title: 'Storybook as a design contract',
				excerpt: 'Stories that document intent, not just props.',
				cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
				readingMinutes: 7,
				date: Date.now() - 1000 * 60 * 60 * 24 * 16,
				tags: ['DX']
			},
			{
				id: 'r3',
				title: 'Migration playbooks for UI kits',
				excerpt: 'Ship incremental upgrades without breaking product teams.',
				cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
				readingMinutes: 8,
				date: Date.now() - 1000 * 60 * 60 * 24 * 28,
				tags: ['Process']
			}
		]}
		newsletterTitle="Ship better UI systems"
		newsletterDescription="One practical note every other week — patterns, pitfalls, and library updates."
	>
		{#snippet actions()}
			<IconButton
				size="sm"
				variant={bookmarked ? 'primary' : 'ghost'}
				label="Bookmark"
				onclick={() => (bookmarked = !bookmarked)}
			>
				<Bookmark class="h-4 w-4" />
			</IconButton>
		{/snippet}

		{#snippet comments()}
			<CommentThread comments={thread} />
		{/snippet}

		<p>
			Most component libraries fail for the same reason products do: unclear ownership between layers.
			Atoms start absorbing layout. Organisms grow secret business rules. Templates become copy-paste
			graveyards.
		</p>

		<h2 id="primitives">Start with primitives</h2>
		<p>
			Keep atoms boring and predictable. A <code>Button</code> should know about variants and sizes —
			not about billing plans or onboarding steps. If a prop smells like domain language, it probably
			belongs one level up.
		</p>

		<blockquote>
			“The best API is the one that makes the next engineer’s decision obvious.”
		</blockquote>

		<h2 id="composition">Composition rules</h2>
		<p>
			Molecules compose atoms into a single interaction. Organisms compose molecules into a user goal.
			When an organism needs three unrelated goals, split it — don’t hide complexity behind more props.
		</p>

		<h3 id="tokens">Tokens before variants</h3>
		<p>
			Prefer semantic tokens (<code>surface</code>, <code>border</code>, <code>brand</code>) over one-off
			hex values. Variants should remix tokens, not invent new color systems.
		</p>

		<pre><code>{`@theme {
  --color-surface: var(--surface);
  --color-brand-500: oklch(55% 0.25 265);
}`}</code></pre>

		<Callout tone="success" title="Rule of thumb">
			If two components need the same visual decision, promote it to a token or a shared molecule.
		</Callout>

		<h2 id="templates">Page templates as glue</h2>
		<p>
			Templates own rhythm: max widths, section spacing, sticky chrome. They should feel opinionated so
			product teams stop reinventing page chrome for every feature.
		</p>
		<ul>
			<li>One scroll model per template</li>
			<li>Predictable header / aside / footer slots</li>
			<li>Empty, loading, and error states as first-class citizens</li>
		</ul>

		<h2 id="checklist">Ship checklist</h2>
		<ol>
			<li>Story covers default, empty, and edge density</li>
			<li>Keyboard path equals mouse path</li>
			<li>Tokens only — no stray hex in component CSS</li>
			<li>Public props documented in Storybook autodocs</li>
		</ol>

		<p>
			Do that consistently and the library stops being a drawer of widgets — it becomes the product’s
			shared language.
		</p>
	</BlogPost>
</div>
