import type { Meta, StoryObj } from '@storybook/svelte';
import HamburgerButtonStory from './HamburgerButtonStory.svelte';

const meta = {
	title: 'Atoms/HamburgerButton',
	component: HamburgerButtonStory,
	tags: ['autodocs']
} satisfies Meta<typeof HamburgerButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
