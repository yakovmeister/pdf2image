import babel from "rollup-plugin-babel"
import { uglify } from "rollup-plugin-uglify"

const base = {
  plugins: [
    babel({
      exclude: "node_modules/**",
      runtimeHelpers: true
    }),
    uglify()
  ]
}

export default [
  Object.assign(
    {},
    base,
    {
      input: "src/index.js",
      output: {
        format: "cjs",
        file: "dist/index.min.js"
      }
    }
  )
]
