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
export { default as RangeSlider } from './components/atoms/RangeSlider/RangeSlider.svelte';
export { default as CircularProgress } from './components/atoms/CircularProgress/CircularProgress.svelte';
export { default as ScrollArea } from './components/atoms/ScrollArea/ScrollArea.svelte';
export { default as Image } from './components/atoms/Image/Image.svelte';
export { default as Label } from './components/atoms/Label/Label.svelte';
export { default as IconButton } from './components/atoms/IconButton/IconButton.svelte';
export { default as Link } from './components/atoms/Link/Link.svelte';
export { default as StatusDot } from './components/atoms/StatusDot/StatusDot.svelte';
export { default as VisuallyHidden } from './components/atoms/VisuallyHidden/VisuallyHidden.svelte';
export { default as SkipLink } from './components/atoms/SkipLink/SkipLink.svelte';
export { default as Meter } from './components/atoms/Meter/Meter.svelte';
export { default as Figure } from './components/atoms/Figure/Figure.svelte';
export { default as Stack } from './components/atoms/Stack/Stack.svelte';
export { default as Cluster } from './components/atoms/Cluster/Cluster.svelte';
export { default as Grid } from './components/atoms/Grid/Grid.svelte';
export { default as Container } from './components/atoms/Container/Container.svelte';
export { default as Center } from './components/atoms/Center/Center.svelte';
export { default as ScrollProgress } from './components/atoms/ScrollProgress/ScrollProgress.svelte';
export { default as QRCode } from './components/atoms/QRCode/QRCode.svelte';
export { default as NetworkStatus } from './components/atoms/NetworkStatus/NetworkStatus.svelte';
export { default as CloseButton } from './components/atoms/CloseButton/CloseButton.svelte';
export { default as CountBadge } from './components/atoms/CountBadge/CountBadge.svelte';
export { default as Spacer } from './components/atoms/Spacer/Spacer.svelte';
export { default as FieldHint } from './components/atoms/FieldHint/FieldHint.svelte';
export type { FieldHintTone } from './components/atoms/FieldHint/FieldHint.svelte';
export { default as LabeledProgress } from './components/atoms/LabeledProgress/LabeledProgress.svelte';
export { default as Code } from './components/atoms/Code/Code.svelte';
export { default as Surface } from './components/atoms/Surface/Surface.svelte';
export type { SurfaceVariant, SurfacePadding, SurfaceRadius } from './components/atoms/Surface/Surface.svelte';
export { default as Heading } from './components/atoms/Heading/Heading.svelte';
export type { HeadingLevel, HeadingSize } from './components/atoms/Heading/Heading.svelte';
export { default as Text } from './components/atoms/Text/Text.svelte';
export type { TextSize, TextTone } from './components/atoms/Text/Text.svelte';
export { default as IconBox } from './components/atoms/IconBox/IconBox.svelte';
export type { IconBoxTone, IconBoxSize } from './components/atoms/IconBox/IconBox.svelte';
export { default as Eyebrow } from './components/atoms/Eyebrow/Eyebrow.svelte';
export { default as Sparkline } from './components/atoms/Sparkline/Sparkline.svelte';
export { default as Time } from './components/atoms/Time/Time.svelte';
export { default as Truncate } from './components/atoms/Truncate/Truncate.svelte';
export { default as SplitHandle } from './components/atoms/SplitHandle/SplitHandle.svelte';
export type { SplitOrientation } from './components/atoms/SplitHandle/SplitHandle.svelte';
export { default as PanelHeader } from './components/atoms/PanelHeader/PanelHeader.svelte';
export { default as Barcode } from './components/atoms/Barcode/Barcode.svelte';
export { default as BrandMark } from './components/atoms/BrandMark/BrandMark.svelte';
export type { BrandMarkSize } from './components/atoms/BrandMark/BrandMark.svelte';
export { default as StepMark } from './components/atoms/StepMark/StepMark.svelte';
export type { StepMarkState } from './components/atoms/StepMark/StepMark.svelte';
export { default as RadialProgress } from './components/atoms/RadialProgress/RadialProgress.svelte';
export { default as EnvBadge } from './components/atoms/EnvBadge/EnvBadge.svelte';
export type { EnvKind } from './components/atoms/EnvBadge/EnvBadge.svelte';
export { default as LiveBadge } from './components/atoms/LiveBadge/LiveBadge.svelte';
export { default as ColorSwatch } from './components/atoms/ColorSwatch/ColorSwatch.svelte';
export type { ColorSwatchSize } from './components/atoms/ColorSwatch/ColorSwatch.svelte';
export { default as SafeArea } from './components/atoms/SafeArea/SafeArea.svelte';
export { default as HomeIndicator } from './components/atoms/HomeIndicator/HomeIndicator.svelte';
export { default as HamburgerButton } from './components/atoms/HamburgerButton/HamburgerButton.svelte';
export { default as Overlay } from './components/atoms/Overlay/Overlay.svelte';
export { default as PulseDot } from './components/atoms/PulseDot/PulseDot.svelte';
export type { PulseTone } from './components/atoms/PulseDot/PulseDot.svelte';
export { default as SectionTitle } from './components/atoms/SectionTitle/SectionTitle.svelte';
export { default as CornerBadge } from './components/atoms/CornerBadge/CornerBadge.svelte';

