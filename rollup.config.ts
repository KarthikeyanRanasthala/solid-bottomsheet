import withSolid from "rollup-preset-solid";
import copy from "rollup-plugin-copy";

export default withSolid({
  input: "src/index.tsx",
  targets: ["esm", "cjs"],
  plugins: [
    copy({
      targets: [{ src: "src/styles.css", dest: "dist" }],
    }),
  ],
});
