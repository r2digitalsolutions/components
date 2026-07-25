import type { Meta, StoryObj } from '@storybook/svelte';
import OtpVerifyStory from './OtpVerifyStory.svelte';

const meta = {
	title: 'Organisms/OtpVerify',
	component: OtpVerifyStory,
	tags: ['autodocs']
} satisfies Meta<typeof OtpVerifyStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
