"""Translate trusted educational kernels into static TS runners and three equivalent listings.
Run from any directory with Python 3.10+. Generated files are checked in.
"""
import ast
import json
import re
import textwrap
from pathlib import Path

from catalog import records
import sequences, structures, dynamic  # register curriculum

ROOT = Path(__file__).resolve().parents[1]
OPS = {ast.Add: '+', ast.Sub: '-', ast.Mult: '*', ast.FloorDiv: '/', ast.Mod: '%',
       ast.BitXor: '^', ast.BitAnd: '&', ast.BitOr: '|', ast.LShift:'<<', ast.RShift:'>>',
       ast.Eq: '==', ast.NotEq:'!=', ast.Lt:'<', ast.Gt:'>', ast.LtE:'<=', ast.GtE:'>='}
LANGS = ('cpp', 'java', 'python', 'ts')
JS = json.dumps

def expr(n, lang):
    rec = lambda x: expr(x, lang)
    if isinstance(n,ast.Name):
        return n.id
    if isinstance(n,ast.Constant):
        return str(n.value)
    if isinstance(n,ast.UnaryOp):
        return ('-' if isinstance(n.op,ast.USub) else '~') + rec(n.operand)
    if isinstance(n,ast.Subscript):
        return f'rt.read({rec(n.value)}, {rec(n.slice)})' if lang=='ts' else f'{rec(n.value)}[{rec(n.slice)}]'
    if isinstance(n,ast.List):
        data = ', '.join(map(rec,n.elts))
        if lang=='cpp': return 'std::vector<int>{' + data + '}'
        if lang=='java': return 'new int[]{' + data + '}'
        return '['+data+']'
    if isinstance(n,ast.BinOp):
        if isinstance(n.left,ast.List) and isinstance(n.op,ast.Mult):
            val, size = rec(n.left.elts[0]), rec(n.right)
            assert val=='0'
            return {'cpp':f'std::vector<int>({size}, 0)', 'java':f'new int[{size}]', 'ts':f'Array<number>({size}).fill(0)', 'python':f'[0] * ({size})'}[lang]
        left,right = rec(n.left),rec(n.right)
        if isinstance(n.op,ast.FloorDiv):
            if lang=='ts': return f'Math.floor({left} / {right})'
            if lang=='python': return f'({left} // {right})'
        return f'({left} {OPS[type(n.op)]} {right})'
    if isinstance(n,ast.BoolOp):
        op = (' and ' if lang=='python' else ' && ') if isinstance(n.op,ast.And) else (' or ' if lang=='python' else ' || ')
        return '('+op.join(map(rec,n.values))+')'
    if isinstance(n,ast.Compare):
        value = f'{rec(n.left)} {OPS[type(n.ops[0])]} {rec(n.comparators[0])}'
        return f'rt.cmp({value})' if lang=='ts' else '('+value+')'
    if isinstance(n,ast.Call):
        if isinstance(n.func,ast.Attribute) and n.func.attr=='copy':
            a = rec(n.func.value)
            return {'cpp':a,'java':a+'.clone()', 'python':a+'.copy()', 'ts':a+'.slice()'}[lang]
        name = n.func.id
        args = ', '.join(map(rec,n.args))
        if name=='len':
            return {'cpp':f'static_cast<int>({args}.size())', 'java':args+'.length', 'ts':args+'.length','python':f'len({args})'}[lang]
        if name in ('min','max','abs'):
            pre = {'python':'','cpp':'std::','java':'Math.','ts':'Math.'}[lang]
            return f'{pre}{name}({args})'
        if name=='visit': return f'visit({args})'
    raise ValueError(ast.dump(n))

def vector_value(n):
    return isinstance(n,ast.List) or (isinstance(n,ast.BinOp) and isinstance(n.left,ast.List)) or (isinstance(n,ast.Call) and isinstance(n.func,ast.Attribute))

