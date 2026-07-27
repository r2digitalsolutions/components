<script lang="ts">
	export type CaretBlinkHeight = 'sm' | 'md' | 'lg' | 'xl';
	export type CaretBlinkTone = 'brand' | 'primary' | 'muted' | 'success' | 'warning' | 'danger';
	export type CaretBlinkSpeed = 'slow' | 'normal' | 'fast';
	export type CaretBlinkShape = 'bar' | 'block' | 'underscore';
	export type CaretBlinkThickness = 'thin' | 'md' | 'thick';

	interface CaretBlinkProps {
		visible?: boolean;
		height?: CaretBlinkHeight;
		tone?: CaretBlinkTone;
		speed?: CaretBlinkSpeed;
		shape?: CaretBlinkShape;
		thickness?: CaretBlinkThickness;
		/** Pause animation while keeping caret visible */
		paused?: boolean;
		class?: string;
	}

	const {
		visible = true,
		height = 'md',
		tone = 'brand',
		speed = 'normal',
		shape = 'bar',
		thickness = 'md',
		paused = false,
		class: className = ''
	}: CaretBlinkProps = $props();

	const heightClasses: Record<CaretBlinkHeight, string> = {
		sm: 'h-3.5',
		md: 'h-5',
		lg: 'h-6',
		xl: 'h-8'
	};

	const barWidths: Record<CaretBlinkThickness, string> = {
		thin: 'w-px',
		md: 'w-0.5',
		thick: 'w-1'
	};

	const blockWidths: Record<CaretBlinkHeight, string> = {
		sm: 'w-2',
		md: 'w-2.5',
		lg: 'w-3',
		xl: 'w-3.5'
	};

	const underscoreWidths: Record<CaretBlinkHeight, string> = {
		sm: 'w-2.5',
		md: 'w-3',
		lg: 'w-3.5',
		xl: 'w-4'
	};

	const toneClasses: Record<CaretBlinkTone, string> = {
		brand: 'bg-brand-500',
		primary: 'bg-primary',
		muted: 'bg-muted',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		danger: 'bg-red-500'
	};

	const speedDurations: Record<CaretBlinkSpeed, string> = {
		slow: '1.4s',
		normal: '1s',
		fast: '0.55s'
	};

	const shapeSize = $derived.by(() => {
		if (shape === 'block') {
			return `${heightClasses[height]} ${blockWidths[height]}`;
		}
		if (shape === 'underscore') {
			return `h-0.5 ${underscoreWidths[height]} self-end mb-0.5`;
		}
		return `${heightClasses[height]} ${barWidths[thickness]}`;
	});
</script>

<span
	class={[
		'inline-block shrink-0 align-middle transition-opacity duration-150',
		shapeSize,
		toneClasses[tone],
		shape === 'block' && 'rounded-sm',
		!visible && 'opacity-0',
		visible && !paused && 'caret-blink',
		className
	]}
	style={visible && !paused ? `animation-duration: ${speedDurations[speed]}` : undefined}
	aria-hidden="true"
></span>

<style>
	.caret-blink {
		animation-name: caret-blink;
		animation-timing-function: step-end;
		animation-iteration-count: infinite;
	}

	@keyframes caret-blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}
</style>
