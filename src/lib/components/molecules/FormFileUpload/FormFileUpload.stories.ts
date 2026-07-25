import type { Meta, StoryObj } from '@storybook/svelte';
import FormFileUploadStory from './FormFileUploadStory.svelte';

const meta = {
	title: 'Molecules/FormFileUpload',
	component: FormFileUploadStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormFileUploadStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