def compile_body(row, body):
    raw = textwrap.dedent(body).strip().splitlines()
    tree = ast.parse('\n'.join(raw))
    lines = {l:[] for l in LANGS}
    result_vec = isinstance(row.cases[0][2],list)
    C = 'std::vector<int>' if result_vec else 'int'
    J = 'int[]' if result_vec else 'int'
    lines['cpp'] += ['#include <algorithm>', '#include <cstdlib>', '#include <vector>', '', f'{C} solve(const std::vector<int>& values, int target) {{']
    lines['java'] += ['class Solution {',f'  static {J} solve(int[] values, int target) {{']
    lines['python'] += ['def solve(values, target):']
    lines['ts'] += ['(values, target, rt) => {']
    # Initialize locals outside branches so every listing has the same scope.
    locals = {}
    for n in ast.walk(tree):
        if isinstance(n,ast.Assign) and isinstance(n.targets[0],ast.Name):
            name = n.targets[0].id
            locals[name] = locals.get(name,False) or vector_value(n.value)
    for name,vec in locals.items():
        lines['cpp'].append(f'  std::vector<int> {name};' if vec else f'  int {name} = 0;')
        lines['java'].append(f'    int[] {name} = new int[0];' if vec else f'    int {name} = 0;')
        lines['ts'].append(f'  let {name}: number[] = [];' if vec else f'  let {name} = 0;')

    def emit(n,depth):
        src=raw[n.lineno-1]
        ann = src.partition('#')[2].strip()
        watch = []
        board = row.board
        width = None
        if ann:
            parts = [s.strip() for s in ann.split('|')]
            message = parts[0]
            watch = parts[1].split() if len(parts)>1 else []
            if len(parts)>2 and parts[2]: board = parts[2]
            if len(parts)>3: width = parts[3]
        elif isinstance(n,ast.Return):
            message = 'Return the computed result.'
            watch = []
        else: message = ''
        if message:
            idx = [len(lines[l])+1 for l in ('cpp','java','python')]
            names = ', '.join(watch)
            plain = re.sub(r'\{\w+\}', 'the current value',message)
            msg = re.sub(r'\{(\w+)\}',r'${\1}',message)
            title = plain.partition('.')[0]
            if len(title)>50: title = 'Inspect the current state'
            snippet = f'rt.step({JS(title)}, `{msg}`, {idx}, {{{names}}}, {board}'+ (', '+width if width else '')+');'
            lines['ts'].append('  '*depth+snippet)
        for lang in LANGS:
            e = lambda x: expr(x,lang)
            py = lang=='python'
            end = '' if py else ';'
            if isinstance(n, ast.Assign):
                t=n.targets[0]
                if isinstance(t,ast.Subscript) and lang=='ts': code=f'rt.write({e(t.value)}, {e(t.slice)}, {e(n.value)})'
                else: code = e(t)+' = '+e(n.value)
                code += end
            elif isinstance(n,ast.Expr) and isinstance(n.value,ast.Call) and n.value.func.id=='swap':
                a,i,j = [e(x) for x in n.value.args]
                code = {'cpp':f'std::swap({a}[{i}], {a}[{j}]);','python':f'{a}[{i}], {a}[{j}] = {a}[{j}], {a}[{i}]','ts':f'rt.swap({a}, {i}, {j});','java':f'{{ int saved = {a}[{i}]; {a}[{i}] = {a}[{j}]; {a}[{j}] = saved; }}'}[lang]
            elif isinstance(n,(ast.If,ast.While)):
                kw = 'while' if isinstance(n,ast.While) else 'if'
                code = f'{kw} {e(n.test)}:' if py else f'{kw} ({e(n.test)}) {{'
            elif isinstance(n,ast.Return): code = 'return '+ e(n.value)+end
            elif isinstance(n,ast.Break): code = 'break'+end
            else: raise ValueError(ast.dump(n))
            indent = ('    ' if py else '  ')*(depth+(1 if lang=='java' else 0))
            lines[lang].append(indent+code)
        if isinstance(n,(ast.If,ast.While)):
            for s in n.body: emit(s,depth+1)
            if n.orelse:
                for lang in LANGS:
                    dep=depth+(1 if lang=='java' else 0)
                    lines[lang].append(('    ' if lang=='python' else '  ')*dep+('else:' if lang=='python' else '} else {'))
                for s in n.orelse: emit(s,depth+1)
            for lang in ('ts','cpp','java'):
                lines[lang].append('  '*(depth+(1 if lang=='java' else 0))+'}')
    for s in tree.body: emit(s,1)
    for l in ('ts','java','cpp'): lines[l].append('  }' if l=='java' else '}')
    lines['java'].append('}')
    return {l:'\n'.join(v) for l,v in lines.items()}

