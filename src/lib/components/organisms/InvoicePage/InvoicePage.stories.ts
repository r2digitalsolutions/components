import type { Meta, StoryObj } from '@storybook/svelte';
import InvoicePageStory from './InvoicePageStory.svelte';

const meta = {
	title: 'Organisms/InvoicePage',
	component: InvoicePageStory,
	tags: ['autodocs']
} satisfies Meta<typeof InvoicePageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
