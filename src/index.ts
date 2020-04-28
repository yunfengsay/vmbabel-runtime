const vm = require("vm");
const babel = require("babel-core");

interface Params {
  code: string;
  fileType: string;
  context?: {};
  timeout: number;
}

function generateES5Code(code, fileType) {
  // 有些新的语言特性需要转化, 看模型限制
  const babelPresetsEx = {
    js: [],
    ts: ["@babel/typescript"],
  };
  const babelPresets = ["@babel/env", ...babelPresetsEx[fileType]];

  let regeneratedCode = babel.transform(code, {
    filename: "_regeneratedCode.ts",
    ast: false,
    presets: babelPresets,
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          regenerator: true,
        },
      ],
    ],
  }).code;
  regeneratedCode = `
            'use strict';
            (($context) => {
                try{
                    ${code};
                    // return excute(context);
                }catch(e){
                  $context && $context.reportError && $context.reportError("CallRunTimeCoreError: " + e.stack) 
                    return null;
                }
            })(context)
         `;
  return regeneratedCode;
}

export function excute(params: Params) {
  const { code, fileType, context, timeout = 600 } = params;
  const regeneratedCode = generateES5Code(code, fileType);
  const vmContext = new vm.createContext({ context });
  const script = new vm.Script(regeneratedCode);
  const data = script.runInContext(vmContext, {
    displayErrors: true,
    timeout,
  });
  return data;
}
