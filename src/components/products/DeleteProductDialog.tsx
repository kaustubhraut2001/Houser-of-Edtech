'use client';

import { useTransition } from 'react';
import { Product } from '@prisma/client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteProduct } from '@/lib/actions/products';
import { Loader2 } from 'lucide-react';

interface DeleteProductDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DeleteProductDialog({
    product,
    open,
    onOpenChange,
}: DeleteProductDialogProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (!product) return;

        startTransition(async () => {
            const result = await deleteProduct(product.id);
            if (result.success) {
                onOpenChange(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-slate-700 bg-slate-900 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Product</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Are you sure you want to delete <span className="font-semibold text-white">{product?.name}</span>?
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
