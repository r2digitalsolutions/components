import type { Meta, StoryObj } from '@storybook/svelte';
import ReceiptCardStory from './ReceiptCardStory.svelte';

const meta = {
	title: 'Molecules/ReceiptCard',
	component: ReceiptCardStory,
	tags: ['autodocs']
} satisfies Meta<typeof ReceiptCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
