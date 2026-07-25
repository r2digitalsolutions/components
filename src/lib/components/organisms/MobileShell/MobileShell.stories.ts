import type { Meta, StoryObj } from '@storybook/svelte';
import MobileShellStory from './MobileShellStory.svelte';

const meta = {
	title: 'Organisms/MobileShell',
	component: MobileShellStory,
	tags: ['autodocs']
} satisfies Meta<typeof MobileShellStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
