import type { Meta, StoryObj } from '@storybook/svelte';
import SettingsFormStory from './SettingsFormStory.svelte';

const meta = {
	title: 'Organisms/SettingsForm',
	component: SettingsFormStory,
	tags: ['autodocs']
} satisfies Meta<typeof SettingsFormStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
