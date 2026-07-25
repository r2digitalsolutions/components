import type { Meta, StoryObj } from '@storybook/svelte';
import CountrySelectStory from './CountrySelectStory.svelte';

const meta = {
	title: 'Molecules/CountrySelect',
	component: CountrySelectStory,
	tags: ['autodocs']
} satisfies Meta<typeof CountrySelectStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
