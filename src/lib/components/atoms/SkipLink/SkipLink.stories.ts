import type { Meta, StoryObj } from '@storybook/svelte';
import SkipLinkStory from './SkipLinkStory.svelte';

const meta = {
	title: 'Atoms/SkipLink',
	component: SkipLinkStory,
	tags: ['autodocs']
} satisfies Meta<typeof SkipLinkStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
