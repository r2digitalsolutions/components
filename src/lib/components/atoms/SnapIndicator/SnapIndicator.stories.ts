import type { Meta, StoryObj } from '@storybook/svelte';
import SnapIndicatorStory from './SnapIndicatorStory.svelte';

const meta = {
	title: 'Atoms/SnapIndicator',
	component: SnapIndicatorStory,
	tags: ['autodocs']
} satisfies Meta<typeof SnapIndicatorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
