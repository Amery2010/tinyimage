/**
 * 格式化文件大小, 输出成带单位的字符串
 * @param size 文件大小
 * @param pointLength 精确到的小数点数。
 * @param units 从字节，到千字节，一直往上指定。如果单位数组里面只指定了到了 KB(千字节)，同时文件大小大于 MB, 此方法的输出将还是显示成多少 KB。
 * @returns 格式化后的文件大小
 * @example
 */
function formatSize(size: number, pointLength = 2, units?: string[]): string {
  if (typeof size === 'undefined') return '0'
  if (typeof units === 'undefined') units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let unit
  while ((unit = units.shift() as string) && size >= 1024) size = size / 1024
  return (unit === units[0] ? size : size.toFixed(pointLength === undefined ? 2 : pointLength)) + unit
}

export default formatSize
