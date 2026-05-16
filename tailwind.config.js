/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f5f8f5",
          100: "#e6efe7",
          200: "#cbded0",
          300: "#a3c5ac",
          400: "#7c9885",
          500: "#5e7d68",
          600: "#496452",
          700: "#3b5143",
          800: "#314238",
          900: "#293730",
        },
      },
      fontFamily: {
        pretendard: ["Pretendard", "System"],
        "pretendard-bold": ["Pretendard-Bold", "System"],
      },
    },
  },
  plugins: [],
};
