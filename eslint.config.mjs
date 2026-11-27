import { FlatCompat } from '@eslint/eslintrc';
const compat = new FlatCompat({baseDirectory: import.meta.dirname});
export default [{ignores:['.next/**','node_modules/**','test-results/**']},...compat.extends('next/core-web-vitals','next/typescript'), {rules:{'@next/next/no-html-link-for-pages':'off'}}];


