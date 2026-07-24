import type { Meta, StoryObj } from '@storybook/svelte';
import MenubarStory from './MenubarStory.svelte';

const meta = {
	title: 'Organisms/Menubar',
	component: MenubarStory,
	tags: ['autodocs'],
	args: {}
} satisfies Meta<typeof MenubarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
