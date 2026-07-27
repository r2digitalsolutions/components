import type { Meta, StoryObj } from '@storybook/svelte';
import WidgetPickerStory from './WidgetPickerStory.svelte';

const meta = {
	title: 'Molecules/WidgetPicker',
	component: WidgetPickerStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['list', 'grid', 'filtered']
		}
	}
} satisfies Meta<typeof WidgetPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = {
	args: { example: 'list' }
};

export const Grid: Story = {
	args: { example: 'grid' }
};

export const Filtered: Story = {
	args: { example: 'filtered' }
};
