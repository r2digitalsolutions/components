import type { Meta, StoryObj } from '@storybook/svelte';
import MarqueeStory from './MarqueeStory.svelte';

const meta = {
	title: 'Molecules/Marquee',
	component: MarqueeStory,
	tags: ['autodocs'],
	argTypes: { speed: { control: 'number' } },
	args: { speed: 20 }
} satisfies Meta<typeof MarqueeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
