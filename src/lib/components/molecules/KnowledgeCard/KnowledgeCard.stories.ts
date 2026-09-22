import type { Meta, StoryObj } from '@storybook/svelte'
import KnowledgeCardStory from './KnowledgeCardStory.svelte'

const meta = {
	title: 'Molecules/KnowledgeCard',
	component: KnowledgeCardStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['basic', 'with-cover', 'with-actions', 'minimal']
		}
	}
} satisfies Meta<typeof KnowledgeCardStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: { example: 'basic' }
}

export const WithCover: Story = {
	args: { example: 'with-cover' }
}

export const WithActions: Story = {
	args: { example: 'with-actions' }
}

export const Minimal: Story = {
	args: { example: 'minimal' }
}
