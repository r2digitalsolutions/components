import type { Meta, StoryObj } from '@storybook/svelte';
import InvoiceListStory from './InvoiceListStory.svelte';

const meta = {
	title: 'Molecules/InvoiceList',
	component: InvoiceListStory,
	tags: ['autodocs']
} satisfies Meta<typeof InvoiceListStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
