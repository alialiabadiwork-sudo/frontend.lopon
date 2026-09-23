import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
    colors: {
      current: 'currentColor',
        "27": '#272727',
      "firoze": "#e094a4",
      "b-gray": '#eceef0',
      "s-gray": "#f1f5f9",
      "primary": "#ff6b6b",        // رنگ اصلی پرایمری جدید
      "primary-dark": "#ee5a52",   // نسخه تیره‌تر
      "primary-light": "#ffa5a5",  // نسخه روشن‌تر
    },
    fontFamily: {
      "kal-1": "kal-1",
      "kal-2": "kal-2",
      "kal-3": "kal-3",
      "kal-4": "kal-4",
      "ir-sand": "ir-sand",
    }
  },
  plugins: [daisyui],
}