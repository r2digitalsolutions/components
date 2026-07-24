import type { Meta, StoryObj } from '@storybook/svelte';
import BottomNavStory from './BottomNavStory.svelte';

const meta = {
	title: 'Organisms/BottomNav',
	component: BottomNavStory,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	argTypes: {
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		variant: { control: 'select', options: ['default', 'floating', 'pill', 'notch'] },
		showLabels: { control: 'boolean' },
		blur: { control: 'boolean' },
		elevated: { control: 'boolean' },
		example: {
			control: 'select',
			options: ['social', 'commerce', 'workspace', 'iconsOnly', 'music']
		},
		fabClass: { control: 'text' }
	},
	args: {
		size: 'md',
		variant: 'notch',
		showLabels: true,
		blur: false,
		elevated: true,
		example: 'social',
		fabClass: 'bg-brand-500 hover:bg-brand-600'
	}
} satisfies Meta<typeof BottomNavStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SocialNotch: Story = { args: { example: 'social', variant: 'notch' } };
export const OrangeFab: Story = {
	args: {
		example: 'social',
		variant: 'notch',
		fabClass: 'bg-orange-500 hover:bg-orange-600'
	}
};
export const Floating: Story = { args: { example: 'social', variant: 'floating' } };
export const Pill: Story = { args: { example: 'music', variant: 'pill' } };
export const Commerce: Story = { args: { example: 'commerce', variant: 'default' } };
export const Workspace: Story = { args: { example: 'workspace', size: 'sm', variant: 'default' } };
export const IconsOnly: Story = {
	args: { example: 'iconsOnly', showLabels: false, variant: 'notch' }
};
export const Large: Story = { args: { example: 'social', size: 'lg', variant: 'notch' } };
export const WithBlur: Story = { args: { example: 'social', variant: 'notch', blur: true } };
