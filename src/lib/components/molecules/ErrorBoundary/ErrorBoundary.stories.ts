import type { Meta, StoryObj } from '@storybook/svelte';
import ErrorBoundaryStory from './ErrorBoundaryStory.svelte';

const meta = {
	title: 'Molecules/ErrorBoundary',
	component: ErrorBoundaryStory,
	tags: ['autodocs']
} satisfies Meta<typeof ErrorBoundaryStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
