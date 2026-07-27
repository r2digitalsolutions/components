import type { Meta, StoryObj } from '@storybook/svelte';
import BacklogPageStory from './BacklogPageStory.svelte';

const meta = {
	title: 'Organisms/BacklogPage',
	component: BacklogPageStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof BacklogPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
