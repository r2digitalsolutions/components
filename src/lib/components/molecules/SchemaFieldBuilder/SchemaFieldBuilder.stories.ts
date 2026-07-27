import type { Meta, StoryObj } from '@storybook/svelte';
import SchemaFieldBuilderStory from './SchemaFieldBuilderStory.svelte';

const meta = {
	title: 'Molecules/SchemaFieldBuilder',
	component: SchemaFieldBuilderStory,
	tags: ['autodocs']
} satisfies Meta<typeof SchemaFieldBuilderStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
