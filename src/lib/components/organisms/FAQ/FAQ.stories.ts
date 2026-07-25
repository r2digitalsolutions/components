import type { Meta, StoryObj } from '@storybook/svelte';
import FAQStory from './FAQStory.svelte';

const meta = {
	title: 'Organisms/FAQ',
	component: FAQStory,
	tags: ['autodocs']
} satisfies Meta<typeof FAQStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
