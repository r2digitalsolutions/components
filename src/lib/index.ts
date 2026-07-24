// ─────────────────────────────────────────────────────────────────────────────
// R2DigiSolutions Component Library — Public API
// ─────────────────────────────────────────────────────────────────────────────

// ── Atoms ────────────────────────────────────────────────────────────────────
export { default as Button } from './components/atoms/Button/Button.svelte';
export { default as Input } from './components/atoms/Input/Input.svelte';
export { default as Badge } from './components/atoms/Badge/Badge.svelte';
export { default as Avatar } from './components/atoms/Avatar/Avatar.svelte';
export { default as Spinner } from './components/atoms/Spinner/Spinner.svelte';
export { default as Toggle } from './components/atoms/Toggle/Toggle.svelte';
export { default as Checkbox } from './components/atoms/Checkbox/Checkbox.svelte';

// ── Molecules ────────────────────────────────────────────────────────────────
export { default as Card } from './components/molecules/Card/Card.svelte';
export { default as FormField } from './components/molecules/FormField/FormField.svelte';
export { default as ToastContainer } from './components/molecules/Toast/ToastContainer.svelte';
export { toastStore, toast } from './components/molecules/Toast/toast.svelte.js';
export type { Toast, ToastVariant, ToastPosition } from './components/molecules/Toast/toast.svelte.js';

// ── Utils ────────────────────────────────────────────────────────────────────
export { themeStore } from './utils/theme.svelte.js';
export type { Theme } from './utils/theme.svelte.js';