// ── Molecules ────────────────────────────────────────────────────────────────
export { default as Card } from './components/molecules/Card/Card.svelte';
export type { CardVariant, CardPadding } from './components/molecules/Card/Card.svelte';
export { default as FormField } from './components/molecules/FormField/FormField.svelte';
export { default as RadioGroup } from './components/molecules/RadioGroup/RadioGroup.svelte';
export { default as Select } from './components/molecules/Select/Select.svelte';
export type { SelectOption } from './components/molecules/Select/Select.svelte';
export { default as PinInput } from './components/molecules/PinInput/PinInput.svelte';
export { default as Alert } from './components/molecules/Alert/Alert.svelte';
export type { AlertItem, AlertVariant } from './components/molecules/Alert/Alert.svelte';
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
export { default as ConfirmDialog } from './components/molecules/ConfirmDialog/ConfirmDialog.svelte';
export { default as ContextMenu } from './components/molecules/ContextMenu/ContextMenu.svelte';
export type { ContextMenuItem } from './components/molecules/ContextMenu/ContextMenu.svelte';
export { default as Carousel } from './components/molecules/Carousel/Carousel.svelte';
export type { CarouselItem } from './components/molecules/Carousel/Carousel.svelte';
export { default as TreeView } from './components/molecules/TreeView/TreeView.svelte';
export type { TreeNode } from './components/molecules/TreeView/TreeView.svelte';
export { default as TreeSelect } from './components/molecules/TreeSelect/TreeSelect.svelte';
export { default as Cascader } from './components/molecules/Cascader/Cascader.svelte';
export type { CascaderOption } from './components/molecules/Cascader/Cascader.svelte';
export { default as MaskedInput } from './components/molecules/MaskedInput/MaskedInput.svelte';
export { default as PhoneInput } from './components/molecules/PhoneInput/PhoneInput.svelte';
export { default as CurrencyInput } from './components/molecules/CurrencyInput/CurrencyInput.svelte';
export { default as TransferList } from './components/molecules/TransferList/TransferList.svelte';
export type { TransferOption } from './components/molecules/TransferList/TransferList.svelte';
export { default as Resizable } from './components/molecules/Resizable/Resizable.svelte';
export { default as SplitPane } from './components/molecules/SplitPane/SplitPane.svelte';
export { default as Panel } from './components/molecules/Panel/Panel.svelte';
export type { PanelPadding } from './components/molecules/Panel/Panel.svelte';
export { default as PropertyField } from './components/molecules/PropertyField/PropertyField.svelte';
export { default as PropertyGroup } from './components/molecules/PropertyGroup/PropertyGroup.svelte';
export { default as NavigationMenu } from './components/molecules/NavigationMenu/NavigationMenu.svelte';
export type { NavMenuItem, NavMenuChild } from './components/molecules/NavigationMenu/NavigationMenu.svelte';
export { default as ChatBubble } from './components/molecules/ChatBubble/ChatBubble.svelte';
export { default as MessageList } from './components/molecules/MessageList/MessageList.svelte';
export type { Message } from './components/molecules/MessageList/MessageList.svelte';
export { default as VirtualList } from './components/molecules/VirtualList/VirtualList.svelte';
export { default as ButtonGroup } from './components/molecules/ButtonGroup/ButtonGroup.svelte';
export { default as ThemeToggle } from './components/molecules/ThemeToggle/ThemeToggle.svelte';
export { default as LoadingOverlay } from './components/molecules/LoadingOverlay/LoadingOverlay.svelte';
export { default as Result } from './components/molecules/Result/Result.svelte';
export { default as BackToTop } from './components/molecules/BackToTop/BackToTop.svelte';
export { default as Collapsible } from './components/molecules/Collapsible/Collapsible.svelte';
export { default as Descriptions } from './components/molecules/Descriptions/Descriptions.svelte';
export type { DescriptionItem } from './components/molecules/Descriptions/Descriptions.svelte';
export { default as PageHeader } from './components/molecules/PageHeader/PageHeader.svelte';
export { default as SplitButton } from './components/molecules/SplitButton/SplitButton.svelte';
export { default as InlineEdit } from './components/molecules/InlineEdit/InlineEdit.svelte';
export { default as Countdown } from './components/molecules/Countdown/Countdown.svelte';
export { default as ReadMore } from './components/molecules/ReadMore/ReadMore.svelte';
export { default as TypingIndicator } from './components/molecules/TypingIndicator/TypingIndicator.svelte';
export { default as CheckboxGroup } from './components/molecules/CheckboxGroup/CheckboxGroup.svelte';
export type { CheckboxOption } from './components/molecules/CheckboxGroup/CheckboxGroup.svelte';
export { default as FloatButton } from './components/molecules/FloatButton/FloatButton.svelte';
export { default as SpeedDial } from './components/molecules/SpeedDial/SpeedDial.svelte';
export type {
	SpeedDialAction,
	SpeedDialPosition,
	SpeedDialDirection,
	SpeedDialLabels,
	SpeedDialSize,
	SpeedDialVariant,
	SpeedDialIconName
} from './components/molecules/SpeedDial/SpeedDial.svelte';
export { default as BottomSheet } from './components/molecules/BottomSheet/BottomSheet.svelte';
export type { BottomSheetSize } from './components/molecules/BottomSheet/BottomSheet.svelte';
export { default as SwipeAction } from './components/molecules/SwipeAction/SwipeAction.svelte';
export type {
	SwipeActionItem,
	SwipeActionVariant
} from './components/molecules/SwipeAction/SwipeAction.svelte';
export { default as FilterChips } from './components/molecules/FilterChips/FilterChips.svelte';
export type { FilterChipItem } from './components/molecules/FilterChips/FilterChips.svelte';
export { default as VoteControl } from './components/molecules/VoteControl/VoteControl.svelte';
export { default as BookmarkButton } from './components/molecules/BookmarkButton/BookmarkButton.svelte';
export { default as AnchorNav } from './components/molecules/AnchorNav/AnchorNav.svelte';
export type { AnchorItem } from './components/molecules/AnchorNav/AnchorNav.svelte';
export { default as Poll } from './components/molecules/Poll/Poll.svelte';
export type { PollOption, PollSize, PollLayout } from './components/molecules/Poll/Poll.svelte';
export { default as NewsletterSignup } from './components/molecules/NewsletterSignup/NewsletterSignup.svelte';
export type {
	NewsletterVariant,
	NewsletterSize
} from './components/molecules/NewsletterSignup/NewsletterSignup.svelte';
export { default as FollowButton } from './components/molecules/FollowButton/FollowButton.svelte';
export { default as CopyField } from './components/molecules/CopyField/CopyField.svelte';
export { default as CountrySelect } from './components/molecules/CountrySelect/CountrySelect.svelte';
export type { CountryOption } from './components/molecules/CountrySelect/CountrySelect.svelte';
export { default as InfiniteScroll } from './components/molecules/InfiniteScroll/InfiniteScroll.svelte';
export type { InfiniteScrollMode } from './components/molecules/InfiniteScroll/InfiniteScroll.svelte';
export { default as PullToRefresh } from './components/molecules/PullToRefresh/PullToRefresh.svelte';
export { default as CronBuilder } from './components/molecules/CronBuilder/CronBuilder.svelte';
export type {
	CronFrequency,
	CronPreset
} from './components/molecules/CronBuilder/CronBuilder.svelte';
export { CRON_PRESETS } from './components/molecules/CronBuilder/CronBuilder.svelte';
export { default as TimeAgo } from './components/molecules/TimeAgo/TimeAgo.svelte';
export { default as Spoiler } from './components/molecules/Spoiler/Spoiler.svelte';
export { default as PasswordStrength } from './components/molecules/PasswordStrength/PasswordStrength.svelte';
export { default as ShareButton } from './components/molecules/ShareButton/ShareButton.svelte';
export { default as Callout } from './components/molecules/Callout/Callout.svelte';
export { default as Toolbar } from './components/molecules/Toolbar/Toolbar.svelte';
export { default as Hotkeys } from './components/molecules/Hotkeys/Hotkeys.svelte';
export type { HotkeyItem } from './components/molecules/Hotkeys/Hotkeys.svelte';
export { default as Announcement } from './components/molecules/Announcement/Announcement.svelte';
export { default as UserMenu } from './components/molecules/UserMenu/UserMenu.svelte';
export type { UserMenuItem } from './components/molecules/UserMenu/UserMenu.svelte';
export { default as TableOfContents } from './components/molecules/TableOfContents/TableOfContents.svelte';
export type { TocItem } from './components/molecules/TableOfContents/TableOfContents.svelte';
export { default as FilterBar } from './components/molecules/FilterBar/FilterBar.svelte';
export type { FilterChip } from './components/molecules/FilterBar/FilterBar.svelte';
export { default as SortableList } from './components/molecules/SortableList/SortableList.svelte';
export type { SortableItem } from './components/molecules/SortableList/SortableList.svelte';
export { default as Form } from './components/molecules/Form/Form.svelte';
export type { FormErrors, FormContext } from './components/molecules/Form/Form.svelte';
export { default as MonthPicker } from './components/molecules/MonthPicker/MonthPicker.svelte';
export { default as WeekPicker } from './components/molecules/WeekPicker/WeekPicker.svelte';
export { default as YearPicker } from './components/molecules/YearPicker/YearPicker.svelte';
export { default as ImageLightbox } from './components/molecules/ImageLightbox/ImageLightbox.svelte';
export type { LightboxImage } from './components/molecules/ImageLightbox/ImageLightbox.svelte';
export { default as EmojiPicker } from './components/molecules/EmojiPicker/EmojiPicker.svelte';
export type { EmojiCategory } from './components/molecules/EmojiPicker/EmojiPicker.svelte';
export { default as MentionInput } from './components/molecules/MentionInput/MentionInput.svelte';
export type { MentionSuggestion } from './components/molecules/MentionInput/MentionInput.svelte';
export { default as MarkdownPreview } from './components/molecules/MarkdownPreview/MarkdownPreview.svelte';
export { default as JSONViewer } from './components/molecules/JSONViewer/JSONViewer.svelte';
export { default as DiffViewer } from './components/molecules/DiffViewer/DiffViewer.svelte';
export type { DiffMode } from './components/molecules/DiffViewer/DiffViewer.svelte';
export { default as SignaturePad } from './components/molecules/SignaturePad/SignaturePad.svelte';
export { default as ImageCropper } from './components/molecules/ImageCropper/ImageCropper.svelte';
export type { CropAspect, CropFormat } from './components/molecules/ImageCropper/ImageCropper.svelte';
export { default as AudioPlayer } from './components/molecules/AudioPlayer/AudioPlayer.svelte';
export { default as VideoPlayer } from './components/molecules/VideoPlayer/VideoPlayer.svelte';
export { default as VolumeControl } from './components/molecules/VolumeControl/VolumeControl.svelte';
export { default as Playlist } from './components/molecules/Playlist/Playlist.svelte';
export type { PlaylistTrack } from './components/molecules/Playlist/Playlist.svelte';
export { default as Marquee } from './components/molecules/Marquee/Marquee.svelte';
export type { MarqueeSeparator } from './components/molecules/Marquee/Marquee.svelte';
export { default as OfflineBanner } from './components/molecules/OfflineBanner/OfflineBanner.svelte';
export { default as UnsavedChanges } from './components/molecules/UnsavedChanges/UnsavedChanges.svelte';
export { default as ErrorBoundary } from './components/molecules/ErrorBoundary/ErrorBoundary.svelte';
export { default as StatCard } from './components/molecules/StatCard/StatCard.svelte';
export type { StatCardTrend } from './components/molecules/StatCard/StatCard.svelte';
export { default as MediaCard } from './components/molecules/MediaCard/MediaCard.svelte';
export { default as FormActions } from './components/molecules/FormActions/FormActions.svelte';
export { default as FormSection } from './components/molecules/FormSection/FormSection.svelte';
export { default as NotificationRow } from './components/molecules/NotificationRow/NotificationRow.svelte';
export type {
	NotificationRowData,
	NotificationRowType
} from './components/molecules/NotificationRow/NotificationRow.svelte';
export { default as SearchBar } from './components/molecules/SearchBar/SearchBar.svelte';
export { default as SkeletonCard } from './components/molecules/SkeletonCard/SkeletonCard.svelte';
export type { SkeletonCardLayout } from './components/molecules/SkeletonCard/SkeletonCard.svelte';
export { default as UserCard } from './components/molecules/UserCard/UserCard.svelte';
export type {
	UserCardStatus,
	UserCardVariant
} from './components/molecules/UserCard/UserCard.svelte';
export { default as UserListItem } from './components/molecules/UserListItem/UserListItem.svelte';
export type { UserListItemStatus } from './components/molecules/UserListItem/UserListItem.svelte';
export { default as UserChip } from './components/molecules/UserChip/UserChip.svelte';
export type {
	UserChipStatus,
	UserChipSize,
	UserChipVariant,
	UserChipLabel
} from './components/molecules/UserChip/UserChip.svelte';
export { default as SettingsRow } from './components/molecules/SettingsRow/SettingsRow.svelte';
export { default as CommentComposer } from './components/molecules/CommentComposer/CommentComposer.svelte';
export { default as ActionBar } from './components/molecules/ActionBar/ActionBar.svelte';
export type { ActionBarVariant } from './components/molecules/ActionBar/ActionBar.svelte';
export { default as MetricGrid } from './components/molecules/MetricGrid/MetricGrid.svelte';
export type { MetricItem } from './components/molecules/MetricGrid/MetricGrid.svelte';
export { default as FileRow } from './components/molecules/FileRow/FileRow.svelte';
export type { FileRowData } from './components/molecules/FileRow/FileRow.svelte';
export { default as AvatarLabel } from './components/molecules/AvatarLabel/AvatarLabel.svelte';
export { default as Checklist } from './components/molecules/Checklist/Checklist.svelte';
export type { ChecklistItem } from './components/molecules/Checklist/Checklist.svelte';
export { default as PasswordField } from './components/molecules/PasswordField/PasswordField.svelte';
export { default as FeatureList } from './components/molecules/FeatureList/FeatureList.svelte';
export type { FeatureListItem } from './components/molecules/FeatureList/FeatureList.svelte';
export { default as PromoCard } from './components/molecules/PromoCard/PromoCard.svelte';
export { default as ChipSelect } from './components/molecules/ChipSelect/ChipSelect.svelte';
export type { ChipSelectOption } from './components/molecules/ChipSelect/ChipSelect.svelte';
export { default as InfoTile } from './components/molecules/InfoTile/InfoTile.svelte';
export { default as Quote } from './components/molecules/Quote/Quote.svelte';
export { default as KeyValue } from './components/molecules/KeyValue/KeyValue.svelte';
export { default as DangerZone } from './components/molecules/DangerZone/DangerZone.svelte';
export { default as StepHeader } from './components/molecules/StepHeader/StepHeader.svelte';
export { default as PropertyRow } from './components/molecules/PropertyRow/PropertyRow.svelte';
export { default as Chart } from './components/molecules/Chart/Chart.svelte';
export type { ChartType, ChartPoint } from './components/molecules/Chart/Chart.svelte';
export { default as AreaLineChart } from './components/molecules/AreaLineChart/AreaLineChart.svelte';
export type { AreaLinePoint } from './components/molecules/AreaLineChart/AreaLineChart.svelte';
export { default as MultiLineChart } from './components/molecules/MultiLineChart/MultiLineChart.svelte';
export type { MultiLineSeries } from './components/molecules/MultiLineChart/MultiLineChart.svelte';
export { default as BarChart } from './components/molecules/BarChart/BarChart.svelte';
export type { BarChartPoint } from './components/molecules/BarChart/BarChart.svelte';
export { default as ComparisonCurves } from './components/molecules/ComparisonCurves/ComparisonCurves.svelte';
export type { ComparisonSeries } from './components/molecules/ComparisonCurves/ComparisonCurves.svelte';
export { default as DonutChart } from './components/molecules/DonutChart/DonutChart.svelte';
export type { DonutSlice } from './components/molecules/DonutChart/DonutChart.svelte';
export { default as Gauge } from './components/molecules/Gauge/Gauge.svelte';
export type {
	GaugeSize,
	GaugeVariant,
	GaugeTone,
	GaugeZone
} from './components/molecules/Gauge/Gauge.svelte';
export { default as HorizontalBarChart } from './components/molecules/HorizontalBarChart/HorizontalBarChart.svelte';
export type { HBarPoint } from './components/molecules/HorizontalBarChart/HorizontalBarChart.svelte';
export { default as StackedBarChart } from './components/molecules/StackedBarChart/StackedBarChart.svelte';
export type { StackedSeries } from './components/molecules/StackedBarChart/StackedBarChart.svelte';
export { default as Heatmap } from './components/molecules/Heatmap/Heatmap.svelte';
export type {
	HeatmapCell,
	HeatmapPalette,
	HeatmapSize
} from './components/molecules/Heatmap/Heatmap.svelte';
export { HEATMAP_PALETTES } from './components/molecules/Heatmap/Heatmap.svelte';
export { default as InputGroup } from './components/molecules/InputGroup/InputGroup.svelte';
export { default as CreditCardInput } from './components/molecules/CreditCardInput/CreditCardInput.svelte';
export type { CardBrand } from './components/molecules/CreditCardInput/CreditCardInput.svelte';
export { default as BulkActionBar } from './components/molecules/BulkActionBar/BulkActionBar.svelte';
export type {
	BulkAction,
	BulkActionVariant,
	BulkActionBarPlacement,
	BulkActionBarSize,
	BulkActionBarTone
} from './components/molecules/BulkActionBar/BulkActionBar.svelte';
export { default as ReactionBar } from './components/molecules/ReactionBar/ReactionBar.svelte';
export type { ReactionItem } from './components/molecules/ReactionBar/ReactionBar.svelte';
export { default as AddressFields } from './components/molecules/AddressFields/AddressFields.svelte';
export { default as RichTextEditor } from './components/molecules/RichTextEditor/RichTextEditor.svelte';
export type { RichTextEditorVariant } from './components/molecules/RichTextEditor/RichTextEditor.svelte';
export { default as EventCalendar } from './components/molecules/EventCalendar/EventCalendar.svelte';
export type {
	CalendarEvent,
	CalendarEventColor
} from './components/molecules/EventCalendar/EventCalendar.svelte';

