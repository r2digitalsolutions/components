import type { Meta, StoryObj } from '@storybook/svelte';
import SettingsLayoutStory from './SettingsLayoutStory.svelte';

const meta = {
	title: 'Organisms/SettingsLayout',
	component: SettingsLayoutStory,
	tags: ['autodocs']
} satisfies Meta<typeof SettingsLayoutStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
