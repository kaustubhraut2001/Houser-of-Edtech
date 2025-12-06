import { getProductStats, getLowStockProducts } from '@/lib/actions/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export default async function DashboardPage() {
    const statsResult = await getProductStats();
    const lowStockResult = await getLowStockProducts(10);

    const stats = statsResult.success ? statsResult.data : null;
    const lowStockProducts = lowStockResult.success ? lowStockResult.data : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <Link href="/dashboard/products">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        View All Products
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Total Products
                        </CardTitle>
                        <Package className="h-5 w-5 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">
                            {stats?.totalProducts || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Low Stock Alert
                        </CardTitle>
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">
                            {stats?.lowStockCount || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Total Items
                        </CardTitle>
                        <TrendingUp className="h-5 w-5 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">
                            {stats?.totalItems || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Categories
                        </CardTitle>
                        <DollarSign className="h-5 w-5 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">
                            {stats ? '3+' : '0'}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle className="text-white">Low Stock Products</CardTitle>
                </CardHeader>
                <CardContent>
                    {lowStockProducts.length === 0 ? (
                        <p className="text-center text-slate-400 py-8">
                            No low stock products found
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {lowStockProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4"
                                >
                                    <div>
                                        <h3 className="font-medium text-white">{product.name}</h3>
                                        <p className="text-sm text-slate-400">
                                            {product.category?.name || 'Uncategorized'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge
                                            variant="outline"
                                            className="border-red-500 text-red-400"
                                        >
                                            {product.stock} left
                                        </Badge>
                                        <span className="text-lg font-semibold text-white">
                                            {formatCurrency(Number(product.price))}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
