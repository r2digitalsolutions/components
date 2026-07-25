import type { Meta, StoryObj } from '@storybook/svelte';
import InviteTeamFormStory from './InviteTeamFormStory.svelte';

const meta = {
	title: 'Organisms/InviteTeamForm',
	component: InviteTeamFormStory,
	tags: ['autodocs']
} satisfies Meta<typeof InviteTeamFormStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
