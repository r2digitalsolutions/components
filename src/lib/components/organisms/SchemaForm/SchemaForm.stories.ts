import type { Meta, StoryObj } from '@storybook/svelte';
import SchemaFormStory from './SchemaFormStory.svelte';

const meta = {
	title: 'Organisms/SchemaForm',
	component: SchemaFormStory,
	tags: ['autodocs']
} satisfies Meta<typeof SchemaFormStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
