interface StatusIconProps {
  status: 'success' | 'error' | 'warning' | 'info';
  icon?: 'check' | 'mail' | 'exclamation' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StatusIcon({
  status,
  icon,
  size = 'md',
  className = ''
}: StatusIconProps) {
  // ステータスごとの色設定
  const colorClasses = {
    success: 'bg-green-100 text-green-600',
    error: 'bg-red-100 text-red-600',
    warning: 'bg-yellow-100 text-yellow-600',
    info: 'bg-blue-100 text-blue-600',
  };

  // サイズ設定
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  // デフォルトアイコンを決定
  const defaultIcon = {
    success: 'check',
    error: 'exclamation',
    warning: 'exclamation',
    info: 'info',
  }[status];

  const selectedIcon = icon || defaultIcon;

  // アイコンのSVGパス
  const icons = {
    check: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    ),
    mail: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
    exclamation: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    ),
    info: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[status]} rounded-full flex items-center justify-center ${className}`}>
      <svg
        className={iconSizeClasses[size]}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {icons[selectedIcon]}
      </svg>
    </div>
  );
}
