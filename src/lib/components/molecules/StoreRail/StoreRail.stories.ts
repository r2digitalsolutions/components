import type { Meta, StoryObj } from '@storybook/svelte';
import StoreRailStory from './StoreRailStory.svelte';

const meta = {
	title: 'Molecules/StoreRail',
	component: StoreRailStory,
	tags: ['autodocs']
} satisfies Meta<typeof StoreRailStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
