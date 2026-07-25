import type { Meta, StoryObj } from '@storybook/svelte';
import FormSectionStory from './FormSectionStory.svelte';

const meta = {
	title: 'Molecules/FormSection',
	component: FormSectionStory,
	tags: ['autodocs'],
	args: {
		title: 'Profile',
		description: 'Public information shown on your profile.'
	}
} satisfies Meta<typeof FormSectionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
