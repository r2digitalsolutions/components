import type { Meta, StoryObj } from '@storybook/svelte';
import NavRailStory from './NavRailStory.svelte';

const meta = {
	title: 'Organisms/NavRail',
	component: NavRailStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered'
	}
} satisfies Meta<typeof NavRailStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
