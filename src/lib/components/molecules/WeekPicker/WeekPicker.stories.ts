import type { Meta, StoryObj } from '@storybook/svelte';
import WeekPickerStory from './WeekPickerStory.svelte';

const meta = {
	title: 'Molecules/WeekPicker',
	component: WeekPickerStory,
	tags: ['autodocs'],
	argTypes: {
		locale: { control: 'select', options: ['en', 'es', 'fr', 'de'] }
	},
	args: { locale: 'en' }
} satisfies Meta<typeof WeekPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Spanish: Story = { args: { locale: 'es' } };
