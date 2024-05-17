import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        scrollHandle: 'var(--scrollHandle-color)',
        scrollHandleHover: 'var(--scrollHandleHover-color)',
        body: 'var(--body-color)',
        grey: 'var(--grey-color)',
        placeholder: 'var(--placeholder-color)',
        text: 'var(--text-color)',
        text100: 'var(--text100-color)',
        text200: 'var(--text200-color)',
        text300: 'var(--text300-color)',
        textButton: 'var(--textButton-color)',
        success: 'var(--success-color)',
        error: 'var(--error-color)',
        warn: 'var(--warn-color)',
        info: 'var(--info-color)',
        footer: 'var(--footer-color)',
      },
    },
  },
  plugins: [],
};
export default config;
