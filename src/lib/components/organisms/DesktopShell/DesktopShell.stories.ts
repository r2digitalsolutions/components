import type { Meta, StoryObj } from '@storybook/svelte';
import DesktopShellStory from './DesktopShellStory.svelte';

const meta = {
	title: 'Organisms/DesktopShell',
	component: DesktopShellStory,
	tags: ['autodocs']
} satisfies Meta<typeof DesktopShellStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
