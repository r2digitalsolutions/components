import type { Meta, StoryObj } from '@storybook/svelte';
import ChangelogStory from './ChangelogStory.svelte';

const meta = {
	title: 'Organisms/Changelog',
	component: ChangelogStory,
	tags: ['autodocs']
} satisfies Meta<typeof ChangelogStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
