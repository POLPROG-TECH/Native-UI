import { defaultLabels, type NativeUILabels } from '../labels';

/**
 * Spanish (`es-ES`) translation of every string the library renders. Pass it
 * as `NativeUIConfig.labels`, together with `locale: 'es-ES'` for dates.
 */
export const esLabels: NativeUILabels = {
  close: 'Cerrar',
  cancel: 'Cancelar',
  confirm: 'Aceptar',
  clear: 'Borrar',
  clearSearch: 'Borrar búsqueda',
  goBack: 'Volver',
  loading: 'Cargando contenido',
  loadingIndicator: 'Cargando',
  avatar: 'Avatar',
  requiredMarker: defaultLabels.requiredMarker,
  required: 'obligatorio',
  rangeSeparator: defaultLabels.rangeSeparator,
  selectPlaceholder: 'Seleccionar...',
  rangeStart: 'Inicio',
  rangeEnd: 'Fin',
  cardHint: 'Toca para ver los detalles',
  errorMessage: 'Algo salió mal.',
  errorRetry: 'Reintentar',
  dismiss: 'Descartar',
  increase: 'Aumentar',
  decrease: 'Disminuir',
  pinProgress: (entered, total) => `${entered} de ${total} dígitos introducidos`,
  stepOf: (current, total) => `Paso ${current} de ${total}`,
  countOverflow: defaultLabels.countOverflow,
  statValue: defaultLabels.statValue,
  countdownUnits: defaultLabels.countdownUnits,
};
