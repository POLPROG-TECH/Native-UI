import { defaultLabels, type NativeUILabels } from '../labels';

/**
 * Arabic (`ar`) translation of every string the library renders. Pass it as
 * `NativeUIConfig.labels`, together with `locale: 'ar'` for dates. Layout
 * direction is the app's job (`I18nManager.forceRTL`).
 */
export const arLabels: NativeUILabels = {
  close: 'إغلاق',
  cancel: 'إلغاء',
  confirm: 'موافق',
  clear: 'مسح',
  clearSearch: 'مسح البحث',
  goBack: 'رجوع',
  loading: 'جارٍ تحميل المحتوى',
  loadingIndicator: 'جارٍ التحميل',
  avatar: 'الصورة الرمزية',
  requiredMarker: defaultLabels.requiredMarker,
  required: 'مطلوب',
  rangeSeparator: defaultLabels.rangeSeparator,
  selectPlaceholder: 'اختر...',
  rangeStart: 'البداية',
  rangeEnd: 'النهاية',
  cardHint: 'اضغط لعرض التفاصيل',
  errorMessage: 'حدث خطأ ما.',
  errorRetry: 'إعادة المحاولة',
  dismiss: 'تجاهل',
  increase: 'زيادة',
  decrease: 'إنقاص',
  pinProgress: (entered, total) => `تم إدخال ${entered} من ${total} أرقام`,
  stepOf: (current, total) => `الخطوة ${current} من ${total}`,
  countOverflow: defaultLabels.countOverflow,
  statValue: defaultLabels.statValue,
  countdownUnits: { hours: ' س', minutes: ' د', seconds: ' ث' },
};
