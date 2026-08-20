import type { Meta, StoryObj } from '@storybook/svelte';
import ComboboxItemStory from './ComboboxItemStory.svelte';

const meta = {
	title: 'Molecules/ComboboxItem',
	component: ComboboxItemStory,
	tags: ['autodocs']
} satisfies Meta<typeof ComboboxItemStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
