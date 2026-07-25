import type { Meta, StoryObj } from '@storybook/svelte';
import FileManagerStory from './FileManagerStory.svelte';

const meta = {
	title: 'Organisms/FileManager',
	component: FileManagerStory,
	tags: ['autodocs']
} satisfies Meta<typeof FileManagerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
