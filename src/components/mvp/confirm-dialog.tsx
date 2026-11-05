import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

/** Confirmación para acciones que cambian datos (cancelar, restablecer…). */
export function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onOpenChange }: { open: boolean; title: string; description: React.ReactNode; confirmLabel: string; onConfirm: () => void; onOpenChange: (open: boolean) => void }) {
	return <Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="mvp-dialog mvp-dialog--small">
			<DialogTitle className="mvp-dialog__title">{title}</DialogTitle>
			<DialogDescription className="mvp-dialog__lead" asChild><div>{description}</div></DialogDescription>
			<div className="mvp-actions">
				<button type="button" className="button mvp-button--danger" onClick={() => { onConfirm(); onOpenChange(false); }}>{confirmLabel}</button>
				<button type="button" className="mvp-link-button" onClick={() => onOpenChange(false)}>Volver</button>
			</div>
		</DialogContent>
	</Dialog>;
}
