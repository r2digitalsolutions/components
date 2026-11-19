import type { Meta, StoryObj } from '@storybook/svelte';
import ProfilePickerStory from './ProfilePickerStory.svelte';

const meta = {
	title: 'Organisms/ProfilePicker',
	component: ProfilePickerStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof ProfilePickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
