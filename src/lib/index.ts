// ─────────────────────────────────────────────────────────────────────────────
// R2DigiSolutions Component Library — Public API
// ─────────────────────────────────────────────────────────────────────────────

// ── Atoms ────────────────────────────────────────────────────────────────────
export { default as Button } from './components/atoms/Button/Button.svelte';
export { default as Input } from './components/atoms/Input/Input.svelte';
export { default as Textarea } from './components/atoms/Textarea/Textarea.svelte';
export { default as Radio } from './components/atoms/Radio/Radio.svelte';
export { default as Slider } from './components/atoms/Slider/Slider.svelte';
export { default as Skeleton } from './components/atoms/Skeleton/Skeleton.svelte';
export { default as ProgressBar } from './components/atoms/ProgressBar/ProgressBar.svelte';
export { default as Badge } from './components/atoms/Badge/Badge.svelte';
export { default as Avatar } from './components/atoms/Avatar/Avatar.svelte';
export { default as Spinner } from './components/atoms/Spinner/Spinner.svelte';
export { default as Toggle } from './components/atoms/Toggle/Toggle.svelte';
export { default as Checkbox } from './components/atoms/Checkbox/Checkbox.svelte';
export { default as Chip } from './components/atoms/Chip/Chip.svelte';
export { default as Tooltip } from './components/atoms/Tooltip/Tooltip.svelte';
export { default as Divider } from './components/atoms/Divider/Divider.svelte';

// ── Molecules ────────────────────────────────────────────────────────────────
export { default as Card } from './components/molecules/Card/Card.svelte';
export { default as FormField } from './components/molecules/FormField/FormField.svelte';
export { default as RadioGroup } from './components/molecules/RadioGroup/RadioGroup.svelte';
export { default as Select } from './components/molecules/Select/Select.svelte';
export type { SelectOption } from './components/molecules/Select/Select.svelte';
export { default as PinInput } from './components/molecules/PinInput/PinInput.svelte';
export { default as FileUploader } from './components/molecules/FileUploader/FileUploader.svelte';
export { default as ProfileHeaderUploader } from './components/molecules/ProfileHeaderUploader/ProfileHeaderUploader.svelte';
export { default as Alert } from './components/molecules/Alert/Alert.svelte';
export type { AlertItem } from './components/molecules/Alert/Alert.svelte';
export { default as Dialog } from './components/molecules/Dialog/Dialog.svelte';
export { default as Drawer } from './components/molecules/Drawer/Drawer.svelte';
export { default as Tabs } from './components/molecules/Tabs/Tabs.svelte';
export type { TabItem } from './components/molecules/Tabs/Tabs.svelte';
export { default as DropdownMenu } from './components/molecules/DropdownMenu/DropdownMenu.svelte';
export type { DropdownItem } from './components/molecules/DropdownMenu/DropdownMenu.svelte';
export { default as Pagination } from './components/molecules/Pagination/Pagination.svelte';
export { default as Breadcrumb } from './components/molecules/Breadcrumb/Breadcrumb.svelte';
export type { BreadcrumbItem } from './components/molecules/Breadcrumb/Breadcrumb.svelte';
export { default as EmptyState } from './components/molecules/EmptyState/EmptyState.svelte';
export { default as DataTable } from './components/molecules/DataTable/DataTable.svelte';
export type { DataTableColumn } from './components/molecules/DataTable/DataTable.svelte';
export { default as Accordion } from './components/molecules/Accordion/Accordion.svelte';
export type { AccordionItem } from './components/molecules/Accordion/Accordion.svelte';
export { default as Stepper } from './components/molecules/Stepper/Stepper.svelte';
export type { StepItem } from './components/molecules/Stepper/Stepper.svelte';
export { default as ToastContainer } from './components/molecules/Toast/ToastContainer.svelte';
export { toastStore, toast } from './components/molecules/Toast/toast.svelte.js';
export type {
	Toast,
	ToastVariant,
	ToastPosition,
	ToastAppearance,
	ToastAction
} from './components/molecules/Toast/toast.svelte.js';

// ── Utils ────────────────────────────────────────────────────────────────────
export { themeStore } from './utils/theme.svelte.js';
export type { Theme } from './utils/theme.svelte.js';
