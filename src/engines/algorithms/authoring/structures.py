from catalog import add

add('binary-search','Binary Search','binary-search','binary-search',
    'Find the target in a sorted array. Return any matching zero-based index, or -1.',
    'Check the midpoint of the inclusive range. Sorted order tells you which half cannot contain the target.',
    'A librarian opens the middle of a sorted catalogue and closes an entire half after each comparison.',
    'Updating a boundary to mid instead of moving past it can repeat the same interval forever.',
    'How would the boundaries change if you needed the first match?', 'O(log n)','O(1)',
    [([2,5,8,12,16,23,38,56,72],23,5),([],3,-1),([2],3,-1),([4],4,0)],"""
left = 0
right = len(values) - 1
while left <= right:
    mid = left + (right - left) // 2
    if values[mid] == target: # Inspect midpoint {mid} within the remaining bounds. | left mid right target
        return mid
    if values[mid] < target: # Determine which half can still contain {target}. | left mid right target
        left = mid + 1
    else:
        right = mid - 1
return -1
""",rules='sorted')

for slug,title,upper,find in [
    ('search-insert-position','Search Insert Position',False,False),
    ('first-occurrence','First Occurrence',False,True),
    ('last-occurrence','Last Occurrence',True,True)]:
    direction = '<=' if upper else '<'
    end = ('candidate = left - 1\nif candidate >= 0 and values[candidate] == target:\n    return candidate\nreturn -1' if upper else
           'if left < len(values) and values[left] == target:\n    return left\nreturn -1' if find else 'return left')
    desc = ('Return the last matching position in sorted order, or -1.' if upper else
            'Return the first matching position in sorted order, or -1.' if find else
            'Find the first position at which the target can be inserted before any equal values while preserving order.')
    add(slug,title,'binary-search','boundary-search',desc,
        'Maintain a half-open range. Every item removed on the left is on the known lower side of the boundary.',
        'Locate the dividing line between two adjacent seating sections; the first seat of one ends the other.',
        'Stopping at the first equality can land in the middle of duplicate values.',
        'Which inequality moves the boundary beyond every duplicate?', 'O(log n)','O(1)',
        [([1,3,3,3,7],3,3 if upper else 1),([],5,-1 if find else 0),([1,2],4,-1 if find else 2)],
        f"""left = 0
right = len(values)
while left < right:
    mid = left + (right - left) // 2
    if values[mid] {direction} target: # Check which side of the boundary contains the midpoint. | left mid right target
        left = mid + 1
    else:
        right = mid
{end}
""",rules='sorted')

add('integer-square-root','Integer Square Root','binary-search','search-on-answer',
    'Return the greatest integer whose square is at most the nonnegative target. The values list is unused.',
    'Square a candidate root; a square within budget makes every smaller root feasible too.',
    'Find the widest square tiled floor you can cover with a fixed number of tiles.',
    'Exact equality is unnecessary for numbers between consecutive squares.', 'How would you avoid overflow for very large integer targets?',
    'O(log(t + 2))','O(1)',[([],38,6),([],0,0),([],1,1)],"""
low = 0
high = target
best = 0
while low <= high:
    mid = low + (high - low) // 2
    if mid * mid <= target: # Test candidate root {mid} against the tile budget. | low mid high target best
        best = mid
        low = mid + 1
    else:
        high = mid - 1
return best
""",rules='no-negative-target',pointers='')

add('reverse-linked-list','Reverse Linked List','linked-lists','pointer-rewiring',
    'Construct nodes in input order, reverse their next links and return values encountered from the new head.',
    'Save the next link before pointing the current node back to the previous one.',
    'Turn one-way direction signs around while retaining a note of the original next stop.',
    'Rewiring before saving the old link loses the rest of the list.', 'How would you reverse a sublist between two positions?',
    'O(n)','O(n) node model and returned array, O(1) reversal workspace',[([4,7,2,9],0,[9,2,7,4]),([],0,[]),([8],0,[8])],"""
links = [0] * len(values)
i = 0
while i < len(values):
    links[i] = i + 1
    i = i + 1
if len(values) > 0:
    links[len(values) - 1] = -1
prev = -1
cur = 0
if len(values) == 0:
    cur = -1
while cur != -1:
    nxt = links[cur] # Save the original successor of node {cur}. | prev cur links
    links[cur] = prev # Redirect node {cur} toward its predecessor. | prev cur nxt links
    prev = cur
    cur = nxt
out = [0] * len(values)
i = 0
while prev != -1:
    out[i] = values[prev] # Read from the reversed chain. | prev links
    prev = links[prev]
    i = i + 1
return out # Return the reversed node values. | links out
""",shape='linked',pointers='cur prev nxt')

