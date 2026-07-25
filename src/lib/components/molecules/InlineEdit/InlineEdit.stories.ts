import type { Meta, StoryObj } from '@storybook/svelte';
import InlineEditStory from './InlineEditStory.svelte';

const meta = {
	title: 'Molecules/InlineEdit',
	component: InlineEditStory,
	tags: ['autodocs']
} satisfies Meta<typeof InlineEditStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
