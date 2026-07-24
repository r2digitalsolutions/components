import type { Meta, StoryObj } from '@storybook/svelte';
import BreadcrumbStory from './BreadcrumbStory.svelte';

const meta = {
	title: 'Molecules/Breadcrumb',
	component: BreadcrumbStory,
	tags: ['autodocs']
} satisfies Meta<typeof BreadcrumbStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
