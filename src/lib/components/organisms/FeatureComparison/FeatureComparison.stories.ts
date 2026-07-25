import type { Meta, StoryObj } from '@storybook/svelte';
import FeatureComparisonStory from './FeatureComparisonStory.svelte';

const meta = {
	title: 'Organisms/FeatureComparison',
	component: FeatureComparisonStory,
	tags: ['autodocs']
} satisfies Meta<typeof FeatureComparisonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
