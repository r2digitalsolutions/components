import type { Meta, StoryObj } from '@storybook/svelte';
import AuthCardStory from './AuthCardStory.svelte';

const meta = {
	title: 'Molecules/AuthCard',
	component: AuthCardStory,
	tags: ['autodocs']
} satisfies Meta<typeof AuthCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
