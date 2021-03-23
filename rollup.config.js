import { terser } from "rollup-plugin-terser";
import sourcemaps from 'rollup-plugin-sourcemaps';
import resolve from '@rollup/plugin-node-resolve';


const terserOptions = {
  compress: {
    passes: 2
  }
};

export default [
  {
    input: "src/file_uploader.js",
    plugins: [sourcemaps(), resolve()],
    output: [
      {
        file: "dist/FileUploader.umd.js",
        name: "FileUploader",
        format: "umd",
        sourcemap: true
      },
      {
        file: "dist/FileUploader.umd.min.js",
        name: "FileUploader",
        format: "umd",
        plugins: [terser(terserOptions)],
        sourcemap: true
      },
      {
        file: "dist/FileUploader.esm.js",
        format: "esm",
        sourcemap: true
      },
      {
        file: "dist/FileUploader.esm.min.js",
        format: "esm",
        plugins: [terser(terserOptions)],
        sourcemap: true
      }
    ]
  },
  {
    input: "src/i18n/en.js",
    plugins: [sourcemaps(), resolve()],
    output: [
      {
        file: "dist/i18n/en.umd.js",
        name: "fupl_strings_en",
        format: "amd",
        sourcemap: true
      },
      {
        file: "dist/i18n/en.umd.min.js",
        name: "fupl_strings_en",
        format: "umd",
        plugins: [terser(terserOptions)],
        sourcemap: true
      },
      {
        file: "dist/i18n/en.esm.js",
        format: "esm",
        sourcemap: true
      },
      {
        file: "dist/i18n/en.esm.min.js",
        format: "esm",
        plugins: [terser(terserOptions)],
        sourcemap: true
      }
    ]
  },
  {
    input: "src/i18n/it.js",
    plugins: [sourcemaps(), resolve()],
    output: [
      {
        file: "dist/i18n/it.umd.js",
        name: "fupl_strings_it",
        format: "amd",
        sourcemap: true
      },
      {
        file: "dist/i18n/it.umd.min.js",
        name: "fupl_strings_it",
        format: "umd",
        plugins: [terser(terserOptions)],
        sourcemap: true
      },
      {
        file: "dist/i18n/it.esm.js",
        format: "esm",
        sourcemap: true
      },
      {
        file: "dist/i18n/it.esm.min.js",
        format: "esm",
        plugins: [terser(terserOptions)],
        sourcemap: true
      }
    ]
  },
  {
    input: "src-utilities/check_required_uploader.js",
    plugins: [sourcemaps(), resolve()],
    output: [
      {
        file: "dist/utilities/check_required_uploader.umd.js",
        name: "check_required_uploader",
        format: "amd",
        sourcemap: true
      },
      {
        file: "dist/utilities/check_required_uploader.umd.min.js",
        name: "check_required_uploader",
        format: "umd",
        plugins: [terser(terserOptions)],
        sourcemap: true
      },
      {
        file: "dist/utilities/check_required_uploader.esm.js",
        format: "esm",
        sourcemap: true
      },
      {
        file: "dist/utilities/check_required_uploader.esm.min.js",
        format: "esm",
        plugins: [terser(terserOptions)],
        sourcemap: true
      }
    ]
  }

];
