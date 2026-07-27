<script lang="ts">
	import Prose from './Prose.svelte';
	import type {
		ProseAlign,
		ProseDensity,
		ProseMaxWidth,
		ProseSize,
		ProseTone
	} from './Prose.svelte';

	let props = $props<{
		size?: ProseSize;
		density?: ProseDensity;
		tone?: ProseTone;
		align?: ProseAlign;
		maxWidth?: ProseMaxWidth;
		subtleHeadings?: boolean;
		demo?: 'playground' | 'article' | 'sizes' | 'compact';
	}>();

	const demo = $derived(props.demo ?? 'playground');
	const sizes: ProseSize[] = ['sm', 'md', 'lg'];
</script>

{#if demo === 'playground'}
	<Prose
		size={props.size ?? 'md'}
		density={props.density ?? 'comfortable'}
		tone={props.tone ?? 'default'}
		align={props.align ?? 'left'}
		maxWidth={props.maxWidth ?? 'prose'}
		subtleHeadings={props.subtleHeadings ?? false}
	>
		<h2>Getting started</h2>
		<p>
			This component applies readable typography for long-form content. It styles headings, links,
			lists, and blockquotes using utility-aligned tokens.
		</p>
		<ul>
			<li>Consistent vertical rhythm with density presets</li>
			<li>Relaxed line height for body copy</li>
			<li>
				<a href="#prose">Styled links</a> with brand colors
			</li>
		</ul>
		<blockquote>A short pull quote for emphasis in articles or docs.</blockquote>
	</Prose>
{:else if demo === 'article'}
	<Prose size="md" density="relaxed" maxWidth="prose">
		<h1>Release notes</h1>
		<p>
			Version <strong>2.4.0</strong> ships a rewritten data grid, faster search, and improved
			keyboard support. Press <kbd>⌘</kbd> + <kbd>K</kbd> to open the command palette.
		</p>
		<h2>Highlights</h2>
		<ol>
			<li>Virtualized rows for 10k+ records</li>
			<li>
				Column pinning and sticky headers
				<ul>
					<li>Left and right pin support</li>
					<li>Persisted layout per workspace</li>
				</ul>
			</li>
			<li>Accessible focus rings on interactive cells</li>
		</ol>
		<pre><code>npm install @r2/components@2.4.0</code></pre>
		<p>
			Inline code like <code>useDataGrid()</code> picks up the same surface token as blocks.
		</p>
		<hr />
		<h3>Migration</h3>
		<table>
			<thead>
				<tr>
					<th>Before</th>
					<th>After</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>DataTable</code></td>
					<td><code>DataGrid</code></td>
				</tr>
				<tr>
					<td><code>rowHeight</code></td>
					<td><code>density</code></td>
				</tr>
			</tbody>
		</table>
		<blockquote>Prefer the new density prop over hard-coded row heights.</blockquote>
		<figure>
			<img
				src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=320&fit=crop"
				alt="Code on a monitor"
			/>
			<figcaption>Figure 1 — Editor surface used in the docs preview.</figcaption>
		</figure>
	</Prose>
{:else if demo === 'sizes'}
	<div class="flex flex-col gap-8">
		{#each sizes as size (size)}
			<div>
				<p class="mb-2 text-xs font-medium uppercase tracking-wide text-muted">size · {size}</p>
				<Prose {size} maxWidth="prose" subtleHeadings>
					<h2>Readable {size}</h2>
					<p>
						Body copy scales with the size token while headings stay proportional when
						<code>subtleHeadings</code> is enabled.
					</p>
				</Prose>
			</div>
		{/each}
	</div>
{:else}
	<div class="grid gap-8 md:grid-cols-2">
		<div>
			<p class="mb-2 text-xs font-medium uppercase tracking-wide text-muted">compact · muted</p>
			<Prose size="sm" density="compact" tone="muted" maxWidth="md">
				<h3>Changelog</h3>
				<p>Minor polish pass on empty states and focus order.</p>
				<ul>
					<li>Fixed skip link target</li>
					<li>Aligned badge padding</li>
				</ul>
			</Prose>
		</div>
		<div>
			<p class="mb-2 text-xs font-medium uppercase tracking-wide text-muted">center · xl</p>
			<Prose size="xl" density="comfortable" align="center" maxWidth="md" subtleHeadings>
				<h2>Welcome back</h2>
				<p>Pick up where you left off, or start something new.</p>
			</Prose>
		</div>
	</div>
{/if}
