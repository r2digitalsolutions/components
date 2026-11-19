import type { Meta, StoryObj } from '@storybook/svelte';
import ActionRowStory from './ActionRowStory.svelte';

const meta = {
	title: 'Molecules/ActionRow',
	component: ActionRowStory,
	tags: ['autodocs'],
	parameters: { layout: 'padded' }
} satisfies Meta<typeof ActionRowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
