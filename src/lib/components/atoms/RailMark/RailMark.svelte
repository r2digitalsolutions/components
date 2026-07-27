<script lang="ts">
	export type RailMarkSide = 'left' | 'right';
	export type RailMarkThickness = 'sm' | 'md' | 'lg';
	export type RailMarkTone = 'brand' | 'primary' | 'success' | 'warning' | 'danger' | 'muted';
	export type RailMarkInset = 'none' | 'sm' | 'md' | 'lg';
	export type RailMarkLength = 'full' | 'short' | 'auto';

	interface RailMarkProps {
		active?: boolean;
		side?: RailMarkSide;
		thickness?: RailMarkThickness;
		tone?: RailMarkTone;
		/** Vertical inset from the parent edges */
		inset?: RailMarkInset;
		/** full = stretch · short = centered stub · auto = match parent with inset */
		length?: RailMarkLength;
		rounded?: boolean;
		class?: string;
	}

	const {
		active = true,
		side = 'left',
		thickness = 'md',
		tone = 'brand',
		inset = 'md',
		length = 'auto',
		rounded = true,
		class: className = ''
	}: RailMarkProps = $props();

	const thicknessClasses: Record<RailMarkThickness, string> = {
		sm: 'w-0.5',
		md: 'w-1',
		lg: 'w-1.5'
	};

	const toneClasses: Record<RailMarkTone, string> = {
		brand: 'bg-brand-500',
		primary: 'bg-primary',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		danger: 'bg-red-500',
		muted: 'bg-border-strong'
	};

	const sideClasses: Record<RailMarkSide, string> = {
		left: 'left-0',
		right: 'right-0'
	};

	const insetClasses: Record<RailMarkInset, string> = {
		none: 'inset-y-0',
		sm: 'inset-y-0.5',
		md: 'inset-y-1',
		lg: 'inset-y-2'
	};

	const roundedClasses = $derived.by(() => {
		if (!rounded) return '';
		return side === 'left' ? 'rounded-r-full' : 'rounded-l-full';
	});

	const lengthClasses = $derived.by(() => {
		if (length === 'short') {
			return 'top-1/2 h-3 -translate-y-1/2';
		}
		if (length === 'full') {
			return 'inset-y-0';
		}
		return insetClasses[inset];
	});
</script>

<span
	class={[
		'pointer-events-none absolute transition-all duration-200',
		thicknessClasses[thickness],
		sideClasses[side],
		lengthClasses,
		roundedClasses,
		active ? toneClasses[tone] : 'bg-transparent opacity-0',
		className
	]}
	aria-hidden="true"
></span>
