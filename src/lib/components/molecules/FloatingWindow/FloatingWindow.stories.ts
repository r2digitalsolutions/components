import type { Meta, StoryObj } from '@storybook/svelte';
import FloatingWindowStory from './FloatingWindowStory.svelte';

const meta = {
	title: 'Molecules/FloatingWindow',
	component: FloatingWindowStory,
	tags: ['autodocs']
} satisfies Meta<typeof FloatingWindowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