export { default as CompareSlider } from './components/molecules/CompareSlider/CompareSlider.svelte';
export { default as PdfViewer } from './components/molecules/PdfViewer/PdfViewer.svelte';
export { default as ImageGallery } from './components/molecules/ImageGallery/ImageGallery.svelte';
export type { GalleryImage } from './components/molecules/ImageGallery/ImageGallery.svelte';
export { default as LogViewer } from './components/molecules/LogViewer/LogViewer.svelte';
export type { LogEntry, LogLevel } from './components/molecules/LogViewer/LogViewer.svelte';
export { default as PriceTag } from './components/molecules/PriceTag/PriceTag.svelte';
export { default as LocaleSwitcher } from './components/molecules/LocaleSwitcher/LocaleSwitcher.svelte';
export type { LocaleOption } from './components/molecules/LocaleSwitcher/LocaleSwitcher.svelte';
export { default as NoteCard } from './components/molecules/NoteCard/NoteCard.svelte';
export type { NoteTone } from './components/molecules/NoteCard/NoteCard.svelte';
export { default as LikeButton } from './components/molecules/LikeButton/LikeButton.svelte';
export { default as CharacterCount } from './components/molecules/CharacterCount/CharacterCount.svelte';
export type { CharacterCountMode } from './components/molecules/CharacterCount/CharacterCount.svelte';
export { default as FullscreenToggle } from './components/molecules/FullscreenToggle/FullscreenToggle.svelte';
export { default as SlugInput } from './components/molecules/SlugInput/SlugInput.svelte';
export { default as TimezoneSelect } from './components/molecules/TimezoneSelect/TimezoneSelect.svelte';
export type { TimezoneOption } from './components/molecules/TimezoneSelect/TimezoneSelect.svelte';
export { default as DropZone } from './components/molecules/DropZone/DropZone.svelte';
export type { DropZoneFile } from './components/molecules/DropZone/DropZone.svelte';
export { default as CouponInput } from './components/molecules/CouponInput/CouponInput.svelte';
export type { CouponStatus } from './components/molecules/CouponInput/CouponInput.svelte';
export { default as DownloadButton } from './components/molecules/DownloadButton/DownloadButton.svelte';
export type {
	DownloadStatus,
	DownloadResult
} from './components/molecules/DownloadButton/DownloadButton.svelte';
export { default as AppBar } from './components/molecules/AppBar/AppBar.svelte';
export type { AppBarVariant } from './components/molecules/AppBar/AppBar.svelte';
export { default as ActionSheet } from './components/molecules/ActionSheet/ActionSheet.svelte';
export type {
	ActionSheetItem,
	ActionSheetItemVariant
} from './components/molecules/ActionSheet/ActionSheet.svelte';
export { default as Snackbar } from './components/molecules/Snackbar/Snackbar.svelte';
export type {
	SnackbarPosition,
	SnackbarVariant
} from './components/molecules/Snackbar/Snackbar.svelte';
export { default as ChipBar } from './components/molecules/ChipBar/ChipBar.svelte';
export type {
	ChipBarItem,
	ChipBarSize,
	ChipBarVariant
} from './components/molecules/ChipBar/ChipBar.svelte';
export { default as StickyCTA } from './components/molecules/StickyCTA/StickyCTA.svelte';
export type {
	StickyCTALayout,
	StickyCTAPlacement
} from './components/molecules/StickyCTA/StickyCTA.svelte';
export { default as ShareSheet } from './components/molecules/ShareSheet/ShareSheet.svelte';
export type { ShareChannel } from './components/molecules/ShareSheet/ShareSheet.svelte';
export { default as PhoneFrame } from './components/molecules/PhoneFrame/PhoneFrame.svelte';
export type { PhoneFrameSize } from './components/molecules/PhoneFrame/PhoneFrame.svelte';
export { default as SearchSheet } from './components/molecules/SearchSheet/SearchSheet.svelte';
export type { SearchSheetItem } from './components/molecules/SearchSheet/SearchSheet.svelte';
export { default as ProductCard } from './components/molecules/ProductCard/ProductCard.svelte';
export type {
	ProductCardVariant,
	ProductCardBadgeTone
} from './components/molecules/ProductCard/ProductCard.svelte';
export { default as ReviewCard } from './components/molecules/ReviewCard/ReviewCard.svelte';
export type { ReviewCardVariant } from './components/molecules/ReviewCard/ReviewCard.svelte';
export { default as Stories } from './components/molecules/Stories/Stories.svelte';
export type {
	StoryItem,
	StorySlide,
	StoriesSize
} from './components/molecules/Stories/Stories.svelte';
export { default as CameraButton } from './components/molecules/CameraButton/CameraButton.svelte';
export { default as SectionHeader } from './components/molecules/SectionHeader/SectionHeader.svelte';
export { default as StatStrip } from './components/molecules/StatStrip/StatStrip.svelte';
export type { StatStripItem } from './components/molecules/StatStrip/StatStrip.svelte';
export { default as CartLineItem } from './components/molecules/CartItem/CartItem.svelte';
export { default as OrderSummary } from './components/molecules/OrderSummary/OrderSummary.svelte';
export type { OrderLine } from './components/molecules/OrderSummary/OrderSummary.svelte';
export { default as AuthCard } from './components/molecules/AuthCard/AuthCard.svelte';
export { default as FacetGroup } from './components/molecules/FacetGroup/FacetGroup.svelte';
export type { FacetOption } from './components/molecules/FacetGroup/FacetGroup.svelte';
export { default as FacetPanel } from './components/molecules/FacetPanel/FacetPanel.svelte';
export type { FacetGroupDef } from './components/molecules/FacetPanel/FacetPanel.svelte';
export { default as BuilderFilters } from './components/molecules/BuilderFilters/BuilderFilters.svelte';
/** @deprecated Use `BuilderFilters` */
export { default as FilterBuilder } from './components/molecules/BuilderFilters/BuilderFilters.svelte';
export { default as SortSelect } from './components/molecules/SortSelect/SortSelect.svelte';
export type { SortOption } from './components/molecules/SortSelect/SortSelect.svelte';
export { DEFAULT_SORT_OPTIONS } from './components/molecules/SortSelect/SortSelect.svelte';
export { default as AdvancedFilters } from './components/molecules/AdvancedFilters/AdvancedFilters.svelte';
export type {
	FilterFieldDef,
	FilterFieldType
} from './utils/advancedFilters.js';
export { default as QueryBar } from './components/molecules/QueryBar/QueryBar.svelte';
export type { QuerySuggestion } from './components/molecules/QueryBar/QueryBar.svelte';

