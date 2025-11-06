'use client';

import { useState, useEffect } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // 画像が変更されたらselectedImageをリセット
  useEffect(() => {
    setSelectedImage(0);
  }, [images]);

  // 画像が存在しない場合のフォールバック
  if (!images || images.length === 0) {
    return (
      <div className="ec-product-detail__images">
        <div className="ec-product-detail__main-image bg-gray-200 rounded-lg overflow-hidden mb-4 flex items-center justify-center h-96">
          <span className="text-gray-500">画像なし</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ec-product-detail__images">
      {/* メイン画像 */}
      <div className="ec-product-detail__main-image bg-gray-100 rounded-lg overflow-hidden mb-4">
        <img
          src={images[selectedImage] || '/placeholder.png'}
          alt={productName}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* 画像が2枚以上ある場合のみサムネイル表示 */}
      {images.length > 1 && (
        <div className="ec-product-detail__thumbnails flex gap-2 flex-wrap">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`ec-product-detail__thumbnail ${selectedImage === index ? 'ec-product-detail__thumbnail--active' : ''} w-24 h-24 border-2 rounded-lg overflow-hidden flex-shrink-0 ${
                selectedImage === index ? 'border-black' : 'border-gray-200'
              }`}
            >
              <img src={image} alt={`${productName} ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
