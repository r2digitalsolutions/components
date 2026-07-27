import type { Meta, StoryObj } from '@storybook/svelte';
import RailMarkStory from './RailMarkStory.svelte';

const meta = {
	title: 'Atoms/RailMark',
	component: RailMarkStory,
	tags: ['autodocs'],
	argTypes: {
		active: { control: 'boolean' },
		side: { control: 'radio', options: ['left', 'right'] },
		thickness: { control: 'select', options: ['sm', 'md', 'lg'] },
		tone: {
			control: 'select',
			options: ['brand', 'primary', 'success', 'warning', 'danger', 'muted']
		},
		inset: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
		length: { control: 'select', options: ['full', 'short', 'auto'] },
		rounded: { control: 'boolean' },
		demo: { control: false }
	},
	args: {
		active: true,
		side: 'left',
		thickness: 'md',
		tone: 'brand',
		inset: 'md',
		length: 'auto',
		rounded: true,
		demo: 'playground'
	}
} satisfies Meta<typeof RailMarkStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RightSide: Story = {
	args: { side: 'right', tone: 'success' }
};

export const ShortStub: Story = {
	args: { length: 'short', thickness: 'lg', tone: 'warning' }
};

export const Inactive: Story = {
	args: { active: false }
};

export const Tones: Story = {
	args: { demo: 'tones' }
};

export const ThicknessAndInset: Story = {
	args: { demo: 'sizes' }
};

export const InNavigation: Story = {
	args: { demo: 'nav' }
};
