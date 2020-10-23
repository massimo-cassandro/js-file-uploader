import { terser } from "rollup-plugin-terser";

const terserOptions = {
  compress: {
    passes: 2
  }
};

export default [
  {
    input: "src/file_uploader.js",
    output: [
      {
        file: "dist/FileUploader.umd.js",
        name: "FileUploader",
        format: "umd"
      },
      {
        file: "dist/FileUploader.umd.min.js",
        name: "FileUploader",
        format: "umd",
        plugins: [terser(terserOptions)]
      },
      {
        file: "dist/FileUploader.esm.js",
        format: "esm"
      },
      {
        file: "dist/FileUploader.esm.min.js",
        format: "esm",
        plugins: [terser(terserOptions)]
      }
    ]
  },
  {
    input: "src/i18n/en.js",
    output: [
      {
        file: "dist/i18n/en.umd.js",
        name: "fupl_strings_en",
        format: "amd"
      },
      {
        file: "dist/i18n/en.umd.min.js",
        name: "fupl_strings_en",
        format: "umd",
        plugins: [terser(terserOptions)]
      },
      {
        file: "dist/i18n/en.esm.js",
        format: "esm"
      },
      {
        file: "dist/i18n/en.esm.min.js",
        format: "esm",
        plugins: [terser(terserOptions)]
      }
    ]
  },
  {
    input: "src/i18n/it.js",
    output: [
      {
        file: "dist/i18n/it.umd.js",
        name: "fupl_strings_it",
        format: "amd"
      },
      {
        file: "dist/i18n/it.umd.min.js",
        name: "fupl_strings_it",
        format: "umd",
        plugins: [terser(terserOptions)]
      },
      {
        file: "dist/i18n/it.esm.js",
        format: "esm"
      },
      {
        file: "dist/i18n/it.esm.min.js",
        format: "esm",
        plugins: [terser(terserOptions)]
      }
    ]
  },
  {
    input: "src-utilities/check_required_uploader.js",
    output: [
      {
        file: "dist/utilities/check_required_uploader.umd.js",
        name: "check_required_uploader",
        format: "amd"
      },
      {
        file: "dist/utilities/check_required_uploader.umd.min.js",
        name: "check_required_uploader",
        format: "umd",
        plugins: [terser(terserOptions)]
      },
      {
        file: "dist/utilities/check_required_uploader.esm.js",
        format: "esm"
      },
      {
        file: "dist/utilities/check_required_uploader.esm.min.js",
        format: "esm",
        plugins: [terser(terserOptions)]
      }
    ]
  }

];
