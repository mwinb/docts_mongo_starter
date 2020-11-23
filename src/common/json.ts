export const formatJsonString = (jsonString: string): string => {
  return '\n' + jsonString.split('{').join('{\n  ').split(',').join(',\n  ').split('}').join('\n}');
};
