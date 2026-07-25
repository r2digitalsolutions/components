import type { Meta, StoryObj } from '@storybook/svelte';
import BarcodeStory from './BarcodeStory.svelte';

const meta = {
	title: 'Atoms/Barcode',
	component: BarcodeStory,
	tags: ['autodocs']
} satisfies Meta<typeof BarcodeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