add('middle-of-the-linked-list','Middle of the Linked List','linked-lists','fast-slow-pointers',
    'Return the index of the middle node of the input-order list. For even lengths return the second middle. Return -1 when empty.',
    'Advance one cursor by two links for every one-link move of the other.', 'A runner travelling twice as fast reaches the finish when a walker reaches halfway.',
    'Stopping the fast runner one move too early picks the first middle for even lengths.', 'How would the fast pointer reveal a cycle?',
    'O(n)','O(1)',[([7,1,9,5],0,2),([],0,-1),([2],0,0)],"""
if len(values) == 0:
    return -1
slow = 0
fast = 0
while fast + 1 < len(values):
    slow = slow + 1 # Move the slow cursor once for each two-node fast advance. | slow fast
    fast = fast + 2
return slow # The slow pointer identifies the second middle for even lengths. | slow fast
""",shape='linked',pointers='slow fast')

add('valid-parentheses','Balanced Parentheses','stacks-and-queues','matching-stack',
    'Return 1 if the sequence of opening and closing parentheses is balanced, otherwise 0. Encode ( as 1 and ) as -1.',
    'A closing symbol must consume an available opening symbol. All openings must be consumed at the end.',
    'Each opening ticket reserves one return visit. A return without a ticket is invalid.',
    'A final balance of zero alone cannot rule out an invalid closing prefix.', 'How would several types of bracket change your state?',
    'O(n)','O(n) explicit teaching stack',[([1,1,-1,-1],0,1),([-1,1],0,0),([],0,1),([1],0,0)],"""
stack = [0] * len(values)
top = 0
i = 0
while i < len(values):
    if values[i] == 1: # Read the next bracket with {top} unmatched openings. | i top stack
        stack[top] = i
        top = top + 1
    else:
        if top == 0:
            return 0 # This closing symbol has no opening partner. | i top stack
        top = top - 1
    i = i + 1
if top == 0:
    return 1 # All opening symbols have partners. | top stack
return 0 # Unmatched opening symbols remain. | top stack
""",shape='stack',rules='paren',pointers='i')

for slug,title,dist in [('next-greater-element','Next Greater Value',False),('daily-temperatures','Daily Temperatures',True)]:
    initial = '0' if dist else '-1'
    assign = 'i - old' if dist else 'values[i]'
    desc = ('Return the distance to the next strictly warmer day for each position. Return zero if it never becomes warmer.' if dist else
            'For each position, find the first strictly larger value to its right. Use -1 where no such position exists.')
    add(slug,title,'stacks-and-queues','monotonic-stack',desc,
        'Store unresolved indices in a decreasing stack. A new larger value answers every smaller item on top.',
        'A new taller spectator becomes the first taller neighbour visible to a stack of shorter spectators.',
        'Popping on equality treats an equal value as a strict improvement.',
        'How many times can any index be pushed or popped?', 'O(n)','O(n)',
        [([5,3,4,7],0,([3,1,1,0] if dist else [7,4,7,-1])),([],0,[]),([2,2],0,([0,0] if dist else [-1,-1]))],
        f"""out = [0] * len(values)
stack = [0] * len(values)
top = 0
i = 0
while i < len(values):
    out[i] = {initial}
    while top > 0 and values[stack[top - 1]] < values[i]:
        top = top - 1 # Pop a smaller unresolved position. | i top stack out
        old = stack[top]
        out[old] = {assign}
    stack[top] = i # Push this position until a larger value arrives. | i top stack out
    top = top + 1
    i = i + 1
return out # Read the resolved answers in input order. | top stack out
""",shape='stack',difficulty='medium')

add('factorial','Factorial with Stack Frames','recursion-and-backtracking','recursion',
    'Compute target factorial by recording pending factors, then unwinding from the base case. The values list is unused.',
    'Replace each factorial call with a pending multiplication. Begin returning at zero factorial, whose value is one.',
    'Leave one signed order slip at every desk, then collect the answers in reverse desk order.',
    'An empty product equals one, including zero factorial.', 'How does a direct recursive function store the same pending work?',
    'O(t)','O(t)',[([],5,120),([],0,1),([],1,1)],"""
stack = [0] * target
top = 0
n = target
while n > 0:
    stack[top] = n # Push a pending factorial argument. | n top stack
    top = top + 1
    n = n - 1
result = 1
while top > 0:
    top = top - 1 # Unwind one pending multiplication. | top stack result
    result = result * stack[top]
return result # Every deferred multiplication has returned. | result top stack
""",shape='stack',rules='factorial',pointers='')

add('preorder-traversal','Preorder Traversal','trees','tree-traversal',
    'Visit a complete binary tree in root-left-right order and return its values. The input holds level-order values with no missing nodes.',
    'A stack drives traversal. Push the right child first so the left child is popped first.',
    'When two rooms branch off, put the later room on the to-do pile before the room to visit now.',
    'Pushing the left child first reverses the intended visit order.', 'How could a null marker represent sparse trees?',
    'O(n)','O(n) allocated stack and output',[([8,4,9,1,6],0,[8,4,1,6,9]),([],0,[]),([7],0,[7])],"""
stack = [0] * len(values)
out = [0] * len(values)
if len(values) == 0:
    return out
top = 1
stack[0] = 0
count = 0
while top > 0:
    top = top - 1
    node = stack[top]
    out[count] = values[node] # Visit the root of the pending subtree. | node count
    count = count + 1
    right = node * 2 + 2
    left = node * 2 + 1
    if right < len(values):
        stack[top] = right
        top = top + 1
    if left < len(values):
        stack[top] = left
        top = top + 1
return out
""",shape='tree',pointers='node')

