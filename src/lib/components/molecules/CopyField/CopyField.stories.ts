import type { Meta, StoryObj } from '@storybook/svelte';
import CopyFieldStory from './CopyFieldStory.svelte';

const meta = {
	title: 'Molecules/CopyField',
	component: CopyFieldStory,
	tags: ['autodocs']
} satisfies Meta<typeof CopyFieldStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
