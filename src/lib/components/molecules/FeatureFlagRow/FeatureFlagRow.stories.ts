import type { Meta, StoryObj } from '@storybook/svelte';
import FeatureFlagRowStory from './FeatureFlagRowStory.svelte';

const meta = {
	title: 'Molecules/FeatureFlagRow',
	component: FeatureFlagRowStory,
	tags: ['autodocs']
} satisfies Meta<typeof FeatureFlagRowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
