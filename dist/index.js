var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'node:fs';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import _generator from '@babel/generator';
import { parse as sfcParse } from '@vue/compiler-sfc';
import { execCommand } from './exec.js';
const traverse = _traverse.default;
const generator = _generator.default;
let isDev = false;
let username = '';
let map = {};
/**
 * Initialize the git username
 */
const initUsername = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!username) {
        username = (yield execCommand('git config user.name'));
    }
});
/**
 * Work with the content of the file
 * @param {*} scriptContent File contents
 * @param {*} id File path
 * @returns The contents of the processed file
 */
const processScript = (scriptContent, id) => {
    const ast = parse(scriptContent, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
    });
    traverse(ast, {
        CallExpression(path) {
            if (path.node.callee.type === 'MemberExpression' &&
                path.node.callee.property.name === 'log') {
                const logLine = path.node.loc.start.line;
                const commiter = map[logLine];
                if (commiter !== username && commiter !== 'Not') {
                    console.log(`文件${id}的第${path.node.loc.start.line}行找到了非${username}的console.log。`);
                    path.remove();
                }
            }
        },
    });
    return generator(ast).code;
};
/**
 * Remove is not your console, Supported file types: js ts jsx tsx vue
 * @param options Configure options
 * @param options.include Folders included  --  Default: [ /src/ ]
 * @param options.fileRegex Files that need to be processed -- Default: /\.(?:[tj]sx?|vue)$/
 * @returns
 */
export default function removeConsolePlugin(options = { include: ['/src/'], fileRegex: /\.(?:[tj]sx?|vue)$/ }) {
    const includePatterns = options.include || ['/src/'];
    const fileRegex = options.fileRegex || /\.(?:[tj]sx?|vue)$/;
    return {
        name: 'remove-console-plugin',
        config(_config, ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                isDev = ctx.mode === 'development';
                yield initUsername();
                console.log('当前用户：', username);
            });
        },
        load(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const url = id;
                const shouldProcess = includePatterns.some(pattern => url.includes(pattern));
                if (shouldProcess && fileRegex.test(url) && isDev) {
                    const blameOutput = (yield execCommand(`git blame ${id}`));
                    map = blameOutput
                        .trim()
                        .split('\n')
                        .reduce((acc, line, index) => {
                        const match = line.match(/\((.*?)\)/);
                        if (!match) {
                            acc[index + 1] = 'Not';
                            return acc;
                        }
                        const author = match[1];
                        acc[index + 1] = author.trim().split(' ')[0];
                        return acc;
                    }, {});
                    const originalContent = fs.readFileSync(id, 'utf-8');
                    // Work with .vue files
                    if (url.endsWith('.vue')) {
                        const { descriptor } = sfcParse(originalContent);
                        let result = originalContent;
                        // Handle the <script setup> section
                        if (descriptor.scriptSetup) {
                            const newCode = processScript(descriptor.scriptSetup.content, id);
                            result = result.replace(descriptor.scriptSetup.content, newCode);
                        }
                        // Handle the <script> section
                        if (descriptor.script && !descriptor.scriptSetup) {
                            const newCode = processScript(descriptor.script.content, id);
                            result = result.replace(descriptor.script.content, newCode);
                        }
                        return result;
                    }
                    // Work on other documents (.js, .jsx, .ts, .tsx)
                    const result = processScript(originalContent, id);
                    return result;
                }
            });
        },
    };
}
