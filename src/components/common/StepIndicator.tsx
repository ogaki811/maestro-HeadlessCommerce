interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  currentStep?: number;
  steps?: Step[];
}

export default function StepIndicator({ currentStep = 1, steps }: StepIndicatorProps) {
  const defaultSteps: Step[] = [
    { number: 1, label: 'カート確認' },
    { number: 2, label: 'お客様情報' },
    { number: 3, label: '決済・完了' }
  ];

  const displaySteps = steps || defaultSteps;

  const titles: Record<number, string> = {
    1: 'ショッピングカート',
    2: 'ご注文確認',
    3: 'ご注文完了'
  };

  const pageTitle = titles[currentStep] || 'ショッピングカート';

  return (
    <section className="ec-step-indicator bg-white border-b border-gray-200">
      <div className="ec-step-indicator__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="ec-step-indicator__title text-3xl font-bold text-gray-900 text-center mb-8">{pageTitle}</h1>
        <div className="ec-step-indicator__steps flex items-center justify-center space-x-8 max-w-2xl mx-auto">
          {displaySteps.map((step, index) => (
            <div key={step.number} className="ec-step-indicator__step-wrapper flex items-center">
              {index > 0 && (
                <div className="ec-step-indicator__arrow text-gray-400 mx-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </div>
              )}
              <div className="ec-step-indicator__step flex flex-col items-center space-y-2">
                <div className={`ec-step-indicator__number w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step.number === currentStep
                    ? 'ec-step-indicator__number--current bg-black text-white'
                    : step.number < currentStep
                    ? 'ec-step-indicator__number--completed bg-green-500 text-white'
                    : 'ec-step-indicator__number--pending bg-gray-300 text-gray-600'
                }`}>
                  {step.number < currentStep ? (
                    <svg className="ec-step-indicator__check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <div className={`ec-step-indicator__label text-sm ${
                  step.number === currentStep ? 'ec-step-indicator__label--current font-medium text-gray-900' : 'text-gray-600'
                }`}>
                  {step.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
