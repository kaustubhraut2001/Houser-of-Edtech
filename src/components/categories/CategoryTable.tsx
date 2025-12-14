'use client';

import { Category } from '@prisma/client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { deleteCategory } from '@/lib/actions/categories';
import { formatDate } from '@/lib/utils';
import CategoryDialog from './CategoryDialog';
import { useTransition } from 'react';

interface CategoryWithCount extends Category {
    _count?: {
        products: number;
    };
}

interface CategoryTableProps {
    categories: CategoryWithCount[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            startTransition(async () => {
                await deleteCategory(id);
            });
        }
    };

    return (
        <div className="rounded-md border border-slate-700 bg-slate-900/50 backdrop-blur-sm">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                        <TableHead className="text-slate-300">Name</TableHead>
                        <TableHead className="text-slate-300">Slug</TableHead>
                        <TableHead className="text-slate-300">Products</TableHead>
                        <TableHead className="text-slate-300">Last Updated</TableHead>
                        <TableHead className="text-right text-slate-300">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length === 0 ? (
                        <TableRow className="border-slate-700">
                            <TableCell colSpan={5} className="h-24 text-center text-slate-400">
                                No categories found. Create one to get started.
                            </TableCell>
                        </TableRow>
                    ) : (
                        categories.map((category) => (
                            <TableRow key={category.id} className="border-slate-700 hover:bg-slate-800/50">
                                <TableCell className="font-medium text-white">{category.name}</TableCell>
                                <TableCell className="text-slate-400">{category.slug}</TableCell>
                                <TableCell className="text-slate-400">
                                    {category._count?.products || 0}
                                </TableCell>
                                <TableCell className="text-slate-400">
                                    {formatDate(category.updatedAt)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <CategoryDialog category={category}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </CategoryDialog>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-slate-700"
                                            onClick={() => handleDelete(category.id)}
                                            disabled={isPending}
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
    );
}
