import type { Meta, StoryObj } from '@storybook/svelte';
import SafeAreaStory from './SafeAreaStory.svelte';

const meta = {
	title: 'Atoms/SafeArea',
	component: SafeAreaStory,
	tags: ['autodocs']
} satisfies Meta<typeof SafeAreaStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
