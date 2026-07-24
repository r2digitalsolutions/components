import type { Meta, StoryObj } from '@storybook/svelte';
import IconButtonStory from './IconButtonStory.svelte';

const meta = {
	title: 'Atoms/IconButton',
	component: IconButtonStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'ghost', 'outline', 'destructive']
		},
		size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
		rounded: { control: 'boolean' },
		loading: { control: 'boolean' },
		disabled: { control: 'boolean' }
	},
	args: {
		variant: 'ghost',
		size: 'md',
		rounded: false,
		loading: false,
		disabled: false
	}
} satisfies Meta<typeof IconButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Rounded: Story = { args: { rounded: true } };
export const Loading: Story = { args: { loading: true } };
