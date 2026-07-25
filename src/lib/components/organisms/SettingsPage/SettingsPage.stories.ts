import type { Meta, StoryObj } from '@storybook/svelte';
import SettingsPageStory from './SettingsPageStory.svelte';

const meta = {
	title: 'Organisms/SettingsPage',
	component: SettingsPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof SettingsPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
