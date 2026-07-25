import type { Meta, StoryObj } from '@storybook/svelte';
import RichTextEditorStory from './RichTextEditorStory.svelte';

const meta = {
	title: 'Molecules/RichTextEditor',
	component: RichTextEditorStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['default', 'minimal'] },
		showFooter: { control: 'boolean' }
	},
	args: {
		variant: 'default',
		showFooter: true
	}
} satisfies Meta<typeof RichTextEditorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Minimal: Story = {
	args: { variant: 'minimal' }
};

export const NoFooter: Story = {
	args: { showFooter: false }
};
