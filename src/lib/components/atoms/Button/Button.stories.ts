import type { Meta, StoryObj } from '@storybook/svelte';
import ButtonStory from './ButtonStory.svelte';

const meta = {
	title: 'Atoms/Button',
	component: ButtonStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'ghost', 'outline', 'destructive'],
			description: 'Visual style of the button'
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg', 'xl'],
			description: 'Size of the button'
		},
		loading: {
			control: 'boolean',
			description: 'Shows a loading spinner and disables interaction'
		},
		disabled: {
			control: 'boolean',
			description: 'Disables the button'
		},
		fullWidth: {
			control: 'boolean',
			description: 'Makes the button take full container width'
		},
		label: {
			control: 'text',
			description: 'Button text content'
		}
	},
	args: {
		variant: 'primary',
		size: 'md',
		loading: false,
		disabled: false,
		fullWidth: false,
		label: 'Click me'
	}
} satisfies Meta<typeof ButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: { variant: 'primary', label: 'Primary Button' }
};

export const Secondary: Story = {
	args: { variant: 'secondary', label: 'Secondary Button' }
};

export const Ghost: Story = {
	args: { variant: 'ghost', label: 'Ghost Button' }
};

export const Outline: Story = {
	args: { variant: 'outline', label: 'Outline Button' }
};

export const Destructive: Story = {
	args: { variant: 'destructive', label: 'Delete account' }
};

export const Loading: Story = {
	args: { loading: true, label: 'Saving...' }
};

export const Disabled: Story = {
	args: { disabled: true, label: 'Unavailable' }
};

export const ExtraSmall: Story = {
	args: { size: 'xs', label: 'XS Button' }
};

export const Large: Story = {
	args: { size: 'lg', label: 'Large Button' }
};

export const FullWidth: Story = {
	args: { fullWidth: true, label: 'Full Width' }
};
