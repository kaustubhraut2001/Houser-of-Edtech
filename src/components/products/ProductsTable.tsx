'use client';

import { useState } from 'react';
import { Product, Category } from '@prisma/client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import ProductDialog from './ProductDialog';
import DeleteProductDialog from './DeleteProductDialog';

type ProductWithCategory = Product & {
    category: Category | null;
};

interface ProductsTableProps {
    products: ProductWithCategory[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
    const [selectedProduct, setSelectedProduct] = useState<ProductWithCategory | null>(null);
    const [deleteProduct, setDeleteProduct] = useState<ProductWithCategory | null>(null);

    return (
        <>
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-slate-800/50">
                            <TableHead className="text-slate-300">Name</TableHead>
                            <TableHead className="text-slate-300">Category</TableHead>
                            <TableHead className="text-slate-300">Price</TableHead>
                            <TableHead className="text-slate-300">Stock</TableHead>
                            <TableHead className="text-slate-300">Created</TableHead>
                            <TableHead className="text-right text-slate-300">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-slate-400">
                                    No products found. Add your first product to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow
                                    key={product.id}
                                    className="border-slate-700 hover:bg-slate-800/30"
                                >
                                    <TableCell className="font-medium text-white">
                                        {product.name}
                                        {product.description && (
                                            <p className="text-sm text-slate-400 mt-1">
                                                {product.description}
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {product.category ? (
                                            <Badge variant="outline" className="border-purple-500 text-purple-400">
                                                {product.category.name}
                                            </Badge>
                                        ) : (
                                            <span className="text-slate-500">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-white">
                                        {formatCurrency(Number(product.price))}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                product.stock <= 10
                                                    ? 'border-red-500 text-red-400'
                                                    : 'border-green-500 text-green-400'
                                            }
                                        >
                                            {product.stock}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-400">
                                        {formatDate(product.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <ProductDialog product={product}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-slate-400 hover:text-purple-400"
                                                    onClick={() => setSelectedProduct(product)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </ProductDialog>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-400 hover:text-red-400"
                                                onClick={() => setDeleteProduct(product)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <DeleteProductDialog
                product={deleteProduct}
                open={!!deleteProduct}
                onOpenChange={(open) => !open && setDeleteProduct(null)}
            />
        </>
    );
}
