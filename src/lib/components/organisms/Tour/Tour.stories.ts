import type { Meta, StoryObj } from '@storybook/svelte';
import TourStory from './TourStory.svelte';

const meta = {
	title: 'Organisms/Tour',
	component: TourStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered'
	}
} satisfies Meta<typeof TourStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
