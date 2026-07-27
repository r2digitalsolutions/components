import type { Meta, StoryObj } from '@storybook/svelte';
import TrendArrowStory from './TrendArrowStory.svelte';

const meta = {
	title: 'Atoms/TrendArrow',
	component: TrendArrowStory,
	tags: ['autodocs']
} satisfies Meta<typeof TrendArrowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
