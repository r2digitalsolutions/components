import type { Meta, StoryObj } from '@storybook/svelte';
import FeatureFlagsPageStory from './FeatureFlagsPageStory.svelte';

const meta = {
	title: 'Organisms/FeatureFlagsPage',
	component: FeatureFlagsPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof FeatureFlagsPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
