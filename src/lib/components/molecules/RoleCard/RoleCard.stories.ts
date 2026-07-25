import type { Meta, StoryObj } from '@storybook/svelte';
import RoleCardStory from './RoleCardStory.svelte';

const meta = {
	title: 'Molecules/RoleCard',
	component: RoleCardStory,
	tags: ['autodocs']
} satisfies Meta<typeof RoleCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
