import type { Meta, StoryObj } from '@storybook/svelte';
import SlugInputStory from './SlugInputStory.svelte';

const meta = {
	title: 'Molecules/SlugInput',
	component: SlugInputStory,
	tags: ['autodocs']
} satisfies Meta<typeof SlugInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
