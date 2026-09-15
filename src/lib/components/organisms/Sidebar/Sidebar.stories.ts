import type { Meta, StoryObj } from '@storybook/svelte';
import SidebarStory from './SidebarStory.svelte';

const meta = {
	title: 'Organisms/Sidebar',
	component: SidebarStory,
	tags: ['autodocs'],
	argTypes: {
		collapsed: { control: 'boolean' }
	},
	args: { collapsed: false }
} satisfies Meta<typeof SidebarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Collapsed: Story = { args: { collapsed: true } };
export const WizardStepper: Story = { args: { wizard: true } };
