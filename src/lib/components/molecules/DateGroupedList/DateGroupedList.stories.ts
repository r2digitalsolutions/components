import type { Meta, StoryObj } from '@storybook/svelte';
import DateGroupedListStory from './DateGroupedListStory.svelte';

const meta = {
	title: 'Molecules/DateGroupedList',
	component: DateGroupedListStory,
	tags: ['autodocs'],
	argTypes: {
		accent: {
			control: 'select',
			options: ['brand', 'neutral', 'none']
		},
		dense: {
			control: 'boolean'
		}
	}
} satisfies Meta<typeof DateGroupedListStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { accent: 'brand', dense: false }
};

export const NeutralAccent: Story = {
	args: { accent: 'neutral', dense: false }
};

export const NoAccent: Story = {
	args: { accent: 'none', dense: false }
};

export const Dense: Story = {
	args: { accent: 'brand', dense: true }
};
