import type { Meta, StoryObj } from '@storybook/svelte';
import QRCodeStory from './QRCodeStory.svelte';

const meta = {
	title: 'Atoms/QRCode',
	component: QRCodeStory,
	tags: ['autodocs'],
	argTypes: {
		value: { control: 'text' },
		size: { control: { type: 'number', min: 96, max: 320 } },
		fgColor: { control: 'color' },
		bgColor: { control: 'color' },
		rounded: { control: 'boolean' },
		bordered: { control: 'boolean' },
		showLogo: { control: 'boolean' },
		logoSize: { control: { type: 'number', min: 14, max: 32 } }
	},
	args: {
		value: 'https://r2digisolutions.com',
		size: 200,
		fgColor: '#18181b',
		bgColor: '#ffffff',
		rounded: true,
		bordered: true,
		showLogo: true,
		logoSize: 22
	}
} satisfies Meta<typeof QRCodeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutLogo: Story = { args: { showLogo: false } };
export const Large: Story = { args: { size: 280, logoSize: 20 } };
