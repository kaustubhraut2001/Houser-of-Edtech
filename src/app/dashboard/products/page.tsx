import { getProducts } from '@/lib/actions/products';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProductsTable from '@/components/products/ProductsTable';
import ProductDialog from '@/components/products/ProductDialog';

export default async function ProductsPage() {
    const result = await getProducts();
    const products = result.success ? result.data : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Products</h1>
                <ProductDialog>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </ProductDialog>
            </div>

            <ProductsTable products={products} />
        </div>
    );
}
