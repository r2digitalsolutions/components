import type { Meta, StoryObj } from '@storybook/svelte';
import DocsLayoutStory from './DocsLayoutStory.svelte';

const meta = {
	title: 'Organisms/DocsLayout',
	component: DocsLayoutStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof DocsLayoutStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
