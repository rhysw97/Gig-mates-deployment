"use strict";

/** @type {import('tailwindcss').Config}
 */
var colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      '2xs': '320px',
      'xs': '480px',
      ...defaultTheme.screens
    },
    extend: {
      colors: {
        primary: '#102225',
        secondary: '#5865f2',
        gray: {
          900: '#202225',
          800: '#2f3136',
          700: '#36393f',
          600: '#4f545c',
          400: '#d4d7dc',
          300: '#e3e5e8',
          200: '#ebedef',
          100: '#f2f3f5'
        }
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)'
      }
    },
    plugins: []
  }
};