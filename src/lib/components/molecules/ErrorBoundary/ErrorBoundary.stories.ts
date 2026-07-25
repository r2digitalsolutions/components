import type { Meta, StoryObj } from '@storybook/svelte';
import ErrorBoundaryStory from './ErrorBoundaryStory.svelte';

const meta = {
	title: 'Molecules/ErrorBoundary',
	component: ErrorBoundaryStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['panel', 'compact'] },
		startBroken: { control: 'boolean' }
	},
	args: { variant: 'panel', startBroken: false }
} satisfies Meta<typeof ErrorBoundaryStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { variant: 'compact' } };
export const AlreadyBroken: Story = {
	name: 'Already broken',
	args: { startBroken: true }
};
