import type { Meta, StoryObj } from '@storybook/svelte';
import UserChipStory from './UserChipStory.svelte';

const meta = {
	title: 'Molecules/UserChip',
	component: UserChipStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['playground', 'assignees', 'filters', 'mentions', 'sizes', 'variants']
		},
		name: { control: 'text' },
		description: { control: 'text' },
		status: {
			control: 'select',
			options: [undefined, 'online', 'offline', 'busy', 'away']
		},
		size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
		variant: { control: 'select', options: ['default', 'soft', 'outline', 'brand'] },
		label: { control: 'select', options: ['first', 'full'] },
		selected: { control: 'boolean' },
		disabled: { control: 'boolean' },
		removable: { control: 'boolean' }
	},
	args: {
		example: 'playground',
		name: 'Ada Lovelace',
		description: 'Engineer',
		avatar: 'https://i.pravatar.cc/80?img=5',
		status: 'online',
		size: 'md',
		variant: 'default',
		label: 'first',
		selected: false,
		disabled: false,
		removable: true
	}
} satisfies Meta<typeof UserChipStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Assignees: Story = {
	args: { example: 'assignees' }
};

export const Filters: Story = {
	name: 'Selectable filters',
	args: { example: 'filters' }
};

export const Mentions: Story = {
	args: { example: 'mentions' }
};

export const Sizes: Story = {
	args: { example: 'sizes' }
};

export const Variants: Story = {
	args: { example: 'variants' }
};

export const FullName: Story = {
	name: 'Full name',
	args: {
		example: 'playground',
		label: 'full',
		description: 'Pioneer of computing',
		removable: true
	}
};

export const Selected: Story = {
	args: {
		example: 'playground',
		selected: true,
		label: 'full'
	}
};

export const Disabled: Story = {
	args: {
		example: 'playground',
		disabled: true,
		removable: true
	}
};
