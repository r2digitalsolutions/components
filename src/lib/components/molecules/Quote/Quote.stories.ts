import type { Meta, StoryObj } from '@storybook/svelte';
import QuoteStory from './QuoteStory.svelte';

const meta = {
	title: 'Molecules/Quote',
	component: QuoteStory,
	tags: ['autodocs']
} satisfies Meta<typeof QuoteStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
