import type { Meta, StoryObj } from '@storybook/svelte';
import CaretBlinkStory from './CaretBlinkStory.svelte';

const meta = {
	title: 'Atoms/CaretBlink',
	component: CaretBlinkStory,
	tags: ['autodocs'],
	argTypes: {
		visible: { control: 'boolean' },
		paused: { control: 'boolean' },
		height: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
		tone: {
			control: 'select',
			options: ['brand', 'primary', 'muted', 'success', 'warning', 'danger']
		},
		speed: { control: 'select', options: ['slow', 'normal', 'fast'] },
		shape: { control: 'select', options: ['bar', 'block', 'underscore'] },
		thickness: { control: 'select', options: ['thin', 'md', 'thick'] },
		demo: { control: false }
	},
	args: {
		visible: true,
		paused: false,
		height: 'md',
		tone: 'brand',
		speed: 'normal',
		shape: 'bar',
		thickness: 'md',
		demo: 'playground'
	}
} satisfies Meta<typeof CaretBlinkStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BlockCaret: Story = {
	args: { shape: 'block', height: 'lg' }
};

export const Underscore: Story = {
	args: { shape: 'underscore', tone: 'primary' }
};

export const FastBlink: Story = {
	args: { speed: 'fast', thickness: 'thick' }
};

export const Paused: Story = {
	args: { paused: true }
};

export const Hidden: Story = {
	args: { visible: false }
};

export const Shapes: Story = {
	args: { demo: 'shapes' }
};

export const Speeds: Story = {
	args: { demo: 'speeds' }
};

export const TonesAndHeights: Story = {
	args: { demo: 'tones' }
};

export const InEditor: Story = {
	args: { demo: 'editor' }
};
