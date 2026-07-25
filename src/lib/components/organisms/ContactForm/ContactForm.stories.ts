import type { Meta, StoryObj } from '@storybook/svelte';
import ContactFormStory from './ContactFormStory.svelte';

const meta = {
	title: 'Organisms/ContactForm',
	component: ContactFormStory,
	tags: ['autodocs']
} satisfies Meta<typeof ContactFormStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { variant: 'default' }
};

export const Loading: Story = {
	args: { variant: 'loading' }
};

export const Success: Story = {
	args: { variant: 'success' }
};

export const AsyncSubmit: Story = {
	args: { variant: 'async' }
};
