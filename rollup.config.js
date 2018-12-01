import babel from "rollup-plugin-babel"
import { uglify } from "rollup-plugin-uglify"
import resolve from "rollup-plugin-node-resolve"
import alias from "rollup-plugin-alias"

export default {
  entry: "src/index.js",
  dest: "dist/index.min.js",
  format: "cjs",
  plugins: [
    alias({
      resolve: [".js"]
    }),
    resolve({
      module: false,
      jsnext: false,
      main: true,
      modulesOnly: true
    }),
    babel({
      exclude: "node_modules/**"
    }),
    uglify()
  ]
}
