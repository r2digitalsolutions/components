import type { Meta, StoryObj } from '@storybook/svelte';
import TeamPageStory from './TeamPageStory.svelte';

const meta = {
	title: 'Organisms/TeamPage',
	component: TeamPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof TeamPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
