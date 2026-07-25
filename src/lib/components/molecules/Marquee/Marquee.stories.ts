import type { Meta, StoryObj } from '@storybook/svelte';
import MarqueeStory from './MarqueeStory.svelte';

const meta = {
	title: 'Molecules/Marquee',
	component: MarqueeStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['ticker', 'logos', 'reverse', 'announcement', 'dash']
		},
		separator: {
			control: 'select',
			options: ['dot', 'bullet', 'dash', 'pipe', 'none']
		},
		speed: { control: { type: 'range', min: 8, max: 60, step: 1 } }
	},
	args: { example: 'ticker', speed: 28, separator: 'dot' }
} satisfies Meta<typeof MarqueeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Logos: Story = { args: { example: 'logos', speed: 32 } };
export const Reverse: Story = {
	args: { example: 'reverse', speed: 24, separator: 'pipe' }
};
export const Dash: Story = {
	name: 'Dash separator',
	args: { example: 'dash', separator: 'dash' }
};
export const Announcement: Story = {
	name: 'Announcement bar',
	args: { example: 'announcement', speed: 22, separator: 'bullet' }
};