RULES = {
    'positive-target':'Target must be a positive integer.', 'sorted':'Values must be in nondecreasing order.', 'positive':'Each value must be positive.',
    'nonnegative':'Each value must be nonnegative.', 'letters':'Use lowercase letters encoded as 0 (a) through 25 (z).',
    'bits':'Values must be 0 or 1.', 'window':'Target is a window size from 1 through the array length.',
    'graph':'Use a square, flattened row-major adjacency matrix of zeros and ones, with a valid starting vertex as target.',
    'grid':'Target is the number of columns. Values must fill a nonempty rectangle.',
    'nonempty':'Supply at least one value.', 'target-size':'Target must be a valid zero-based index.',
    'digit':'Values must be digits between 0 and 9.', 'small-target':'Target must be between 0 and 20.',
    'factorial':'Target must be between 0 and 10.', 'one-based':'Use distinct values from 0 through n inclusive.',
    'odd-pairs':'Exactly one value occurs once and every other value occurs twice.',
    'no-negative-target':'Target must be nonnegative.', 'pair-budget':'Target must be between 0 and 100.',
    'binary-tree-index':'Target must be a valid node index in the complete level-order tree.',
    'paren':'Use 1 for an opening parenthesis and -1 for a closing parenthesis.'
}

def generate():
    out = ROOT/'generated'
    out.mkdir(exist_ok=True)
    problems=[]; runners_by_topic={}; configs={}
    for row in records:
        cases=[dict(label=('Worked example' if i==0 else 'Edge case '+str(i)),input=dict(values=v,target=t),expected=r) for i,(v,t,r) in enumerate(row.cases)]
        approaches=[]
        for aid,title,idea,time,space,body in [('optimal','Guided solution',row.intuition,row.time,row.space,row.body), *row.alternatives]:
            code = compile_body(row,body)
            runners_by_topic.setdefault(row.topic,[]).append((row.slug+'/'+aid, code.pop('ts')))
            approaches.append(dict(id=aid,title=title,intuition=idea,time=time,space=space,code=code))
        problems.append(dict(slug=row.slug,title=row.title,topicId=row.topic,patternIds=[row.pattern],difficulty=row.difficulty,
            description=row.description,constraints=[RULES[k] for k in row.rules.split()]+['Use at most 32 integers. Each numeric input is between -1000 and 1000.'],
            analogy=row.analogy,hints=[row.analogy,row.intuition,'Step through the worked example and inspect the highlighted variables before each update.'],
            mistake=row.mistake,followUp=row.follow,approaches=approaches,cases=cases))
        configs[row.slug]=dict(shape=row.shape,rules=row.rules.split(),pointers=row.pointers.split())
    header='// Generated from the reviewed Python kernels in ../authoring.\n'
    for topic,entries in runners_by_topic.items():
        text='\n\n'.join('  '+JS(key)+': '+body.replace('\n','\n  ')+',' for key,body in entries)
        (out/(topic+'.ts')).write_text(header+'import type { Runner } from "../model";\nexport const runners: Record<string, Runner> = {\n'+text+'\n};\n',encoding='utf8')
    imports='\n'.join(f'import {{ runners as r{i} }} from "./{key}";' for i,key in enumerate(runners_by_topic))
    (out/'runners.ts').write_text(header+imports+'\nexport const runners = {'+', '.join('...r'+str(i) for i in range(len(runners_by_topic)))+'};\n',encoding='utf8')
    (out/'problems.json').write_text(json.dumps(problems,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
    (out/'config.json').write_text(json.dumps(configs,indent=2)+'\n',encoding='utf8')
if __name__=='__main__': generate()


