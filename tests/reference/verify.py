"""Compile the shipped reference listings and replay the public fixtures."""
import json
import os
import subprocess
import tempfile
from pathlib import Path

catalog = Path(__file__).resolve().parents[2] / 'src/engines/algorithms/generated/problems.json'
problems = json.loads(catalog.read_text(encoding='utf8'))
cpp, java, cpp_checks, java_checks = [], [], [], []
count = 0
for problem in problems:
    for approach in problem['approaches']:
        name = 'A' + str(len(java))
        source = approach['code']
        cpp.append(source['cpp'].replace('solve(', name + '('))
        java.append(source['java'].replace('class Solution', 'class ' + name))
        env = {}
        exec(source['python'], env)
        for case in problem['cases']:
            args = case['input']
            result = case['expected']
            assert env['solve'](args['values'].copy(), args['target']) == result, problem['slug']
            values = '{' + ','.join(map(str,args['values'])) + '}'
            expected = json.dumps(result,separators=(',',':'))
            cpp_checks.append('if (repr('+name+'(std::vector<int>'+values+','+str(args['target'])+')) != '+json.dumps(expected)+') return 1;')
            call = name+'.solve(new int[]'+values+','+str(args['target'])+')'
            expression = 'java.util.Arrays.toString('+call+').replace(" ","")' if isinstance(result,list) else 'String.valueOf('+call+')'
            java_checks.append('if (!('+expression+').equals('+json.dumps(expected)+')) throw new AssertionError("'+name+'");')
            count += 1
print('Python fixture checks',count,flush=True)
with tempfile.TemporaryDirectory(dir=os.environ.get('QUIIKTOOL_TEST_TMP')) as scratch:
    root=Path(scratch)
    cprefix='#include <string>\n#include <vector>\nstd::string repr(int x){return std::to_string(x);} std::string repr(bool x){return x?"true":"false";} std::string repr(const std::vector<int>& v){std::string s="[";for(int x:v){if(s.size()>1)s+=",";s+=repr(x);}return s+"]";}\n'
    (root/'refs.cpp').write_text(cprefix+'\n'.join(cpp)+'\nint main(){\n'+'\n'.join(cpp_checks)+'\n}',encoding='utf8')
    imports=set(line for block in java for line in block.splitlines() if line.startswith('import '))
    java=['\n'.join(line for line in block.splitlines() if not line.startswith('import ')) for block in java]
    (root/'References.java').write_text('\n'.join(sorted(imports))+'\n'+'\n'.join(java)+'\nclass References {public static void main(String[] args){\n'+'\n'.join(java_checks)+'\n}}',encoding='utf8')
    for command in [['javac','References.java'],['java','-cp','.','References'],['g++','-std=c++14','refs.cpp','-o','refs.exe'],[str(root/'refs.exe')]]:
        subprocess.run(command,cwd=root,check=True)
        print('Passed',Path(command[0]).name,flush=True)

