export type ComparisonOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte'

export function compareNumbers(
  num1: number | string,
  num2: number | string,
  operator: ComparisonOperator
): boolean {
  num1 = Number(num1)
  num2 = Number(num2)
  console.log('num1:', num1, 'num2:', num2)
  switch (operator) {
    case 'eq':
      return num1 === num2
    case 'ne':
      return num1 !== num2
    case 'gt':
      return num1 > num2
    case 'lt':
      return num1 < num2
    case 'gte':
      return num1 >= num2
    case 'lte':
      return num1 <= num2
    default:
      throw new Error(`Unknown operator: ${operator}`)
  }
}

export function compareDates(date1: Date, date2: Date, operator: ComparisonOperator): boolean {
  date1 = new Date(Number(date1))
  date2 = new Date(Number(date2))

  const formatDate = (date: Date) => date.toISOString().split('T')[0] // Format as YYYY-MM-DD
  const formattedDate1 = formatDate(date1)
  const formattedDate2 = formatDate(date2)
  console.log('date1:', formattedDate1, 'date2:', formattedDate2)

  return compareNumbers(
    new Date(formattedDate1).valueOf(),
    new Date(formattedDate2).valueOf(),
    operator
  )
}
