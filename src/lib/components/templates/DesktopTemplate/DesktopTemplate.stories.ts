import type { Meta, StoryObj } from '@storybook/svelte';
import DesktopTemplateStory from './DesktopTemplateStory.svelte';

const meta = {
	title: 'Templates/DesktopTemplate',
	component: DesktopTemplateStory,
	tags: ['autodocs']
} satisfies Meta<typeof DesktopTemplateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
