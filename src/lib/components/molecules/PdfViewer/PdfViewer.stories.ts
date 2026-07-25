import type { Meta, StoryObj } from '@storybook/svelte';
import PdfViewerStory from './PdfViewerStory.svelte';

const meta = {
	title: 'Molecules/PdfViewer',
	component: PdfViewerStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'withSrc']
		}
	}
} satisfies Meta<typeof PdfViewerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { variant: 'default' }
};

export const WithSource: Story = {
	args: { variant: 'withSrc' }
};
