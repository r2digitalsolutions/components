import type { Meta, StoryObj } from '@storybook/svelte';
import BackToTopStory from './BackToTopStory.svelte';

const meta = {
	title: 'Molecules/BackToTop',
	component: BackToTopStory,
	tags: ['autodocs'],
	argTypes: {
		threshold: { control: 'number' },
		position: { control: 'select', options: ['bottom-right', 'bottom-left'] }
	},
	args: {
		threshold: 80,
		position: 'bottom-right'
	}
} satisfies Meta<typeof BackToTopStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const BottomLeft: Story = { args: { position: 'bottom-left' } };
