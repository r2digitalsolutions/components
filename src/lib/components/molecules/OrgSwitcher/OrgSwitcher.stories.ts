import type { Meta, StoryObj } from '@storybook/svelte';
import OrgSwitcherStory from './OrgSwitcherStory.svelte';

const meta = {
	title: 'Molecules/OrgSwitcher',
	component: OrgSwitcherStory,
	tags: ['autodocs']
} satisfies Meta<typeof OrgSwitcherStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
