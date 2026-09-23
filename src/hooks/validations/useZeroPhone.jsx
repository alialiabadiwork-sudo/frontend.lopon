import { useEffect } from "react"

const toEnglishDigits = (str) => {
  if (!str) return '';
  return str
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
};

//phone validation
const useZeroPhone = (setValue, watch, feild) => {
  const value = watch(feild);

  useEffect(() => {
    if (value !== undefined && value !== null) {
      let cleaned = toEnglishDigits(value.toString());

      // 1. Remove any character that is not a digit or +
      cleaned = cleaned.replace(/[^\d+]/g, '');

      // 2. Convert +98 prefix to 0
      if (cleaned.startsWith('+98')) {
        cleaned = '0' + cleaned.substring(3);
      }

      // 3. Convert 0098 prefix to 0
      if (cleaned.startsWith('0098')) {
        cleaned = '0' + cleaned.substring(4);
      }

      // 4. Convert 00 at start to a single 0
      if (cleaned.startsWith('00')) {
        cleaned = '0' + cleaned.substring(2);
      }

      // 5. Convert 989... to 09...
      if (cleaned.startsWith('989')) {
        cleaned = '09' + cleaned.substring(3);
      }

      // 6. If it starts with '9' and has some digits, prepend '0'
      if (cleaned && !cleaned.startsWith('0') && cleaned.startsWith('9')) {
        cleaned = '0' + cleaned;
      }

      // 7. If it's empty, set to empty
      if (!value.trim()) {
        cleaned = '';
      }

      // Only update if the value has actually changed to prevent cursor issues and infinite render loops
      if (cleaned !== value) {
        setValue(feild, cleaned);
      }
    }
  }, [value, setValue, feild]);
}

export default useZeroPhone;
