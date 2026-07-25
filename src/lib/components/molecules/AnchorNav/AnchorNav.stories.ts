import type { Meta, StoryObj } from '@storybook/svelte';
import AnchorNavStory from './AnchorNavStory.svelte';

const meta = {
	title: 'Molecules/AnchorNav',
	component: AnchorNavStory,
	tags: ['autodocs']
} satisfies Meta<typeof AnchorNavStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
