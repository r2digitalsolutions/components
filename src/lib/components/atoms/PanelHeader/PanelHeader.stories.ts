import type { Meta, StoryObj } from '@storybook/svelte';
import PanelHeaderStory from './PanelHeaderStory.svelte';

const meta = {
	title: 'Atoms/PanelHeader',
	component: PanelHeaderStory,
	tags: ['autodocs'],
	argTypes: {
		example: { control: 'select', options: ['gallery', 'dock', 'variants'] },
		variant: { control: 'select', options: ['subtle', 'solid', 'ghost'] },
		size: { control: 'select', options: ['sm', 'md'] },
		collapsible: { control: 'boolean' }
	},
	args: {
		example: 'gallery',
		variant: 'subtle',
		size: 'sm',
		collapsible: true
	}
} satisfies Meta<typeof PanelHeaderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Gallery',
	args: { example: 'gallery' }
};

export const Dock: Story = {
	args: { example: 'dock' }
};

export const Variants: Story = {
	args: { example: 'variants' }
};
