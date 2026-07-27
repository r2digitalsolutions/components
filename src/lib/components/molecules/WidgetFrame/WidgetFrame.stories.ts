import type { Meta, StoryObj } from '@storybook/svelte';
import WidgetFrameStory from './WidgetFrameStory.svelte';

const meta = {
	title: 'Molecules/WidgetFrame',
	component: WidgetFrameStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['gallery', 'freeform', 'collapse', 'reload', 'editable']
		}
	}
} satisfies Meta<typeof WidgetFrameStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'gallery' }
};

export const FreeformDragResize: Story = {
	args: { example: 'freeform' }
};

export const Collapse: Story = {
	args: { example: 'collapse' }
};

export const Reload: Story = {
	args: { example: 'reload' }
};

export const EditableChrome: Story = {
	args: { example: 'editable' }
};
