export class ListResponseDto<T> {
  data: T[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}
