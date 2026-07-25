import type { Meta, StoryObj } from '@storybook/svelte';
import PdfViewerStory from './PdfViewerStory.svelte';

const meta = {
	title: 'Molecules/PdfViewer',
	component: PdfViewerStory,
	tags: ['autodocs']
} satisfies Meta<typeof PdfViewerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
