import type { Meta, StoryObj } from '@storybook/svelte';
import ComparisonCurvesStory from './ComparisonCurvesStory.svelte';

const meta = {
	title: 'Molecules/ComparisonCurves',
	component: ComparisonCurvesStory,
	tags: ['autodocs']
} satisfies Meta<typeof ComparisonCurvesStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
