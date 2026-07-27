import type { Meta, StoryObj } from '@storybook/svelte';
import TraceWaterfallStory from './TraceWaterfallStory.svelte';

const meta = {
	title: 'Molecules/TraceWaterfall',
	component: TraceWaterfallStory,
	tags: ['autodocs']
} satisfies Meta<typeof TraceWaterfallStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
