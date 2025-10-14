const TextUtils = {
  capitalize([first, ...rest]: string, locale = navigator.language) {
    return !first ? "" : first.toLocaleUpperCase(locale) + rest.join("");
  },

  titleCase(input: string, locale = navigator.language) {
    const words = input.split(/\s/g);
    return words
      .map((word) => word.toLocaleLowerCase(locale))
      .map((word) => TextUtils.capitalize(word, locale))
      .join(" ");
  },
};

export default TextUtils;
