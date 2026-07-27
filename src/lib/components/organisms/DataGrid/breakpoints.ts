export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

/** Min viewport width (px) for each Tailwind-aligned breakpoint. */
export const BREAKPOINT_MIN: Record<Breakpoint, number> = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280
};

/** True when the viewport is at least the given breakpoint. */
export function matchesMinBreakpoint(bp: Breakpoint, width: number): boolean {
	return width >= BREAKPOINT_MIN[bp];
}

/**
 * Column with `hideBelow: 'md'` is auto-hidden when width < 768.
 * Returns true if the column should be visible at `width`.
 */
export function isColumnVisibleAtWidth(
	hideBelow: Breakpoint | undefined,
	width: number
): boolean {
	if (!hideBelow) return true;
	return matchesMinBreakpoint(hideBelow, width);
}
