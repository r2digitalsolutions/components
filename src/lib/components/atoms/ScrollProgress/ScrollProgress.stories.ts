import type { Meta, StoryObj } from '@storybook/svelte';
import ScrollProgressStory from './ScrollProgressStory.svelte';

const meta = {
	title: 'Atoms/ScrollProgress',
	component: ScrollProgressStory,
	tags: ['autodocs'],
	argTypes: {
		height: { control: { type: 'number', min: 2, max: 12 } },
		color: { control: 'color' },
		showTrack: { control: 'boolean' }
	},
	args: { height: 4, color: '', showTrack: true }
} satisfies Meta<typeof ScrollProgressStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Thick: Story = { args: { height: 8 } };
export const CustomColor: Story = { args: { color: '#10b981', height: 5 } };
