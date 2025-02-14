export class EnumUtil {
  public static findEnumKeyFromValue<T>(enumType: T, value: T[keyof T]): keyof T {
    return Object.keys(enumType)[Object.values(enumType).indexOf(value)] as keyof T;
  }
}
