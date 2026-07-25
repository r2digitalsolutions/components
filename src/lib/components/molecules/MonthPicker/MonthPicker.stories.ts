import type { Meta, StoryObj } from '@storybook/svelte';
import MonthPickerStory from './MonthPickerStory.svelte';

const meta = {
	title: 'Molecules/MonthPicker',
	component: MonthPickerStory,
	tags: ['autodocs'],
	argTypes: {
		locale: { control: 'select', options: ['en', 'es', 'fr', 'de'] }
	},
	args: { locale: 'en' }
} satisfies Meta<typeof MonthPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Spanish: Story = { args: { locale: 'es' } };
