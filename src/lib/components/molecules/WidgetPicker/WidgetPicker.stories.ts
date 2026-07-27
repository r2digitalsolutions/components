import type { Meta, StoryObj } from '@storybook/svelte';
import WidgetPickerStory from './WidgetPickerStory.svelte';

const meta = {
	title: 'Molecules/WidgetPicker',
	component: WidgetPickerStory,
	tags: ['autodocs']
} satisfies Meta<typeof WidgetPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
