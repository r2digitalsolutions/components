import type { Meta, StoryObj } from '@storybook/svelte';
import SchedulerStory from './SchedulerStory.svelte';

const meta = {
	title: 'Organisms/Scheduler',
	component: SchedulerStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'list', 'compact', 'range']
		}
	}
} satisfies Meta<typeof SchedulerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { variant: 'default' }
};

export const ListLayout: Story = {
	args: { variant: 'list' }
};

export const Compact: Story = {
	args: { variant: 'compact' }
};

export const Range: Story = {
	args: { variant: 'range' }
};
