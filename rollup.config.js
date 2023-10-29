import typescript from "rollup-plugin-typescript2"
import {terser} from "rollup-plugin-terser"
import babel from "rollup-plugin-babel"
import alias from "@rollup/plugin-alias"
import npm from "rollup-plugin-node-resolve"
export default {
        input: 'index.ts',
        output: [
            {
                file: 'dist/index.js',
                format: 'es'
            }
        ],
        plugins: [
            alias({
                // entries: [
                //     { find: "web",   replacement: "./"},
                // ]
            }),
            npm(),
            typescript({
                tsconfig: "tsconfig.json"
            }),
            babel({
                exclude: "node_modules/**"
            }),
            // terser()
        ]
    }