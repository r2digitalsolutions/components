import type { Meta, StoryObj } from '@storybook/svelte';
import FileRowStory from './FileRowStory.svelte';

const meta = {
	title: 'Molecules/FileRow',
	component: FileRowStory,
	tags: ['autodocs']
} satisfies Meta<typeof FileRowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
