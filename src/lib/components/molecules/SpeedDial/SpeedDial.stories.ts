import type { Meta, StoryObj } from '@storybook/svelte';
import SpeedDialStory from './SpeedDialStory.svelte';

const meta = {
	title: 'Molecules/SpeedDial',
	component: SpeedDialStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['compose', 'media', 'toolbar', 'destructive'],
			description: 'Action set / content pattern'
		},
		position: {
			control: 'select',
			options: ['bottom-right', 'bottom-left', 'top-right', 'top-left']
		},
		direction: {
			control: 'select',
			options: ['auto', 'up', 'down', 'left', 'right']
		},
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'ghost', 'outline', 'destructive']
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg']
		},
		showLabels: {
			control: 'select',
			options: ['hover', 'always', 'never']
		},
		backdrop: { control: 'boolean' },
		closeOnAction: { control: 'boolean' },
		closeOnOutsideClick: { control: 'boolean' },
		closeOnEscape: { control: 'boolean' }
	},
	args: {
		example: 'compose',
		position: 'bottom-right',
		direction: 'auto',
		variant: 'primary',
		size: 'lg',
		showLabels: 'hover',
		backdrop: false,
		closeOnAction: true,
		closeOnOutsideClick: true,
		closeOnEscape: true
	}
} satisfies Meta<typeof SpeedDialStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AlwaysLabels: Story = {
	name: 'Always labels',
	args: { showLabels: 'always' }
};

export const WithBackdrop: Story = {
	name: 'With backdrop',
	args: { backdrop: true, showLabels: 'always' }
};

export const Media: Story = {
	args: { example: 'media', showLabels: 'hover' }
};

export const Toolbar: Story = {
	args: {
		example: 'toolbar',
		direction: 'left',
		position: 'bottom-right',
		showLabels: 'always',
		size: 'md'
	}
};

export const Destructive: Story = {
	args: {
		example: 'destructive',
		showLabels: 'always',
		variant: 'secondary'
	}
};

export const TopLeft: Story = {
	name: 'Top left',
	args: { position: 'top-left', direction: 'auto' }
};

export const TopRight: Story = {
	name: 'Top right',
	args: { position: 'top-right' }
};

export const BottomLeft: Story = {
	name: 'Bottom left',
	args: { position: 'bottom-left', showLabels: 'always' }
};

export const Horizontal: Story = {
	args: {
		direction: 'left',
		position: 'bottom-right',
		example: 'media',
		showLabels: 'hover'
	}
};

export const Compact: Story = {
	args: { size: 'sm', showLabels: 'never', example: 'compose' }
};

export const Persistent: Story = {
	name: 'Stay open',
	args: {
		closeOnAction: false,
		closeOnOutsideClick: false,
		showLabels: 'always',
		example: 'toolbar'
	}
};
