"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vm = require("vm");
var babel = require("babel-core");
function generateES5Code(code, fileType) {
    // 有些新的语言特性需要转化, 看模型限制
    var babelPresetsEx = {
        js: [],
        ts: ["@babel/typescript"],
    };
    var babelPresets = __spreadArrays(["@babel/env"], babelPresetsEx[fileType]);
    var regeneratedCode = babel.transform(code, {
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
    regeneratedCode = "\n            'use strict';\n            (($context) => {\n                try{\n                    " + code + ";\n                    return $excute(context);\n                }catch(e){\n                  $context && $context.reportError && $context.reportError(\"CallRunTimeCoreError: \" + e.stack) \n                    return null;\n                }\n            })(context)\n         ";
    return regeneratedCode;
}
function excute(params) {
    var code = params.code, fileType = params.fileType, context = params.context, _a = params.timeout, timeout = _a === void 0 ? 600 : _a;
    var regeneratedCode = generateES5Code(code, fileType);
    var vmContext = new vm.createContext({ context: context });
    var script = new vm.Script(regeneratedCode);
    var data = script.runInContext(vmContext, {
        displayErrors: true,
        timeout: timeout,
    });
    return data;
}
exports.excute = excute;
