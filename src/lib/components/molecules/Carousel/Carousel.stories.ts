import type { Meta, StoryObj } from '@storybook/svelte';
import CarouselStory from './CarouselStory.svelte';

const meta = {
	title: 'Molecules/Carousel',
	component: CarouselStory,
	tags: ['autodocs'],
	argTypes: {
		example: { control: 'select', options: ['images', 'colors'] },
		autoplay: { control: 'boolean' },
		loop: { control: 'boolean' },
		showDots: { control: 'boolean' },
		showArrows: { control: 'boolean' },
		interval: { control: 'number' }
	},
	args: {
		example: 'images',
		autoplay: false,
		loop: true,
		showDots: true,
		showArrows: true,
		interval: 3000
	}
} satisfies Meta<typeof CarouselStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Autoplay: Story = { args: { autoplay: true, interval: 2500 } };
export const NoLoop: Story = { args: { loop: false } };
export const ColorsOnly: Story = { args: { example: 'colors' } };
export const NoControls: Story = { args: { showDots: false, showArrows: false } };
