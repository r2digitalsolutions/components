import type { Meta, StoryObj } from '@storybook/svelte';
import LoadingOverlayStory from './LoadingOverlayStory.svelte';

const meta = {
	title: 'Molecules/LoadingOverlay',
	component: LoadingOverlayStory,
	tags: ['autodocs'],
	argTypes: {
		active: { control: 'boolean' },
		label: { control: 'text' },
		blur: { control: 'boolean' }
	},
	args: {
		active: true,
		label: 'Saving changes...',
		blur: true
	}
} satisfies Meta<typeof LoadingOverlayStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Idle: Story = { args: { active: false } };