add('maximum-depth-of-binary-tree','Depth of a Complete Binary Tree','trees','tree-traversal',
    'Return the maximum number of nodes along a root-to-leaf path in a complete binary tree encoded in level order.',
    'In a complete tree the leftmost path reaches the deepest occupied level.', 'On a full row of seats filled left to right, the left aisle reaches every occupied row.',
    'Following only left links would be incorrect for a general sparse tree.', 'Which traversal would compute depth in a sparse tree?',
    'O(log(n + 1))','O(1)',[([8,4,9,1,6],0,3),([],0,0),([7],0,1)],"""
node = 0
depth = 0
while node < len(values):
    depth = depth + 1 # Count the level at node {node}. | node depth
    node = node * 2 + 1
return depth
""",shape='tree',pointers='node')

add('is-max-heap','Check a Max Heap','heaps','heap',
    'Return 1 if each parent in the complete level-order tree is at least as large as each child, otherwise 0.',
    'Every non-root entry has exactly one parent; verify one relation per child.', 'A tournament ranking tree places each winner above both children.',
    'A heap is only locally ordered. Siblings can be in either order.', 'How can a heap expose the maximum in constant time?',
    'O(n)','O(1)',[([9,5,8,2,3],0,1),([1,3],0,0),([],0,1)],"""
child = 1
while child < len(values):
    parent = (child - 1) // 2
    if values[parent] < values[child]: # Compare parent {parent} with child {child}. | parent child
        return 0
    child = child + 1
return 1
""",shape='tree',pointers='parent child')

add('heap-sort','Heap Sort','heaps','heap',
    'Return an ascending copy by building a max heap, then moving its maximum to the end of the remaining heap.',
    'Sift each parent down to build the heap. Exchanging the root with the last live cell fixes one final output position.',
    'A tournament repeatedly moves its champion to the winners row and repairs the bracket.',
    'Sifting into the already sorted suffix can destroy final placements.', 'Why does bottom-up heap construction take linear time?',
    'O(n log n)','O(n) returned copy, O(1) auxiliary',[([4,8,1,6,3],0,[1,3,4,6,8]),([],0,[]),([3,3],0,[3,3])],"""
a = values.copy()
size = len(a)
start = size // 2
while start > 0 or size > 1:
    if start > 0:
        start = start - 1
        root = start
    else:
        size = size - 1
        swap(a,0,size) # Place the maximum into the sorted suffix. | size
        root = 0
    while root * 2 + 1 < size:
        child = root * 2 + 1
        if child + 1 < size and a[child] < a[child + 1]:
            child = child + 1
        if a[root] >= a[child]: # Check whether the parent dominates its larger child. | root child size
            break
        swap(a,root,child)
        root = child
return a
""",board='a',shape='tree',pointers='root child',difficulty='medium')

graph_body="""
n = 1
while n * n < len(values):
    n = n + 1
seen = [0] * n
queue = [0] * n
queue[0] = target
seen[target] = 1
head = 0
tail = 1
while head < tail:
    node = queue[head] # Dequeue the next frontier vertex. | head tail seen queue
    head = head + 1
    neighbor = 0
    while neighbor < n:
        if values[node * n + neighbor] == 1 and seen[neighbor] == 0: # Examine a possible outgoing edge. | node neighbor seen
            seen[neighbor] = 1
            queue[tail] = neighbor
            tail = tail + 1
        neighbor = neighbor + 1
"""
for slug,title,count in [('breadth-first-search','Breadth-First Search',False),('count-reachable-nodes','Count Reachable Nodes',True)]:
    end = 'return tail' if count else """out = [0] * tail
i = 0
while i < tail:
    out[i] = queue[i]
    i = i + 1
return out"""
    add(slug,title,'graphs','breadth-first-search',
        ('Count distinct vertices reachable from target, including the start.' if count else 'Return the breadth-first visit order from start vertex target; inspect outgoing neighbours in ascending vertex order.')+
        ' Supply the directed graph as a flattened row-major 0/1 adjacency matrix.',
        'Mark vertices on enqueue so several paths cannot enqueue the same vertex twice.',
        'A message spreads through one circle of neighbours at a time.', 'Waiting until dequeue to mark a vertex can create duplicate frontier entries.',
        'How would an adjacency list change work on a sparse graph?', 'O(V²) for the matrix','O(V)',
        [([0,1,1,0,0,1,0,0,0],0,3 if count else [0,1,2]),([0],0,1 if count else [0]),([0,0,0,0],1,1 if count else [1])],
        graph_body+end,rules='graph',shape='graph',pointers='node neighbor',difficulty='medium')

