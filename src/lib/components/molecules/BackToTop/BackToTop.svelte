<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';

	interface BackToTopProps {
		/** Pixels scrolled before the button appears. */
		threshold?: number;
		smooth?: boolean;
		label?: string;
		position?: 'bottom-right' | 'bottom-left';
		/**
		 * Scroll container to watch. Defaults to the window.
		 * Pass an element (e.g. an overflow panel) when the page itself doesn't scroll.
		 */
		target?: HTMLElement | null;
		/**
		 * `fixed` = viewport (default for window).
		 * `absolute` = relative to nearest positioned ancestor (use with a local `target`).
		 */
		mode?: 'fixed' | 'absolute';
		class?: string;
	}

	let {
		threshold = 320,
		smooth = true,
		label = 'Back to top',
		position = 'bottom-right',
		target = null,
		mode,
		class: className = ''
	}: BackToTopProps = $props();

	let visible = $state(false);

	const resolvedMode = $derived(mode ?? (target ? 'absolute' : 'fixed'));

	function getScrollTop(): number {
		if (target) return target.scrollTop;
		return window.scrollY || document.documentElement.scrollTop || 0;
	}

	function updateVisibility() {
		visible = getScrollTop() > threshold;
	}

	function scrollTop() {
		if (target) {
			target.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
			return;
		}
		window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
	}

	$effect(() => {
		updateVisibility();

		const el = target;
		if (el) {
			el.addEventListener('scroll', updateVisibility, { passive: true });
			return () => el.removeEventListener('scroll', updateVisibility);
		}

		window.addEventListener('scroll', updateVisibility, { passive: true });
		return () => window.removeEventListener('scroll', updateVisibility);
	});

	const positionClasses =
		position === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4';
</script>

{#if visible}
	<div
		class={[
			'z-40 transition-opacity duration-200',
			resolvedMode === 'fixed' ? 'fixed' : 'absolute',
			positionClasses,
			className
		]}
	>
		<IconButton {label} variant="secondary" rounded size="md" onclick={scrollTop}>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				class="h-full w-full"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
			</svg>
		</IconButton>
	</div>
{/if}
