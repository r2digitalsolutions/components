import type { Meta, StoryObj } from '@storybook/svelte';
import ContainerStory from './ContainerStory.svelte';

const meta = {
	title: 'Atoms/Container',
	component: ContainerStory,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full']
		},
		padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] }
	},
	args: { size: 'md', padding: 'md' }
} satisfies Meta<typeof ContainerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Narrow: Story = { args: { size: 'sm' } };
export const Wide: Story = { args: { size: '7xl' } };
export const FullBleed: Story = { args: { size: 'full', padding: 'lg' } };
