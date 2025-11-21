export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Headerはlayout.tsxで表示されるため、ここではメインコンテンツのスケルトンのみ */}

            <main className="flex-grow">
                {/* Breadcrumb Skeleton */}
                <div className="bg-gray-50 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Image Gallery Skeleton (Left Column) */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                            {/* Thumbnails */}
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 animate-pulse"></div>
                                ))}
                            </div>
                        </div>

                        {/* Product Info Skeleton (Right Column) */}
                        <div className="space-y-8">
                            {/* Brand & Category */}
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            </div>

                            {/* Price & Rating */}
                            <div className="space-y-4 border-b border-gray-200 pb-6">
                                <div className="flex items-baseline gap-4">
                                    <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                                </div>
                                <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                            </div>

                            {/* Actions (Quantity & Cart) */}
                            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
                                    <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 bg-gray-200 rounded flex-1 animate-pulse"></div>
                                    <div className="h-12 bg-gray-200 rounded w-12 animate-pulse"></div>
                                </div>
                            </div>

                            {/* Description Short */}
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Description & Specs Skeleton */}
                    <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                            <div className="space-y-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