// ── Organisms ────────────────────────────────────────────────────────────────
export { default as FileUploader } from './components/organisms/FileUploader/FileUploader.svelte';
export { default as ProfileHeaderUploader } from './components/organisms/ProfileHeaderUploader/ProfileHeaderUploader.svelte';
export { default as Dialog } from './components/organisms/Dialog/Dialog.svelte';
export { default as Drawer } from './components/organisms/Drawer/Drawer.svelte';
export { default as Sheet } from './components/organisms/Sheet/Sheet.svelte';
export type { SheetSize, SheetAccent } from './components/organisms/Sheet/Sheet.svelte';
export { SHEET_SIZE_SNAPS } from './components/organisms/Sheet/Sheet.svelte';
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
export { default as EditorShell } from './components/organisms/EditorShell/EditorShell.svelte';
export { default as LoginForm } from './components/organisms/LoginForm/LoginForm.svelte';
export type {
	LoginFormVariant,
	LoginFormAlign
} from './components/organisms/LoginForm/LoginForm.svelte';
export { default as Menubar } from './components/organisms/Menubar/Menubar.svelte';
export type { MenubarItem, MenubarSubItem } from './components/organisms/Menubar/Menubar.svelte';
export { default as NotificationCenter } from './components/organisms/NotificationCenter/NotificationCenter.svelte';
export type { NotificationItem } from './components/organisms/NotificationCenter/NotificationCenter.svelte';
export { default as Kanban } from './components/organisms/Kanban/Kanban.svelte';
export type {
	KanbanColumn,
	KanbanCard,
	KanbanAssignee,
	KanbanPriority
} from './components/organisms/Kanban/Kanban.svelte';
export { default as CookieConsent } from './components/organisms/CookieConsent/CookieConsent.svelte';
export { default as MusicPlayer } from './components/organisms/MusicPlayer/MusicPlayer.svelte';
export { default as MusicBarPlayer } from './components/organisms/MusicBarPlayer/MusicBarPlayer.svelte';
export { default as Footer } from './components/organisms/Footer/Footer.svelte';
export type {
	FooterLink,
	FooterGroup,
	FooterSocial,
	FooterVariant
} from './components/organisms/Footer/Footer.svelte';
export { default as Wizard } from './components/organisms/Wizard/Wizard.svelte';
export { default as Tour } from './components/organisms/Tour/Tour.svelte';
export type { TourStep } from './components/organisms/Tour/Tour.svelte';
export { default as FeedbackWidget } from './components/organisms/FeedbackWidget/FeedbackWidget.svelte';
export { default as RegisterForm } from './components/organisms/RegisterForm/RegisterForm.svelte';
export { default as ForgotPasswordForm } from './components/organisms/ForgotPasswordForm/ForgotPasswordForm.svelte';
export { default as OtpVerify } from './components/organisms/OtpVerify/OtpVerify.svelte';
export { default as ChatWindow } from './components/organisms/ChatWindow/ChatWindow.svelte';
export { default as CommentThread } from './components/organisms/CommentThread/CommentThread.svelte';
export type { CommentItem } from './components/organisms/CommentThread/CommentThread.svelte';
export { default as ActivityFeed } from './components/organisms/ActivityFeed/ActivityFeed.svelte';
export type {
	ActivityItem,
	ActivityType
} from './components/organisms/ActivityFeed/ActivityFeed.svelte';
export { default as SettingsLayout } from './components/organisms/SettingsLayout/SettingsLayout.svelte';
export type {
	SettingsNavItem,
	SettingsNavGroup
} from './components/organisms/SettingsLayout/SettingsLayout.svelte';
export { default as PricingTable } from './components/organisms/PricingTable/PricingTable.svelte';
export type {
	PricingPlan,
	PricingLayout,
	PricingFeature,
	PricingComparisonRow
} from './components/organisms/PricingTable/PricingTable.svelte';
export { default as FeatureComparison } from './components/organisms/FeatureComparison/FeatureComparison.svelte';
export type {
	FeatureRow,
	FeatureComparisonPlan
} from './components/organisms/FeatureComparison/FeatureComparison.svelte';
export { default as AuthShell } from './components/organisms/AuthShell/AuthShell.svelte';
export type { AuthAsideSide } from './components/organisms/AuthShell/AuthShell.svelte';
export { default as DataListPage } from './components/organisms/DataListPage/DataListPage.svelte';
export { default as Inbox } from './components/organisms/Inbox/Inbox.svelte';
export { default as ProfilePage } from './components/organisms/ProfilePage/ProfilePage.svelte';
export { default as DocsLayout } from './components/organisms/DocsLayout/DocsLayout.svelte';
export type { DocsPage } from './components/organisms/DocsLayout/DocsLayout.svelte';
export { default as DashboardPage } from './components/organisms/DashboardPage/DashboardPage.svelte';
export { default as SettingsPage } from './components/organisms/SettingsPage/SettingsPage.svelte';
export type { SettingsFormValues } from './components/organisms/SettingsPage/SettingsPage.svelte';
export { default as CheckoutPage } from './components/organisms/CheckoutPage/CheckoutPage.svelte';
export { default as TeamPage } from './components/organisms/TeamPage/TeamPage.svelte';
export type { TeamMember } from './components/organisms/TeamPage/TeamPage.svelte';
export { default as DiscussionPage } from './components/organisms/DiscussionPage/DiscussionPage.svelte';
export { default as ContactForm } from './components/organisms/ContactForm/ContactForm.svelte';
export type {
	ContactTopic,
	ContactFormPayload
} from './components/organisms/ContactForm/ContactForm.svelte';
export { default as ChangePasswordForm } from './components/organisms/ChangePasswordForm/ChangePasswordForm.svelte';
export { default as BillingPage } from './components/organisms/BillingPage/BillingPage.svelte';
export type {
	BillingStatus,
	BillingUsageItem,
	BillingPaymentMethod,
	BillingInvoice
} from './components/organisms/BillingPage/BillingPage.svelte';
export { default as StatusPage } from './components/organisms/StatusPage/StatusPage.svelte';
export { default as OnboardingPage } from './components/organisms/OnboardingPage/OnboardingPage.svelte';
export { default as InviteTeamForm } from './components/organisms/InviteTeamForm/InviteTeamForm.svelte';
export { default as HelpCenter } from './components/organisms/HelpCenter/HelpCenter.svelte';
export { default as ErrorPage } from './components/organisms/ErrorPage/ErrorPage.svelte';
export { default as FileManager } from './components/organisms/FileManager/FileManager.svelte';
export { default as EmailComposer } from './components/organisms/EmailComposer/EmailComposer.svelte';
export { default as InvoicePage } from './components/organisms/InvoicePage/InvoicePage.svelte';
export type { InvoiceLine } from './components/organisms/InvoicePage/InvoicePage.svelte';
export { default as AnalyticsPage } from './components/organisms/AnalyticsPage/AnalyticsPage.svelte';
export { default as PaymentForm } from './components/organisms/PaymentForm/PaymentForm.svelte';
export { default as CartPage } from './components/organisms/CartPage/CartPage.svelte';
export type { CartItem } from './components/organisms/CartPage/CartPage.svelte';
export { default as CatalogPage } from './components/organisms/CatalogPage/CatalogPage.svelte';
export type { CatalogProduct } from './components/organisms/CatalogPage/CatalogPage.svelte';
export { default as AuditLogPage } from './components/organisms/AuditLogPage/AuditLogPage.svelte';
export type { AuditEvent } from './components/organisms/AuditLogPage/AuditLogPage.svelte';
export { default as ApiKeysPage } from './components/organisms/ApiKeysPage/ApiKeysPage.svelte';
export type { ApiKeyItem } from './components/organisms/ApiKeysPage/ApiKeysPage.svelte';
export { default as Changelog } from './components/organisms/Changelog/Changelog.svelte';
export type { ChangelogEntry } from './components/organisms/Changelog/Changelog.svelte';
export { default as Roadmap } from './components/organisms/Roadmap/Roadmap.svelte';
export type { RoadmapItem, RoadmapStatus } from './components/organisms/Roadmap/Roadmap.svelte';
export { default as FAQ } from './components/organisms/FAQ/FAQ.svelte';
export type { FaqItem } from './components/organisms/FAQ/FAQ.svelte';
export { default as CalendarApp } from './components/organisms/CalendarApp/CalendarApp.svelte';
export type {
	CalendarView,
	CalendarTone,
	CalendarSource,
	CalendarAppEvent
} from './components/organisms/CalendarApp/CalendarApp.svelte';
export { default as PermissionsMatrix } from './components/organisms/PermissionsMatrix/PermissionsMatrix.svelte';
export type {
	PermissionLevel,
	PermissionRole,
	PermissionResource,
	PermissionMap
} from './components/organisms/PermissionsMatrix/PermissionsMatrix.svelte';
export { default as IntegrationsPage } from './components/organisms/IntegrationsPage/IntegrationsPage.svelte';
export type { IntegrationItem } from './components/organisms/IntegrationsPage/IntegrationsPage.svelte';
export { default as Testimonials } from './components/organisms/Testimonials/Testimonials.svelte';
export type { TestimonialItem } from './components/organisms/Testimonials/Testimonials.svelte';
export { default as Scheduler } from './components/organisms/Scheduler/Scheduler.svelte';
export type {
	ScheduleSlot,
	ScheduleBooking
} from './components/organisms/Scheduler/Scheduler.svelte';
export { default as ComingSoonPage } from './components/organisms/ComingSoonPage/ComingSoonPage.svelte';
export { default as MaintenancePage } from './components/organisms/MaintenancePage/MaintenancePage.svelte';
export { default as MobileShell } from './components/organisms/MobileShell/MobileShell.svelte';
export { default as BlogPost } from './components/organisms/BlogPost/BlogPost.svelte';
export { default as LandingHero } from './components/organisms/LandingHero/LandingHero.svelte';
export { default as SearchResults } from './components/organisms/SearchResults/SearchResults.svelte';
export type { SearchResultItem } from './components/organisms/SearchResults/SearchResults.svelte';
export { default as SettingsForm } from './components/organisms/SettingsForm/SettingsForm.svelte';

