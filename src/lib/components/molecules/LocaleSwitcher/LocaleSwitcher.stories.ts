import type { Meta, StoryObj } from '@storybook/svelte';
import LocaleSwitcherStory from './LocaleSwitcherStory.svelte';

const meta = {
	title: 'Molecules/LocaleSwitcher',
	component: LocaleSwitcherStory,
	tags: ['autodocs']
} satisfies Meta<typeof LocaleSwitcherStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
