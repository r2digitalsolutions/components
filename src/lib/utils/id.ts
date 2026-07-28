/** Monotonic counter for client-assigned DOM ids (not used during SSR). */
let count = 0;

/** Create a unique DOM id. Prefer calling from `$effect` so SSR/hydration stay in sync. */
export function createId(prefix: string): string {
	count += 1;
	return `${prefix}-${count}`;
}
