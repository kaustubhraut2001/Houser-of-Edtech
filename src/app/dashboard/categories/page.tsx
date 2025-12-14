import { getCategories } from '@/lib/actions/categories';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CategoryTable from '@/components/categories/CategoryTable';
import CategoryDialog from '@/components/categories/CategoryDialog';

export default async function CategoriesPage() {
    const result = await getCategories();
    const categories = result.success ? (result.data ?? []) : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Categories</h1>
                <CategoryDialog>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </CategoryDialog>
            </div>

            <CategoryTable categories={categories} />
        </div>
    );
}
