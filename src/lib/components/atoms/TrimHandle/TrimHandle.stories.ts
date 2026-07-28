import type { Meta, StoryObj } from '@storybook/svelte';
import TrimHandleStory from './TrimHandleStory.svelte';

const meta = {
	title: 'Atoms/TrimHandle',
	component: TrimHandleStory,
	tags: ['autodocs']
} satisfies Meta<typeof TrimHandleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
