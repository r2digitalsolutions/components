import type { Meta, StoryObj } from '@storybook/svelte';
import BannerStory from './BannerStory.svelte';

const meta = {
	title: 'Molecules/Banner',
	component: BannerStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['info', 'success', 'warning', 'error', 'brand'] },
		dismissible: { control: 'boolean' }
	},
	args: { variant: 'brand', dismissible: true }
} satisfies Meta<typeof BannerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Warning: Story = { args: { variant: 'warning' } };
export const Error: Story = { args: { variant: 'error' } };
