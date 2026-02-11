export function getPage(searchParams: URLSearchParams) {
  const page = Number(searchParams.get('page') || '1');
  const limit = 10;
  const offset = (Math.max(page, 1) - 1) * limit;
  return { page, limit, offset };
}
