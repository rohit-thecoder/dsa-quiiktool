export interface CheatSheet {
  slug: string; title: string; summary: string; topic: string;
  rows: [string, string, string][]; code: Record<'cpp'|'java'|'python', string>;
}
function sheet(topic: string, title: string, summary: string, rows: CheatSheet['rows'],
  python: string, cpp: string, java: string): CheatSheet {
  return {slug:topic,title,summary,topic,rows,code:{python,cpp,java}};
}
export const cheatSheets = [
  sheet('fundamentals','Big O and operation counts','Count inner work before simplifying the expression. These examples count all unordered index pairs.',
    [['Scan','Θ(n)','One item per iteration'],['Halving','Θ(log n)','Remaining work drops by a constant factor'],['All pairs','Θ(n²)','n(n−1)/2 distinct index pairs'],['Balanced merge sort','Θ(n log n)','Linear merge work over logarithmically many levels']],
    `def pair_count(n):
    count = 0
    for i in range(n):
        for j in range(i + 1, n):
            count += 1
    return count`,
    `long long pairCount(int n) {
  long long count = 0;
  for (int i = 0; i < n; ++i)
    for (int j = i + 1; j < n; ++j) ++count;
  return count;
}`,
    `static long pairCount(int n) {
  long count = 0;
  for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++) count++;
  return count;
}`),
  sheet('arrays-and-hashing','Prefix tables and hashing','A leading zero lets one subtraction recover any half-open range sum. C++ uses the vector header for this snippet.',
    [['Index read','O(1)','Check that the index is in bounds'],['Range sum after preprocessing','O(1)','P[r] − P[l]'],['Build prefix sums','O(n)','Store n + 1 entries'],['Frequency table','Expected O(n) build','Store one key per distinct value']],
    `def prefix(a):
    p = [0]
    for x in a:
        p.append(p[-1] + x)
    return p`,
    `std::vector<long long> prefix(const std::vector<int>& a) {
  std::vector<long long> p{0};
  for (int x : a) p.push_back(p.back() + x);
  return p;
}`,
    `static long[] prefix(int[] a) {
  long[] p = new long[a.length + 1];
  for (int i = 0; i < a.length; i++)
    p[i + 1] = p[i] + a[i];
  return p;
}`),
  sheet('sorting','Sorting comparison','Worst-case time and typical auxiliary memory for array implementations. The code inserts each item into its sorted prefix.',
    [['Bubble / insertion','O(n²) time, O(1) space','Can be stable with strict swaps or shifts'],['Selection','O(n²) time, O(1) space','Ordinary selection by swapping is unstable'],['Merge','O(n log n) time, O(n) space','Can be stable'],['Heap','O(n log n) time, O(1) space','Ordinary in-place heap sort is unstable'],['Quick','O(n²) worst, expected O(n log n) with random pivot','Ordinary partition is unstable'],['Counting','O(n + k) time','Needs a bounded key range k']],
    `def insertion_sort(a):
    for i in range(1, len(a)):
        x, j = a[i], i
        while j and a[j-1] > x:
            a[j] = a[j-1]
            j -= 1
        a[j] = x`,
    `void insertionSort(std::vector<int>& a) {
  for (int i = 1; i < (int)a.size(); ++i) {
    int x = a[i], j = i;
    while (j && a[j-1] > x) { a[j] = a[j-1]; --j; }
    a[j] = x;
  }
}`,
    `static void insertionSort(int[] a) {
  for (int i = 1; i < a.length; i++) {
    int x = a[i], j = i;
    while (j > 0 && a[j-1] > x) { a[j] = a[j-1]; j--; }
    a[j] = x;
  }
}`),
  sheet('strings','String scans','These palindrome examples compare literal ASCII characters. Normalize first only when the task defines a normalization rule.',
    [['Palindrome','O(n) time','Opposing endpoints'],['Anagram count','O(n + m) expected time','Compare counts and lengths'],['Common prefix','O(total characters) upper bound','Stop at first mismatch'],['KMP search','O(n + m) time','m-entry prefix table for the pattern']],
    `def palindrome(s):
    i, j = 0, len(s) - 1
    while i < j:
        if s[i] != s[j]: return False
        i, j = i + 1, j - 1
    return True`,
    `bool palindrome(const std::string& s) {
  for (size_t i = 0; i < s.size()/2; ++i)
    if (s[i] != s[s.size()-1-i]) return false;
  return true;
}`,
    `static boolean palindrome(String s) {
  for (int i = 0; i < s.length()/2; i++)
    if (s.charAt(i) != s.charAt(s.length()-1-i)) return false;
  return true;
}`),
  sheet('two-pointers','Two-pointer invariants','On a sorted sequence, the smallest remaining item cannot participate when even its largest partner makes the sum too small.',
    [['Sum too small','Move left forward','Every other partner is smaller'],['Sum too large','Move right backward','Every other partner is larger'],['Pointers meet','No unused pair','Two distinct positions are required']],
    `def has_pair(a, target):
    l, r = 0, len(a) - 1
    while l < r:
        s = a[l] + a[r]
        if s == target: return True
        if s < target: l += 1
        else: r -= 1
    return False`,
    `bool hasPair(const std::vector<int>& a, long long t) {
  int l = 0, r = (int)a.size()-1;
  while (l < r) {
    long long s = (long long)a[l] + a[r];
    if (s == t) return true;
    if (s < t) ++l; else --r;
  }
  return false;
}`,
    `static boolean hasPair(int[] a, long t) {
  int l = 0, r = a.length-1;
  while (l < r) {
    long s = (long)a[l] + a[r];
    if (s == t) return true;
    if (s < t) l++; else r--;
  }
  return false;
}`),
  sheet('sliding-window','Sliding window templates','For these maximum-sum examples require 1 ≤ k ≤ length. Initialize the best from a complete window to handle all-negative values.',
    [['Fixed width','Subtract the exiting value','Add the entering value'],['Variable width','Track a validity rule','Restore it by shrinking when justified'],['Half-open window [l,r)','Length r − l','Inclusive [l,r] instead has length r − l + 1']],
    `def best_window(a, k):
    total = best = sum(a[:k])
    for i in range(k, len(a)):
        total += a[i] - a[i-k]
        best = max(best, total)
    return best`,
    `long long bestWindow(const std::vector<int>& a, int k) {
  long long sum = 0;
  for (int i = 0; i < k; ++i) sum += a[i];
  long long best = sum;
  for (int i = k; i < (int)a.size(); ++i) {
    sum += (long long)a[i] - a[i-k]; best = std::max(best, sum);
  }
  return best;
}`,
    `static long bestWindow(int[] a, int k) {
  long sum = 0;
  for (int i = 0; i < k; i++) sum += a[i];
  long best = sum;
  for (int i = k; i < a.length; i++) {
    sum += (long)a[i] - a[i-k]; best = Math.max(best, sum);
  }
  return best;
}`),
  sheet('binary-search','Binary search boundaries','Find the first value at least x. The return value may equal n, indicating the insertion point after the final value.',
    [['Candidate range','[lo, hi)','Index hi is exclusive'],['a[mid] < x','lo = mid + 1','Discard the entire left prefix'],['a[mid] ≥ x','hi = mid','Keep mid as a potential boundary'],['Termination','lo == hi','The boundary has been located']],
    `def lower_bound(a, x):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = lo + (hi-lo)//2
        if a[mid] < x: lo = mid+1
        else: hi = mid
    return lo`,
    `int lowerBound(const std::vector<int>& a, int x) {
  int lo = 0, hi = (int)a.size();
  while (lo < hi) {
    int mid = lo + (hi-lo)/2;
    if (a[mid] < x) lo = mid+1; else hi = mid;
  }
  return lo;
}`,
    `static int lowerBound(int[] a, int x) {
  int lo = 0, hi = a.length;
  while (lo < hi) {
    int mid = lo + (hi-lo)/2;
    if (a[mid] < x) lo = mid+1; else hi = mid;
  }
  return lo;
}`),
  sheet('linked-lists','Linked list operations','Reversal assumes a finite singly linked chain whose nodes have a next field. Return the new head.',
    [['Lookup by position','O(n)','Follow next references'],['Insert after known node','O(1)','Save the successor before splicing'],['Reverse iteratively','O(n) time, O(1) space','Move one node between two chains per step']],
    `def reverse(head):
    prev = None
    while head:
        nxt = head.next
        head.next = prev
        prev, head = head, nxt
    return prev`,
    `Node* reverse(Node* head) {
  Node* prev = nullptr;
  while (head) {
    Node* next = head->next;
    head->next = prev; prev = head; head = next;
  }
  return prev;
}`,
    `static Node reverse(Node head) {
  Node prev = null;
  while (head != null) {
    Node next = head.next;
    head.next = prev; prev = head; head = next;
  }
  return prev;
}`),
  sheet('stacks-and-queues','Stack and queue operations','Library examples place two values into a FIFO queue and remove the older value.',
    [['Stack push / pop','One active end','Use for nested or deferred work'],['Queue enqueue / dequeue','Opposite ends','Use for layer-by-layer exploration'],['Deque','Both ends','Can retain useful extremum candidates'],['Ring buffer','Advance index modulo capacity','Track size or reserve a slot to distinguish full and empty']],
    `from collections import deque
q = deque()
q.append(3)
q.append(9)
first = q.popleft()  # 3`,
    `#include <queue>
int firstInLine() {
  std::queue<int> q;
  q.push(3); q.push(9);
  int first = q.front(); q.pop(); return first;
}`,
    `static int firstInLine() {
  java.util.ArrayDeque<Integer> q = new java.util.ArrayDeque<>();
  q.addLast(3); q.addLast(9);
  return q.removeFirst();
}`),
  sheet('recursion-and-backtracking','Recursive frames','Each descent owns its arguments. Each return supplies the missing operand in its caller. For the fixed-width snippets use 0 ≤ n ≤ 20.',
    [['Base case','Known direct answer','0! = 1'],['Progress measure','Strictly decreases','n becomes n − 1'],['Auxiliary space','Maximum live frames','Factorial uses O(n) call stack'],['Backtracking','Undo shared mutation','Restore the path before its sibling branch']],
    `def factorial(n):
    if n == 0: return 1
    return n * factorial(n-1)`,
    `long long factorial(int n) {
  if (n == 0) return 1;
  return n * factorial(n-1);
}`,
    `static long factorial(int n) {
  if (n == 0) return 1L;
  return n * factorial(n-1);
}`),
  sheet('trees','Tree traversal order','These preorder snippets use a binary Node with value, left and right fields. Visit the root before its two subtrees.',
    [['Preorder','Root, left, right','Write a parent before descendants'],['Inorder','Left, root, right','Read a valid BST in sorted order'],['Postorder','Left, right, root','Combine completed child results'],['Level order','Queue by depth','Process a whole distance layer']],
    `def preorder(node, out):
    if node is None: return
    out.append(node.value)
    preorder(node.left, out)
    preorder(node.right, out)`,
    `void preorder(Node* n, std::vector<int>& out) {
  if (!n) return;
  out.push_back(n->value);
  preorder(n->left, out); preorder(n->right, out);
}`,
    `static void preorder(Node n, java.util.List<Integer> out) {
  if (n == null) return;
  out.add(n.value);
  preorder(n.left, out); preorder(n.right, out);
}`),
  sheet('heaps','Heap indices and order','In a zero-indexed max heap the parent value is at least each child value. Equal keys are permitted.',
    [['Parent of i > 0','(i − 1) div 2','Integer division'],['Children of i','2i + 1 and 2i + 2','Check against array length'],['Peak priority','O(1)','Read the root'],['Insert or extract','O(log n)','Repair one path']],
    `def is_max_heap(a):
    return all(a[(i-1)//2] >= a[i] for i in range(1, len(a)))`,
    `bool isMaxHeap(const std::vector<int>& a) {
  for (size_t i = 1; i < a.size(); ++i)
    if (a[(i-1)/2] < a[i]) return false;
  return true;
}`,
    `static boolean isMaxHeap(int[] a) {
  for (int i = 1; i < a.length; i++)
    if (a[(i-1)/2] < a[i]) return false;
  return true;
}`),
  sheet('graphs','Graph algorithms','Reachability examples use adjacency lists indexed 0 through V−1 and a valid starting vertex s. Mark before enqueuing.',
    [['BFS or DFS','O(V + E)','Adjacency lists; start additional searches for other components'],['Dijkstra','Nonnegative edge weights','Use a min-priority queue'],['Bellman–Ford','O(VE)','Can detect reachable negative cycles'],['Kruskal','O(E log E)','Sort edges and skip edges joining the same component']],
    `from collections import deque
def reachable(adj, s):
    seen, q = {s}, deque([s])
    while q:
        for v in adj[q.popleft()]:
            if v not in seen:
                seen.add(v)
                q.append(v)
    return seen`,
    `std::vector<bool> reachable(const std::vector<std::vector<int>>& adj, int s) {
  std::vector<bool> seen(adj.size()); std::queue<int> q;
  q.push(s); seen[s] = true;
  while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : adj[u]) if (!seen[v]) { seen[v] = true; q.push(v); }
  }
  return seen;
}`,
    `static boolean[] reachable(int[][] adj, int s) {
  boolean[] seen = new boolean[adj.length];
  java.util.ArrayDeque<Integer> q = new java.util.ArrayDeque<>();
  q.add(s); seen[s] = true;
  while (!q.isEmpty()) {
    for (int v : adj[q.remove()]) if (!seen[v]) { seen[v] = true; q.add(v); }
  }
  return seen;
}`),
  sheet('dynamic-programming','Dynamic programming states','Count ways of climbing n stairs with jumps of one or two. One empty route reaches stair zero. For signed 64-bit answers use 0 ≤ n ≤ 91.',
    [['State','ways[i]','Count routes ending exactly on stair i'],['Base','ways[0] = ways[1] = 1','The empty route and one single jump'],['Transition','ways[i−1] + ways[i−2]','Last choices are disjoint'],['Storage','Two preceding states','O(n) time, O(1) auxiliary words']],
    `def stairs(n):
    a, b = 1, 1
    for i in range(2, n+1):
        a, b = b, a+b
    return b`,
    `long long stairs(int n) {
  long long a = 1, b = 1;
  for (int i = 2; i <= n; ++i) {
    long long next = a+b; a = b; b = next;
  }
  return b;
}`,
    `static long stairs(int n) {
  long a = 1, b = 1;
  for (int i = 2; i <= n; i++) {
    long next = a+b; a = b; b = next;
  }
  return b;
}`),
  sheet('greedy-and-intervals','Greedy interval selection','Count the maximum compatible half-open talks [start, finish), with positive duration and endpoints representable as 32-bit integers.',
    [['Maximize count','Sort by finish','Accept when start ≥ previous finish'],['Merge ranges','Sort by start','Carry the farthest end of the current group'],['Different rewards','Weighted scheduling','Earliest finish alone can lose total reward']],
    `def max_talks(talks):
    end, count = float('-inf'), 0
    for start, finish in sorted(talks, key=lambda t: t[1]):
        if start >= end:
            end, count = finish, count+1
    return count`,
    `int maxTalks(std::vector<std::pair<int,int>> talks) {
  std::sort(talks.begin(), talks.end(), [](auto a, auto b) {return a.second < b.second;});
  long long end = LLONG_MIN; int count = 0;
  for (auto [s,f] : talks) if (s >= end) { end = f; ++count; }
  return count;
}`,
    `static int maxTalks(int[][] talks) {
  java.util.Arrays.sort(talks, (a,b) -> Integer.compare(a[1],b[1]));
  long end = Long.MIN_VALUE; int count = 0;
  for (int[] t : talks) if (t[0] >= end) { end = t[1]; count++; }
  return count;
}`),
  sheet('bit-manipulation','Bit manipulation formulas','For nonnegative 32-bit inputs, clear the lowest set bit once per loop iteration.',
    [['Test bit k','(x >> k) & 1','Use a valid shift count'],['Toggle bit k','x XOR (1 << k)','Each toggle reverses that bit'],['Clear lowest one','x & (x−1)','Works for positive x'],['Power of two','x > 0 and (x & (x−1)) == 0','Zero is excluded']],
    `def count_ones(x):
    count = 0
    while x:
        x &= x-1
        count += 1
    return count`,
    `int countOnes(unsigned x) {
  int count = 0;
  while (x) { x &= x-1; ++count; }
  return count;
}`,
    `static int countOnes(int x) {
  int count = 0;
  while (x != 0) { x &= x-1; count++; }
  return count;
}`)
];
