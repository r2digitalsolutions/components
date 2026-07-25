import type { Meta, StoryObj } from '@storybook/svelte';
import FileManagerStory from './FileManagerStory.svelte';

const meta = {
	title: 'Organisms/FileManager',
	component: FileManagerStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<typeof FileManagerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { variant: 'default' },
	parameters: { layout: 'padded' }
};

export const Grid: Story = {
	args: { variant: 'grid' },
	parameters: { layout: 'padded' }
};

export const WithDetailsPanel: Story = {
	args: { variant: 'details' },
	parameters: { layout: 'padded' }
};

export const WithoutSidebar: Story = {
	args: { variant: 'no-sidebar' },
	parameters: { layout: 'padded' }
};

export const EmptyFolder: Story = {
	args: { variant: 'empty' },
	parameters: { layout: 'padded' }
};

/** App sidebar left + FileManager content right (no duplicate folder nav) */
export const InAppShell: Story = {
	args: { variant: 'app-shell' }
};
