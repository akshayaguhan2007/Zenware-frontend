type ClassValue = string | number | null | undefined | boolean | ClassDictionary | ClassArray;
interface ClassDictionary {
  [id: string]: any;
}
type ClassArray = ClassValue[];

function toClass(cls: ClassValue): string[] {
  if (!cls) return [];
  if (typeof cls === "string" || typeof cls === "number") {
    return [String(cls)];
  }

  if (Array.isArray(cls)) {
    return cls.flatMap(toClass);
  }

  if (typeof cls === "object") {
    return Object.keys(cls).filter((key) => (cls as ClassDictionary)[key]).map(String);
  }

  return [];
}

export function cn(...classes: ClassArray) {
  return classes.flatMap(toClass).filter(Boolean).join(" ");
}
