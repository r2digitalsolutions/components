import type { Meta, StoryObj } from '@storybook/svelte';
import SecuritySettingsPageStory from './SecuritySettingsPageStory.svelte';

const meta = {
	title: 'Organisms/SecuritySettingsPage',
	component: SecuritySettingsPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof SecuritySettingsPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
