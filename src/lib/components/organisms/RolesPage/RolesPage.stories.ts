import type { Meta, StoryObj } from '@storybook/svelte';
import RolesPageStory from './RolesPageStory.svelte';

const meta = {
	title: 'Organisms/RolesPage',
	component: RolesPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof RolesPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
