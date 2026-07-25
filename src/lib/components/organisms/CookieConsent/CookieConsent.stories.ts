import type { Meta, StoryObj } from '@storybook/svelte';
import CookieConsentStory from './CookieConsentStory.svelte';

const meta = {
	title: 'Organisms/CookieConsent',
	component: CookieConsentStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['bar', 'card'] }
	},
	args: { variant: 'bar' }
} satisfies Meta<typeof CookieConsentStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Card: Story = { args: { variant: 'card' } };
