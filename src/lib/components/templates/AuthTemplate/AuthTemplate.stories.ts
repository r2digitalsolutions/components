import type { Meta, StoryObj } from '@storybook/svelte';
import AuthTemplateStory from './AuthTemplateStory.svelte';

const meta = {
	title: 'Templates/AuthTemplate',
	component: AuthTemplateStory,
	tags: ['autodocs']
} satisfies Meta<typeof AuthTemplateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
