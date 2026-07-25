import type { Meta, StoryObj } from '@storybook/svelte';
import QueryBarStory from './QueryBarStory.svelte';

const meta = {
	title: 'Molecules/QueryBar',
	component: QueryBarStory,
	tags: ['autodocs']
} satisfies Meta<typeof QueryBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { variant: 'default' }
};

export const Empty: Story = {
	args: { variant: 'empty' }
};

export const WithSyntaxError: Story = {
	args: { variant: 'errors' }
};

export const CatalogQuery: Story = {
	args: { variant: 'catalog' }
};

export const Minimal: Story = {
	args: { variant: 'minimal' }
};
