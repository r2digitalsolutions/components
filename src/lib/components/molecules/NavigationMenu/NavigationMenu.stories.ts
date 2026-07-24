import type { Meta, StoryObj } from '@storybook/svelte';
import NavigationMenuStory from './NavigationMenuStory.svelte';

const meta = {
	title: 'Molecules/NavigationMenu',
	component: NavigationMenuStory,
	tags: ['autodocs'],
	args: {}
} satisfies Meta<typeof NavigationMenuStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
