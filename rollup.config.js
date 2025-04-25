import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "./src/index.js",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
        exports: "named",
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        exports: "named",
      },
    ],
    external: ["react", "react-dom"],
    plugins: [
      peerDepsExternal(),
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled", // ✅ Required for Babel to work properly
        presets: ["@babel/preset-react"],
      }),
      postcss({
        extract: "dist/styles.css", // ✅ creates a separate CSS file
        minimize: true,
      }),
      resolve(),
      terser(),
    ],
  },
];
