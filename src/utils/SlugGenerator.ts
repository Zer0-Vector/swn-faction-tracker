export function generateSlug(name: string, currentValues?: string[]): string {
  // replace groups of non-word characters with a single hyphen
  const simple = name.trim().toLowerCase().replaceAll(/[\W_]+/g, "-");

  // if there are no current values, then this is unique. done.
  if (currentValues === undefined) {
    return simple;
  }

  if (currentValues.length === 0) {
    return `${simple}-1`;
  }

  // extract baseName and index, i.e. "prefix-123" => "prefix", "123"
  const inputMatches = simple.match(/^(.+)-(\d+)?$/);
  const baseName = inputMatches?.at(1) || simple;
  const strIndex = inputMatches?.at(2);
  let index = strIndex !== undefined ? parseInt(strIndex) : 1;

  console.assert(index > 0, "index is invalid: ", index);
  const matches = currentValues.filter(val => val.startsWith(baseName));
  if (matches.length === 0) {
    return `${simple}-1`;
  }

  const indexes = matches
      .map(val => val.match(`${baseName}-(\\d+)`)?.at(1))
      .map(val => val ? parseInt(val) : 0);
  if (indexes.includes(index)) {
    index = Math.max(...indexes) + 1;
  }
  return `${baseName}-${index}`;
}

