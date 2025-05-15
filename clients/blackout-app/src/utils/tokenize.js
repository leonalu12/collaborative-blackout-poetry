
export function tokenize(text) {
    return text.match(/\w+|[^\w\s]|[\s]+/gu) || [];
  }