import type { Meta, StoryObj } from '@storybook/svelte';
import ExpressionEditorStory from './ExpressionEditorStory.svelte';

const meta = {
	title: 'Molecules/ExpressionEditor',
	component: ExpressionEditorStory,
	tags: ['autodocs']
} satisfies Meta<typeof ExpressionEditorStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
