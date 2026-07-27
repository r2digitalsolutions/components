import type { Meta, StoryObj } from '@storybook/svelte';
import VersionTagStory from './VersionTagStory.svelte';

const meta = {
	title: 'Atoms/VersionTag',
	component: VersionTagStory,
	tags: ['autodocs']
} satisfies Meta<typeof VersionTagStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
