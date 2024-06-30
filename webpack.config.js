// ES6 Imports
import path from "path";
import { fileURLToPath } from "url";
import nodeExternals from "webpack-node-externals";

// Define __dirname in ES Module scope
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Webpack configuration
export default {
  target: "node",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  externals: [nodeExternals()], // to ignore all modules in node_modules folder
  mode: "production",
};
