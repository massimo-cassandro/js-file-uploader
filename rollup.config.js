import { terser } from "rollup-plugin-terser";

const terserOptions = {
  compress: {
    passes: 2
  }
};

export default {
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
};
