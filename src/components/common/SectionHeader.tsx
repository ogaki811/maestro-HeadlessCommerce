interface SectionHeaderProps {
  title: string;
  accentColor?: 'gray' | 'orange' | 'blue';
  className?: string;
}

export default function SectionHeader({
  title,
  accentColor = 'gray',
  className = ''
}: SectionHeaderProps) {
  const colorClasses = {
    gray: 'bg-gray-900',
    orange: 'bg-orange-500',
    blue: 'bg-blue-600',
  };

  return (
    <div className={`flex items-center mb-6 ${className}`}>
      <div className={`w-1 h-6 ${colorClasses[accentColor]} mr-3`}></div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
  );
}
