import type { Meta, StoryObj } from '@storybook/svelte';
import SettingsRowStory from './SettingsRowStory.svelte';

const meta = {
	title: 'Molecules/SettingsRow',
	component: SettingsRowStory,
	tags: ['autodocs']
} satisfies Meta<typeof SettingsRowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
