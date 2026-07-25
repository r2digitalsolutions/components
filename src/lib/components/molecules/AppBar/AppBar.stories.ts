import type { Meta, StoryObj } from '@storybook/svelte';
import AppBarStory from './AppBarStory.svelte';

const meta = {
	title: 'Molecules/AppBar',
	component: AppBarStory,
	tags: ['autodocs']
} satisfies Meta<typeof AppBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
