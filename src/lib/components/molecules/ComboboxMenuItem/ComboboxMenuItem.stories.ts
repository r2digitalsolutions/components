import type { Meta, StoryObj } from '@storybook/svelte';
import ComboboxMenuItemStory from './ComboboxMenuItemStory.svelte';

const meta = {
	title: 'Molecules/ComboboxMenuItem',
	component: ComboboxMenuItemStory,
	tags: ['autodocs']
} satisfies Meta<typeof ComboboxMenuItemStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
