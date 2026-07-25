import type { Meta, StoryObj } from '@storybook/svelte';
import CronBuilderStory from './CronBuilderStory.svelte';

const meta = {
	title: 'Molecules/CronBuilder',
	component: CronBuilderStory,
	tags: ['autodocs']
} satisfies Meta<typeof CronBuilderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
