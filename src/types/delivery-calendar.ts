/**
 * 配送カレンダー（スマートデリバリー）の型定義
 */

/** 配送パターン */
export type DeliveryPattern = 'weekdays' | 'weekdaysAndSaturday' | 'custom';

/** 曜日（月曜〜土曜） */
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

/** 曜日の日本語表示マッピング */
export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  monday: '月曜',
  tuesday: '火曜',
  wednesday: '水曜',
  thursday: '木曜',
  friday: '金曜',
  saturday: '土曜',
};

/** 全ての曜日（順序付き） */
export const ALL_DAYS: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

/** 配送カレンダー設定 */
export interface DeliveryCalendarSettings {
  /** 配送パターン */
  deliveryPattern: DeliveryPattern;
  /** カスタム選択時の曜日（カスタム以外の場合は空配列） */
  customDays: DayOfWeek[];
}

/** 配送カレンダーAPIリクエスト */
export interface DeliveryCalendarRequest {
  deliveryPattern: DeliveryPattern;
  customDays?: DayOfWeek[];
}

/** 配送カレンダーAPIレスポンス */
export interface DeliveryCalendarResponse {
  success: boolean;
  message: string;
  data?: DeliveryCalendarSettings;
}

/** フォームの検証エラー */
export interface DeliveryCalendarValidationError {
  field: 'customDays';
  message: string;
}
