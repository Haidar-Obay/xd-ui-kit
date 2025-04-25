import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
// import external from "@rollup/plugin-peer-deps-external";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import {terser} from "rollup-plugin-terser";

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
    external: ['react', 'react-dom'], // ✅ Add this line
    plugins: [
      peerDepsExternal(), // optional but safe to keep
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/preset-react"],
      }),
      resolve(),
      terser(),
    ],
  },
];
