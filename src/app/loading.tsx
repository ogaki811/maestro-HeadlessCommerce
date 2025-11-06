import { Loading as LoadingSpinner } from '@/components/ui/Loading';

export default function Loading() {
  return (
    <div className="ec-loading min-h-screen flex items-center justify-center bg-gray-50">
      <div className="ec-loading__container text-center">
        <LoadingSpinner size="lg" />
        <p className="ec-loading__text mt-4 text-gray-600">
          読み込み中...
        </p>
      </div>
    </div>
  );
}
