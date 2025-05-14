import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

export default {
  input: "./src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      exports: "named",
      sourcemap: true, // Helpful for debugging
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      exports: "named",
      sourcemap: true,
    },
  ],
  external: [
    "react",
    "react-dom",
    "next/link",
    "next/navigation",
    "lodash/isString",
    "lodash/isNaN",
    "lodash/get",
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({
      include: "node_modules/**",
    }),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
      presets: ["@babel/preset-react"],
    }),
    postcss({
      extract: "dist/styles.css",
      minimize: true,
      plugins: [],
    }),
    terser(),
  ],
  onwarn: (warning, warn) => {
    // Ignore circular dependency warnings
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
  },
};
