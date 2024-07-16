import { format } from 'date-fns'

export const formatDateTime = (date: string) => {
  return format(date, 'dd.MM.yyyy HH:mm');
};