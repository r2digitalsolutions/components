import type { Meta, StoryObj } from '@storybook/svelte';
import UsageBreakdownStory from './UsageBreakdownStory.svelte';

const meta = {
	title: 'Molecules/UsageBreakdown',
	component: UsageBreakdownStory,
	tags: ['autodocs']
} satisfies Meta<typeof UsageBreakdownStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
