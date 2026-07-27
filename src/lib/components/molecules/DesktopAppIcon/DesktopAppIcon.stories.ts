import type { Meta, StoryObj } from '@storybook/svelte';
import DesktopAppIconStory from './DesktopAppIconStory.svelte';

const meta = {
	title: 'Molecules/DesktopAppIcon',
	component: DesktopAppIconStory,
	tags: ['autodocs']
} satisfies Meta<typeof DesktopAppIconStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
