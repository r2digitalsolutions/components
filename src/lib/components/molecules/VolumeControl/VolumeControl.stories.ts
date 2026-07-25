import type { Meta, StoryObj } from '@storybook/svelte';
import VolumeControlStory from './VolumeControlStory.svelte';

const meta = {
	title: 'Molecules/VolumeControl',
	component: VolumeControlStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['inline', 'compact'] }
	},
	args: { variant: 'inline' }
} satisfies Meta<typeof VolumeControlStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { variant: 'compact' } };
