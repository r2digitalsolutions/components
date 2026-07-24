import type { Meta, StoryObj } from '@storybook/svelte';
import AccordionStory from './AccordionStory.svelte';

const meta = {
	title: 'Molecules/Accordion',
	component: AccordionStory,
	tags: ['autodocs'],
	argTypes: {
		type: { control: 'select', options: ['single', 'multiple'] },
		collapsible: { control: 'boolean' }
	},
	args: {
		type: 'single',
		collapsible: true
	}
} satisfies Meta<typeof AccordionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};
export const Multiple: Story = { args: { type: 'multiple' } };
export const NonCollapsible: Story = { args: { collapsible: false } };
