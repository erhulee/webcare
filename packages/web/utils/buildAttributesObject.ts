export function buildAttributesObject<T extends readonly string[]>(
  attributes: NamedNodeMap,
  keys: T
): any {
  return keys
    .map((key) => attributes.getNamedItem(key)?.nodeValue)
    .reduce((obj: any, curValue, index) => {
      const key = keys[index];
      if (curValue == null) return obj;
      obj[key] = curValue;
      return obj;
    }, {});
}


