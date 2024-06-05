import path from "path";
import { rollup } from "rollup";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const outputDir = path.resolve(path.resolve(), "./dist");

const runBuild = async () => {
  const input = path.resolve(path.resolve(), "./index.ts");
  let bundle;
  try {
    bundle = await rollup({
      external: ["vue"],
      input,
      plugins: [
        vue(),
        // vueJsx(),
        typescript({
          tsconfig: "./tsconfig.json",
        }),
        nodeResolve({ extensions: [".mjs", ".js", ".json", ".ts"] }),
        commonjs(),
        babel({
          babelHelpers: "bundled",
          extensions: [".js", ".jsx", ".es6", ".es", ".mjs", ".cjs", ".ts"],
          presets: ["@babel/preset-env", "@babel/preset-typescript"],
        }),
      ],
      treeshake: false,
    });
  } catch (error) {
    console.log(error, "error");
  }

  // console.log(bundle, "bundle");
  // console.log(bundle.watchFiles, "watchFiles");

  // await generateOutputs(bundle);

  writeBundles(
    bundle,
    buildConfig.map(([module, config]) => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === "cjs" ? "named" : undefined,
        preserveModules: true,
        preserveModulesRoot: "src",
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      };
    })
  );
};

async function generateOutputs(bundle) {
  for (const outputOptions of [
    {
      module: "ESNext",
      format: "esm",
      ext: "mjs",
      name: "es",
      dir: path.join(outputDir, "es"),
      // output: {
      //   name: "es",
      //   dir: path.join(outputDir, "es"),
      // },
      // bundle: {
      //   path: `dist/es`,
      // },
    },
  ]) {
    console.log(outputOptions, "outputOptions");
    // 生成特定于输出的内存中代码
    // 你可以在同一个 bundle 对象上多次调用此函数
    // 使用 bundle.write 代替 bundle.generate 直接写入磁盘
    await bundle.write(outputOptions);
    // const codeInfo = await bundle.generate(outputOptions);
    // console.log(codeInfo, "codeInfo");

    // for (const chunkOrAsset of output) {
    //   if (chunkOrAsset.type === "asset") {
    //     // 对于资源文件，它包含：
    //     // {
    //     //   fileName: string,              // 资源文件名
    //     //   source: string | Uint8Array    // 资源文件内容
    //     //   type: 'asset'                  // 标志它是一个资源文件
    //     // }
    //     console.log("Asset", chunkOrAsset);
    //   } else {
    //     // 对于 chunk，它包含以下内容：
    //     // {
    //     //   code: string,                  // 生成的 JS 代码
    //     //   dynamicImports: string[],      // 此 chunk 动态导入的外部模块
    //     //   exports: string[],             // 导出的变量名
    //     //   facadeModuleId: string | null, // 与此 chunk 对应的模块的 ID
    //     //   fileName: string,              // chunk 文件名
    //     //   implicitlyLoadedBefore: string[]; // 仅在此 chunk 后加载的条目
    //     //   imports: string[],             // 此 chunk 静态导入的外部模块
    //     //   importedBindings: {[imported: string]: string[]} // 每个依赖项的导入绑定
    //     //   isDynamicEntry: boolean,       // 此 chunk 是否为动态入口点
    //     //   isEntry: boolean,              // 此 chunk 是否为静态入口点
    //     //   isImplicitEntry: boolean,      // 是否应在其他 chunk 之后仅加载此 chunk
    //     //   map: string | null,            // 如果存在，则为源映射
    //     //   modules: {                     // 此 chunk 中模块的信息
    //     //     [id: string]: {
    //     //       renderedExports: string[]; // 包含的导出变量名
    //     //       removedExports: string[];  // 已删除的导出变量名
    //     //       renderedLength: number;    // 此模块中剩余代码的长度
    //     //       originalLength: number;    // 此模块中代码的原始长度
    //     //       code: string | null;       // 此模块中的剩余代码
    //     //     };
    //     //   },
    //     //   name: string                   // 用于命名模式的此 chunk 的名称
    //     //   preliminaryFileName: string    // 此 chunk 带有哈希占位符的初始文件名
    //     //   referencedFiles: string[]      // 通过 import.meta.ROLLUP_FILE_URL_<id> 引用的文件
    //     //   type: 'chunk',                 // 表示这是一个 chunk
    //     // }
    //     console.log("Chunk", chunkOrAsset.modules);
    //   }
    // }
  }
}

const buildConfig = Object.entries({
  esm: {
    module: "ESNext",
    format: "esm",
    ext: "mjs",
    output: {
      name: "es",
      path: path.join(outputDir, "es"),
    },
    bundle: {
      path: `dist/es`,
    },
  },
  // cjs: {
  //   module: 'CommonJS',
  //   format: 'cjs',
  //   ext: 'js',
  //   output: {
  //     name: 'lib',
  //     path: path.resolve(outputDir, 'lib'),
  //   },
  //   bundle: {
  //     path: `${PKG_NAME}/lib`,
  //   },
  // },
});

function writeBundles(bundle, options) {
  return Promise.all(options.map((option) => bundle.write(option)));
}

runBuild();
