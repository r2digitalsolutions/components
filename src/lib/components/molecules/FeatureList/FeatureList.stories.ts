import type { Meta, StoryObj } from '@storybook/svelte';
import FeatureListStory from './FeatureListStory.svelte';

const meta = {
	title: 'Molecules/FeatureList',
	component: FeatureListStory,
	tags: ['autodocs']
} satisfies Meta<typeof FeatureListStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
