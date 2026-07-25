import type { Meta, StoryObj } from '@storybook/svelte';
import SessionRowStory from './SessionRowStory.svelte';

const meta = {
	title: 'Molecules/SessionRow',
	component: SessionRowStory,
	tags: ['autodocs']
} satisfies Meta<typeof SessionRowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
