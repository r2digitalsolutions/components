import type { Meta, StoryObj } from '@storybook/svelte';
import HotkeysStory from './HotkeysStory.svelte';

const meta = {
	title: 'Molecules/Hotkeys',
	component: HotkeysStory,
	tags: ['autodocs']
} satisfies Meta<typeof HotkeysStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
