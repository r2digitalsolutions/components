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
export { default as Kbd } from './components/atoms/Kbd/Kbd.svelte';
export { default as Rating } from './components/atoms/Rating/Rating.svelte';
export { default as Stat } from './components/atoms/Stat/Stat.svelte';
export { default as AspectRatio } from './components/atoms/AspectRatio/AspectRatio.svelte';
export { default as SkeletonText } from './components/atoms/SkeletonText/SkeletonText.svelte';

// ── Molecules ────────────────────────────────────────────────────────────────
export { default as Card } from './components/molecules/Card/Card.svelte';
export { default as FormField } from './components/molecules/FormField/FormField.svelte';
export { default as RadioGroup } from './components/molecules/RadioGroup/RadioGroup.svelte';
export { default as Select } from './components/molecules/Select/Select.svelte';
export type { SelectOption } from './components/molecules/Select/Select.svelte';
export { default as PinInput } from './components/molecules/PinInput/PinInput.svelte';
export { default as Alert } from './components/molecules/Alert/Alert.svelte';
export type { AlertItem } from './components/molecules/Alert/Alert.svelte';
export { default as Tabs } from './components/molecules/Tabs/Tabs.svelte';
export type { TabItem } from './components/molecules/Tabs/Tabs.svelte';
export { default as DropdownMenu } from './components/molecules/DropdownMenu/DropdownMenu.svelte';
export type { DropdownItem } from './components/molecules/DropdownMenu/DropdownMenu.svelte';
export { default as Pagination } from './components/molecules/Pagination/Pagination.svelte';
export { default as Breadcrumb } from './components/molecules/Breadcrumb/Breadcrumb.svelte';
export type { BreadcrumbItem } from './components/molecules/Breadcrumb/Breadcrumb.svelte';
export { default as EmptyState } from './components/molecules/EmptyState/EmptyState.svelte';
export { default as Accordion } from './components/molecules/Accordion/Accordion.svelte';
export type { AccordionItem } from './components/molecules/Accordion/Accordion.svelte';
export { default as Stepper } from './components/molecules/Stepper/Stepper.svelte';
export type { StepItem } from './components/molecules/Stepper/Stepper.svelte';
export { default as NumberInput } from './components/molecules/NumberInput/NumberInput.svelte';
export { default as SearchInput } from './components/molecules/SearchInput/SearchInput.svelte';
export { default as PasswordInput } from './components/molecules/PasswordInput/PasswordInput.svelte';
export { default as CopyButton } from './components/molecules/CopyButton/CopyButton.svelte';
export { default as SegmentedControl } from './components/molecules/SegmentedControl/SegmentedControl.svelte';
export type { SegmentItem } from './components/molecules/SegmentedControl/SegmentedControl.svelte';
export { default as Popover } from './components/molecules/Popover/Popover.svelte';
export { default as HoverCard } from './components/molecules/HoverCard/HoverCard.svelte';
export { default as Timeline } from './components/molecules/Timeline/Timeline.svelte';
export type { TimelineItem } from './components/molecules/Timeline/Timeline.svelte';
export { default as AvatarGroup } from './components/molecules/AvatarGroup/AvatarGroup.svelte';
export type { AvatarGroupItem } from './components/molecules/AvatarGroup/AvatarGroup.svelte';
export { default as List } from './components/molecules/List/List.svelte';
export type { ListItem } from './components/molecules/List/List.svelte';
export { default as Banner } from './components/molecules/Banner/Banner.svelte';
export { default as TagInput } from './components/molecules/TagInput/TagInput.svelte';
export { default as CodeBlock } from './components/molecules/CodeBlock/CodeBlock.svelte';
export { default as Calendar } from './components/molecules/Calendar/Calendar.svelte';
export type { CalendarMode, CalendarDot } from './components/molecules/Calendar/Calendar.svelte';
export { default as DatePicker } from './components/molecules/DatePicker/DatePicker.svelte';
export type { DatePickerPlacement } from './components/molecules/DatePicker/DatePicker.svelte';
export { default as ColorPicker } from './components/molecules/ColorPicker/ColorPicker.svelte';
export type { ColorFormat } from './components/molecules/ColorPicker/ColorPicker.svelte';
export { default as TimePicker } from './components/molecules/TimePicker/TimePicker.svelte';
export type { TimeFormat } from './components/molecules/TimePicker/TimePicker.svelte';
export { default as DateTimePicker } from './components/molecules/DateTimePicker/DateTimePicker.svelte';
export { default as DateRangePicker } from './components/molecules/DateRangePicker/DateRangePicker.svelte';
export { default as Combobox } from './components/molecules/Combobox/Combobox.svelte';
export type { ComboboxOption } from './components/molecules/Combobox/Combobox.svelte';
export { default as MultiSelect } from './components/molecules/MultiSelect/MultiSelect.svelte';
export type { MultiSelectOption } from './components/molecules/MultiSelect/MultiSelect.svelte';

// ── Organisms ────────────────────────────────────────────────────────────────
export { default as FileUploader } from './components/organisms/FileUploader/FileUploader.svelte';
export { default as ProfileHeaderUploader } from './components/organisms/ProfileHeaderUploader/ProfileHeaderUploader.svelte';
export { default as Dialog } from './components/organisms/Dialog/Dialog.svelte';
export { default as Drawer } from './components/organisms/Drawer/Drawer.svelte';
export { default as DataTable } from './components/organisms/DataTable/DataTable.svelte';
export type { DataTableColumn } from './components/organisms/DataTable/DataTable.svelte';
export { default as ToastContainer } from './components/organisms/Toast/ToastContainer.svelte';
export { toastStore, toast } from './components/organisms/Toast/toast.svelte.js';
export type {
	Toast,
	ToastVariant,
	ToastPosition,
	ToastAppearance,
	ToastAction
} from './components/organisms/Toast/toast.svelte.js';
export { default as Sidebar } from './components/organisms/Sidebar/Sidebar.svelte';
export type { SidebarItem, SidebarGroup } from './components/organisms/Sidebar/Sidebar.svelte';
export { default as Navbar } from './components/organisms/Navbar/Navbar.svelte';
export type { NavbarLink } from './components/organisms/Navbar/Navbar.svelte';
export { default as BottomNav } from './components/organisms/BottomNav/BottomNav.svelte';
export type { BottomNavItem, BottomNavIcon } from './components/organisms/BottomNav/BottomNav.svelte';
export { default as CommandPalette } from './components/organisms/CommandPalette/CommandPalette.svelte';
export type { CommandItem } from './components/organisms/CommandPalette/CommandPalette.svelte';
export { default as AppShell } from './components/organisms/AppShell/AppShell.svelte';
export { default as LoginForm } from './components/organisms/LoginForm/LoginForm.svelte';

// ── Utils ────────────────────────────────────────────────────────────────────
export { themeStore } from './utils/theme.svelte.js';
export type { Theme } from './utils/theme.svelte.js';
