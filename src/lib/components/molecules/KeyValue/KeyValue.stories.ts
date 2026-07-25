import type { Meta, StoryObj } from '@storybook/svelte';
import KeyValueStory from './KeyValueStory.svelte';

const meta = {
	title: 'Molecules/KeyValue',
	component: KeyValueStory,
	tags: ['autodocs']
} satisfies Meta<typeof KeyValueStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
