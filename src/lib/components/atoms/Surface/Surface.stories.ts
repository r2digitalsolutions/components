import type { Meta, StoryObj } from '@storybook/svelte';
import SurfaceStory from './SurfaceStory.svelte';

const meta = {
	title: 'Atoms/Surface',
	component: SurfaceStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['default', 'elevated', 'overlay', 'soft', 'ghost'] },
		padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] }
	},
	args: { variant: 'elevated', padding: 'md' }
} satisfies Meta<typeof SurfaceStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
