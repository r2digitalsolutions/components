import type { Meta, StoryObj } from '@storybook/svelte';
import SchedulerStory from './SchedulerStory.svelte';

const meta = {
	title: 'Organisms/Scheduler',
	component: SchedulerStory,
	tags: ['autodocs']
} satisfies Meta<typeof SchedulerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
