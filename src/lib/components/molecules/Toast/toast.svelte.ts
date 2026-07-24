/**
 * Toast notification store — Svelte 5 runes
 */

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right';

export interface Toast {
	id: string;
	message: string;
	variant: ToastVariant;
	duration: number;
	dismissible: boolean;
	title?: string;
}

class ToastStore {
	toasts = $state<Toast[]>([]);

	private add(toast: Omit<Toast, 'id'>): string {
		const id = Math.random().toString(36).slice(2, 9);
		const newToast: Toast = { id, ...toast };
		this.toasts = [...this.toasts, newToast];

		if (toast.duration > 0) {
			setTimeout(() => this.dismiss(id), toast.duration);
		}
		return id;
	}

	dismiss(id: string) {
		this.toasts = this.toasts.filter((t) => t.id !== id);
	}

	clear() {
		this.toasts = [];
	}

	show(
		message: string,
		options: Partial<Omit<Toast, 'id' | 'message'>> = {}
	): string {
		return this.add({
			message,
			variant: 'default',
			duration: 4000,
			dismissible: true,
			...options
		});
	}

	success(message: string, title?: string): string {
		return this.add({ message, title, variant: 'success', duration: 4000, dismissible: true });
	}

	error(message: string, title?: string): string {
		return this.add({ message, title, variant: 'error', duration: 6000, dismissible: true });
	}

	warning(message: string, title?: string): string {
		return this.add({ message, title, variant: 'warning', duration: 5000, dismissible: true });
	}

	info(message: string, title?: string): string {
		return this.add({ message, title, variant: 'info', duration: 4000, dismissible: true });
	}
}

export const toastStore = new ToastStore();

/** Convenience shorthand */
export const toast = {
	show: (msg: string, opts?: Partial<Omit<Toast, 'id' | 'message'>>) => toastStore.show(msg, opts),
	success: (msg: string, title?: string) => toastStore.success(msg, title),
	error: (msg: string, title?: string) => toastStore.error(msg, title),
	warning: (msg: string, title?: string) => toastStore.warning(msg, title),
	info: (msg: string, title?: string) => toastStore.info(msg, title),
	dismiss: (id: string) => toastStore.dismiss(id),
	clear: () => toastStore.clear()
};
