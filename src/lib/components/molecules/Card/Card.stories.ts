import type { Meta, StoryObj } from '@storybook/svelte';
import CardStory from './CardStory.svelte';

const meta = {
	title: 'Molecules/Card',
	component: CardStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'elevated', 'bordered', 'ghost'],
			description: 'Card visual style'
		},
		padding: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg'],
			description: 'Inner padding size'
		},
		hoverable: {
			control: 'boolean',
			description: 'Enables hover elevation and pointer cursor'
		},
		title: { control: 'text', description: 'Header title text' },
		content: { control: 'text', description: 'Card body content' },
		footerText: { control: 'text', description: 'Footer text' }
	},
	args: {
		variant: 'default',
		padding: 'md',
		hoverable: false,
		title: 'Card Title',
		content: 'This is the main card body content. You can place any components or text here.',
		footerText: 'Card Footer'
	}
} satisfies Meta<typeof CardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: 'default' } };
export const Elevated: Story = { args: { variant: 'elevated' } };
export const Bordered: Story = { args: { variant: 'bordered' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Hoverable: Story = { args: { hoverable: true } };
