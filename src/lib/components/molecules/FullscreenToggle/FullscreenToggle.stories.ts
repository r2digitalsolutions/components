import type { Meta, StoryObj } from '@storybook/svelte';
import FullscreenToggleStory from './FullscreenToggleStory.svelte';

const meta = {
	title: 'Molecules/FullscreenToggle',
	component: FullscreenToggleStory,
	tags: ['autodocs']
} satisfies Meta<typeof FullscreenToggleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
