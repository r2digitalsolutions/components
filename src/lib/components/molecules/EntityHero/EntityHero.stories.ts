import type { Meta, StoryObj } from '@storybook/svelte';
import EntityHeroStory from './EntityHeroStory.svelte';

const meta = {
	title: 'Molecules/EntityHero',
	component: EntityHeroStory,
	tags: ['autodocs'],
	parameters: { layout: 'padded' }
} satisfies Meta<typeof EntityHeroStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