// ── Templates ────────────────────────────────────────────────────────────────
export { default as AuthTemplate } from './components/templates/AuthTemplate/AuthTemplate.svelte';
export { default as DashboardTemplate } from './components/templates/DashboardTemplate/DashboardTemplate.svelte';
export { default as MarketingTemplate } from './components/templates/MarketingTemplate/MarketingTemplate.svelte';
export { default as ListingTemplate } from './components/templates/ListingTemplate/ListingTemplate.svelte';
export { default as CheckoutTemplate } from './components/templates/CheckoutTemplate/CheckoutTemplate.svelte';
export type { CheckoutLine } from './components/templates/CheckoutTemplate/CheckoutTemplate.svelte';

// ── Utils ────────────────────────────────────────────────────────────────────
export { themeStore } from './utils/theme.svelte.js';
export type { Theme } from './utils/theme.svelte.js';
export { encodeQR, qrToSvgPath, punchLogoHole } from './utils/qr.js';
export { renderMarkdown, renderInline, escapeHtml, splitTableRow, slugifyHeading } from './utils/markdown.js';
export {
	diffLines,
	diffWords,
	diffStats,
	toSplitRows
} from './utils/diff.js';
export type { DiffOp, DiffOpType, DiffPart, DiffStats, SplitRow } from './utils/diff.js';
export {
	mapPoints,
	smoothLinePath,
	linearLinePath,
	areaPath,
	scaleDomain,
	tipAlign,
	formatTick,
	DEFAULT_PAD
} from './utils/chart.js';
export type { ChartXY, ChartPad } from './utils/chart.js';
export {
	parseFilterParams,
	serializeFilterParams,
	filterParamsToSearch,
	createEmptyFilterState,
	EMPTY_FILTER_STATE
} from './utils/filterParams.js';
export type {
	CatalogFilterState,
	CatalogPriceRange,
	AdvancedFilterClause,
	AdvancedFilterGroup,
	AdvancedFilterNode,
	AdvancedFilterRule,
	AdvancedFilterValue,
	FilterOperator,
	FilterCombinator,
	FilterValueKind
} from './utils/filterParams.js';
export {
	emptyFilterGroup,
	emptyFilterRule,
	flattenRules,
	countRules,
	matchGroup,
	matchRuleValue,
	resolveValueKind,
	operatorsForField,
	formatRuleLabel,
	asFilterGroup,
	OP_LABELS,
	DEFAULT_OPS,
	FILTER_OPERATORS
} from './utils/filterParams.js';
export {
	parseFilterSchema,
	emptyFilterValues,
	clearFilterValues,
	countActiveFilters,
	groupFilterSchema,
	isFilterValueActive,
	serializeFilterValues,
	parseFilterValues
} from './utils/filterSchema.js';
export type {
	FilterFieldSchema,
	FilterControlType,
	FilterOption,
	FilterValue,
	FilterValues,
	FilterCategoryGroup
} from './utils/filterSchema.js';
export {
	tokenizeQuery,
	validateQuery,
	parseSimpleClauses,
	fieldIdsFromDefs,
	DEFAULT_QUERY_EXAMPLES,
	operatorSuggestionsForField
} from './utils/queryBar.js';
export type { QueryToken, QueryTokenKind, QueryExample } from './utils/queryBar.js';
