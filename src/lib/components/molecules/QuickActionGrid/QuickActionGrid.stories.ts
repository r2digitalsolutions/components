import type { Meta, StoryObj } from '@storybook/svelte';
import QuickActionGridStory from './QuickActionGridStory.svelte';

const meta = {
	title: 'Molecules/QuickActionGrid',
	component: QuickActionGridStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['workspace', 'create', 'compact', 'list', 'emoji']
		},
		layout: {
			control: 'select',
			options: ['tiles', 'compact', 'list']
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg']
		},
		columns: {
			control: 'select',
			options: [2, 3, 4, 5, 6]
		}
	}
} satisfies Meta<typeof QuickActionGridStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'workspace', layout: 'tiles', size: 'md' }
};

export const CreateMenu: Story = {
	args: { example: 'create', layout: 'tiles', columns: 4 }
};

export const CompactResponsive: Story = {
	args: { example: 'compact', layout: 'compact', size: 'md' }
};

export const List: Story = {
	args: { example: 'list', layout: 'list' }
};

export const EmojiIcons: Story = {
	args: { example: 'emoji', layout: 'tiles', columns: 4 }
};
