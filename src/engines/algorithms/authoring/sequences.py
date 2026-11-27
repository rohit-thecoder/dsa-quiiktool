from catalog import add

add('linear-search','Linear Search','fundamentals','linear-scan',
    'Return the first index holding the target, or -1 when it is absent.',
    'Read each position once, stopping at the first match.', 'Check numbered lockers in order until the label matches.',
    'Stopping one position early misses a match at the very end.', 'Can any algorithm skip positions in an unsorted collection?',
    'O(n)','O(1)',[([8,3,5,3],3,1),([],4,-1),([1],1,0)],"""
i = 0
while i < len(values):
    if values[i] == target: # Inspect position {i} for the target {target}. | i target
        return i
    i = i + 1
return -1
""")

add('count-occurrences','Count Occurrences','fundamentals','linear-scan',
    'Count all positions that contain the target value.', 'Keep a count of matches in the prefix already inspected.',
    'A ticket checker makes one tally mark for each passenger on a list.', 'Finding the first match does not finish the count.',
    'What changes if the input is sorted?', 'O(n)','O(1)',[([4,2,4,4],4,3),([],3,0),([1,1],0,0)],"""
i = 0
count = 0
while i < len(values):
    if values[i] == target: # Test the next value against {target}. The count so far is {count}. | i count target
        count = count + 1
    i = i + 1
return count
""")

pair_brute="""
i = 0
while i < len(values):
    j = i + 1
    while j < len(values):
        if values[i] + values[j] == target: # Check the pair at {i} and {j}. | i j target
            return [i,j]
        j = j + 1
    i = i + 1
return []
"""
add('two-sum','Two Sum','arrays-and-hashing','complement-lookup',
    'Find two distinct positions whose values add to the target. Return the pair with the smallest second index, then smallest first index. Return an empty array if no pair exists.',
    'As each value arrives, look up the earliest position of its complement. Store indices plus one so zero marks an unseen value.',
    'At a ticket booth, remember who can provide the change you will need later.', 'Looking up a complement after recording the current value can reuse the same item.',
    'How would you return all matching index pairs?', 'O(n + U), U = 2001','O(U)',[([4,1,7,2],9,[2,3]),([3,3],6,[0,1]),([],2,[]),([1,4,6,9],10,[1,2])],"""
seen = [0] * 2001
i = 0
while i < len(values):
    need = target - values[i]
    if need >= -1000 and need <= 1000: # Look for the earlier complement {need}. | i need target
        if seen[need + 1000] > 0:
            return [seen[need + 1000] - 1,i]
    if seen[values[i] + 1000] == 0:
        seen[values[i] + 1000] = i + 1
    i = i + 1
return []
""",alternatives=[('brute','Enumerate earlier pairs','For each second index, inspect earlier entries from left to right.','O(n²)','O(1)',"""
j = 1
while j < len(values):
    i = 0
    while i < j:
        if values[i] + values[j] == target: # Compare positions {i} and {j}. | i j target
            return [i,j]
        i = i + 1
    j = j + 1
return []
""")])

add('contains-duplicate','Contains Duplicate','arrays-and-hashing','frequency-counting',
    'Return 1 as soon as an integer occurs a second time, otherwise return 0.', 'Use the bounded value range to keep a presence table.',
    'Cross off a roll number on first attendance. An already crossed number signals a repeat.', 'Negative numbers require an offset before indexing the table.',
    'What structure would support arbitrary strings?', 'O(n + U), U = 2001','O(U)',[([4,-2,1,-2],0,1),([],0,0),([5,6],0,0)],"""
seen = [0] * 2001
i = 0
while i < len(values):
    key = values[i] + 1000
    if seen[key] == 1: # Check whether this value already owns a marked entry. | i key
        return 1
    seen[key] = 1
    i = i + 1
return 0
""")

add('maximum-subarray','Maximum Subarray','arrays-and-hashing','running-optimum',
    'Return the largest sum of a nonempty contiguous segment.', 'The best segment ending here either starts here or extends the previous best ending.',
    'Carry yesterday’s savings forward only when they improve today’s balance.', 'Initializing the answer to zero incorrectly allows an empty segment on all-negative input.',
    'How would you recover both endpoints?', 'O(n)','O(1)',[([-3,4,-1,5,-8],0,8),([-7,-2],0,-2),([0],0,0)],"""
ending = values[0]
best = ending
i = 1
while i < len(values):
    ending = max(values[i], ending + values[i]) # Choose between a fresh start and extending the segment. | i ending best
    best = max(best, ending)
    i = i + 1
return best
""",rules='nonempty',difficulty='medium')

add('best-time-to-buy-and-sell-stock','Best Time to Buy and Sell Stock','arrays-and-hashing','linear-scan',
    'Buy once and sell on a later day. Return the largest profit, or zero if trading cannot help.',
    'Use the lowest earlier price to price a sale today.', 'A shopkeeper compares today’s offer with the cheapest purchase already seen.',
    'Subtracting prices from dates in reverse order permits time travel.', 'How does a transaction fee change the calculation?',
    'O(n)','O(1)',[([8,3,6,2,9],0,7),([],0,0),([6,3,1],0,0)],"""
best = 0
low = 1001
i = 0
while i < len(values):
    best = max(best, values[i] - low) # Test today's sale using the lowest earlier price {low}. | i best low
    low = min(low, values[i])
    i = i + 1
return best
""",rules='nonnegative')

add('running-sum','Running Sum','arrays-and-hashing','prefix-sum',
    'Produce a new array whose entry at i is the total from index zero through i.',
    'Keep the prefix sum in an accumulator as the input advances.', 'The display at a checkout shows the total after each item.',
    'Resetting the accumulator at each item loses previous contributions.', 'How do two prefix totals answer a range-sum query?',
    'O(n)','O(n) output, O(1) auxiliary',[([3,-2,6,4],0,[3,1,7,11]),([],0,[]),([5],0,[5])],"""
a = values.copy()
total = 0
i = 0
while i < len(a):
    total = total + a[i] # Extend the prefix ending at {i}. | i total
    a[i] = total
    i = i + 1
return a
""",board='a')

add('move-zeroes','Move Zeroes','arrays-and-hashing','two-pointers',
    'Move every zero to the end while preserving the order of nonzero entries. Return the rearranged copy.',
    'Compact nonzero values into the front and fill the remaining positions with zero.', 'Passengers move forward to fill vacant seats without overtaking.',
    'A swap with the last element can reorder the nonzero values.', 'How could you avoid writing cells already in place?',
    'O(n)','O(n) returned copy, O(1) auxiliary',[([0,3,0,-2,5],0,[3,-2,5,0,0]),([0,0],0,[0,0]),([],0,[])],"""
a = values.copy()
write = 0
i = 0
while i < len(a):
    if a[i] != 0: # Decide whether the value at {i} belongs at the write pointer {write}. | i write
        a[write] = a[i]
        write = write + 1
    i = i + 1
while write < len(a):
    a[write] = 0 # Fill the remaining suffix with zeros. | write
    write = write + 1
return a
""",board='a',pointers='i write')

add('selection-sort','Selection Sort','sorting','ordered-prefix',
    'Return the input sorted from smallest to largest by selecting the remaining minimum.',
    'After each pass the prefix is final. Search the unplaced suffix for its smallest value.', 'Select the shortest unlined-up student for each new place.',
    'Swapping immediately whenever a smaller item appears wastes writes.', 'Why can the minimum swap disturb stability?',
    'O(n²)','O(n) returned copy, O(1) auxiliary',[([5,1,4,2],0,[1,2,4,5]),([],0,[]),([3,3],0,[3,3])],"""
a = values.copy()
i = 0
while i + 1 < len(a):
    smallest = i
    j = i + 1
    while j < len(a):
        if a[j] < a[smallest]: # Compare candidate {j} with minimum position {smallest}. | i j smallest
            smallest = j
        j = j + 1
    if smallest != i:
        swap(a,i,smallest) # Place the selected minimum at {i}. | i smallest
    i = i + 1
return a
""",board='a',pointers='i j smallest')

add('bubble-sort','Bubble Sort','sorting','ordered-prefix',
    'Return the ascending sequence by repeatedly fixing inverted neighbouring pairs.',
    'The largest unplaced value reaches the end of each full pass.', 'In a line-up, taller neighbours step back until the tallest reaches the end.',
    'An early-exit flag must be reset at the start of each pass.', 'What input gives this implementation a linear best case?',
    'O(n²) worst, O(n) best','O(n) returned copy, O(1) auxiliary',[([7,2,5,3],0,[2,3,5,7]),([],0,[]),([1,2,2],0,[1,2,2])],"""
a = values.copy()
end = len(a) - 1
while end > 0:
    changed = 0
    i = 0
    while i < end:
        j = i + 1
        if a[i] > a[j]: # Compare neighbouring positions {i} and {j}. | i j end
            swap(a,i,j) # Exchange the inverted neighbours. | i j
            changed = 1
        i = i + 1
    if changed == 0:
        break
    end = end - 1
return a
""",board='a',pointers='i j end')

add('insertion-sort','Insertion Sort','sorting','ordered-prefix',
    'Sort the sequence by inserting each new item into the already ordered prefix.',
    'Save the incoming key before shifting larger entries right.', 'Insert a new playing card into the ordered hand you already hold.',
    'Overwriting the key before saving it silently duplicates another card.', 'Why is insertion sort useful on nearly sorted input?',
    'O(n²) worst, O(n) best','O(n) returned copy, O(1) auxiliary',[([6,2,4,1],0,[1,2,4,6]),([],0,[]),([2,2],0,[2,2])],"""
a = values.copy()
i = 1
while i < len(a):
    key = a[i]
    j = i - 1
    while j >= 0 and a[j] > key:
        a[j + 1] = a[j] # Shift a larger item right to make room for {key}. | i j key
        j = j - 1
    a[j + 1] = key # Insert the saved key in the gap. | i j key
    i = i + 1
return a
""",board='a')

add('merge-sort','Merge Sort','sorting','divide-and-conquer',
    'Sort by merging adjacent ordered runs. Start at width one and double the width after each pass.',
    'Compare the first unused item of each run; only the smaller one can be the next output.',
    'Two sorted queues send their lowest ticket number to a shared exit.', 'A partial run near the end still needs copying into the output.',
    'Why does taking the left item on equality preserve stability?', 'O(n log n)','O(n)',[([8,2,7,4,1],0,[1,2,4,7,8]),([],0,[]),([3,1,3],0,[1,3,3])],"""
a = values.copy()
buf = [0] * len(a)
width = 1
while width < len(a):
    start = 0
    while start < len(a):
        mid = min(start + width,len(a))
        end = min(start + width + width,len(a))
        left = start
        right = mid
        out = start
        while out < end:
            if left < mid and (right >= end or a[left] <= a[right]): # Select the smaller head from the two runs of width {width}. | left right out width buf
                buf[out] = a[left]
                left = left + 1
            else:
                buf[out] = a[right]
                right = right + 1
            out = out + 1
        start = end
    a = buf.copy() # The merged buffer becomes the next pass. | width buf
    width = width * 2
return a
""",board='a',difficulty='medium',pointers='left right out')

add('valid-palindrome','Valid Palindrome','strings','two-pointers',
    'Treat the input as a sequence of lowercase letters and return 1 if it reads identically backwards, otherwise 0.',
    'Each outside pair must match before the inner sequence matters.', 'Read a line of letter tiles from both ends toward the centre.',
    'Comparing only one end pair cannot establish that the whole string is a palindrome.', 'How could you ignore spaces and punctuation?',
    'O(n)','O(1)',[([0,1,2,1,0],0,1),([1,0],0,0),([],0,1)],"""
left = 0
right = len(values) - 1
while left < right:
    if values[left] != values[right]: # Compare the letters at {left} and {right}. | left right
        return 0
    left = left + 1
    right = right - 1
return 1
""",rules='letters')

add('first-unique-character','First Unique Character','strings','frequency-counting',
    'Return the index of the first lowercase letter appearing exactly once, or -1.',
    'Count every character before deciding which occurrence is unique.', 'After tallying votes, revisit the original queue to find the earliest solo vote.',
    'Iterating the alphabet returns the smallest unique character, which can occur later.', 'What information must a streaming solution retain?',
    'O(n + 26)','O(26)',[([3,1,3,2],0,1),([0,0],0,-1),([],0,-1)],"""
counts = [0] * 26
i = 0
while i < len(values):
    letter = values[i]
    counts[letter] = counts[letter] + 1 # Increase this letter's frequency. | i letter
    i = i + 1
i = 0
while i < len(values):
    if counts[values[i]] == 1: # Test uniqueness in original input order. | i
        return i
    i = i + 1
return -1
""",rules='letters')

add('longest-run','Longest Equal Run','strings','linear-scan',
    'Find the length of the longest uninterrupted run of equal lowercase letters.', 'Only an equal neighbour extends the current run; any change starts length one.',
    'A winning streak ends as soon as the jersey colour changes.', 'Counting all copies combines runs that a different character separates.',
    'How would you return the letter and first position of a longest run?', 'O(n)','O(1)',[([1,1,2,2,2,1],0,3),([],0,0),([4],0,1)],"""
run = 0
best = 0
i = 0
while i < len(values):
    if i > 0 and values[i] == values[i - 1]: # Check whether the character continues the current run of {run}. | i run best
        run = run + 1
    else:
        run = 1
    best = max(run,best)
    i = i + 1
return best
""",rules='letters')

add('two-sum-ii','Two Sum in a Sorted Array','two-pointers','two-pointers',
    'In sorted input return indices of a pair summing to the target, or an empty array. Resolve ties with the earliest left index and latest matching right index.',
    'If the sum is too small, the left item cannot work with any remaining partner. A too-large sum rules out the right item.',
    'Adjust two ends of a balance scale, moving only the side whose change improves the total.', 'Identical values still require two distinct positions.',
    'Why is sorted order essential to this elimination?', 'O(n)','O(1)',[([1,3,4,7,9],10,[0,4]),([3],6,[]),([],2,[])],"""
left = 0
right = len(values) - 1
while left < right:
    total = values[left] + values[right]
    if total == target: # Compare pair sum {total} with {target}. | left right total target
        return [left,right]
    if total < target:
        left = left + 1
    else:
        right = right - 1
return []
""",rules='sorted')

add('remove-duplicates-from-sorted-array','Compress Sorted Values','two-pointers','two-pointers',
    'Return the distinct values of the sorted input in their original order.', 'Count and copy run starts; every different value starts a new run.',
    'A class register needs one entry per group of identical name tags.', 'An empty sequence contains zero distinct values.',
    'How could you compact the original array using a write pointer?', 'O(n)','O(u) output for u distinct values',[([1,1,2,4,4],0,[1,2,4]),([],0,[]),([2,2],0,[2])],"""
count = 0
i = 0
while i < len(values):
    if i == 0 or values[i] != values[i - 1]: # Identify a run start at position {i}. | i count
        count = count + 1
    i = i + 1
out = [0] * count
i = 0
write = 0
while i < len(values):
    if i == 0 or values[i] != values[i - 1]:
        out[write] = values[i] # Copy the first value from this run. | i write out
        write = write + 1
    i = i + 1
return out
""",rules='sorted')

add('container-with-most-water','Container With Most Water','two-pointers','two-pointers',
    'Two vertical walls enclose width times the shorter height. Return the greatest area among all pairs.',
    'Moving the taller wall cannot improve the area while the shorter wall is fixed.', 'A reservoir spills over the lower of its two retaining walls.',
    'Height alone ignores the distance between walls.', 'Does the choice matter when both walls have equal height?',
    'O(n)','O(1)',[([2,8,3,6,5],0,15),([],0,0),([4],0,0)],"""
left = 0
right = len(values) - 1
best = 0
while left < right:
    area = min(values[left],values[right]) * (right - left)
    best = max(area,best) # Compare this container area {area} with the current best. | left right area best
    if values[left] <= values[right]:
        left = left + 1
    else:
        right = right - 1
return best
""",rules='nonnegative',difficulty='medium')

add('reverse-array','Reverse an Array','two-pointers','two-pointers',
    'Return a reversed copy by exchanging symmetric positions.', 'Every successful swap finalizes both ends of the remaining interval.',
    'Two friends rehang a row of photos, swapping the outermost unfinished pair.', 'Swapping across the entire index range undoes earlier exchanges.',
    'How many swaps does a length-n array require?', 'O(n)','O(n) returned copy, O(1) auxiliary',[([3,8,1,5],0,[5,1,8,3]),([],0,[]),([4],0,[4])],"""
a = values.copy()
left = 0
right = len(a) - 1
while left < right:
    swap(a,left,right) # Exchange symmetric positions {left} and {right}. | left right
    left = left + 1
    right = right - 1
return a
""",board='a')

add('maximum-sum-subarray-of-size-k','Maximum Sum Window','sliding-window','fixed-window',
    'Among all consecutive windows containing exactly target items, return the largest sum.', 'When moving one place, remove the outgoing value and add the incoming one.',
    'A camera frame pans across a row; only the two edges change.', 'A best sum of zero fails when every valid window has negative sum.',
    'Could the same update maintain a window minimum?', 'O(n)','O(1)',[([4,-1,3,5,-2],2,8),([-5,-2],1,-2),([2],1,2)],"""
total = 0
right = 0
while right < target:
    total = total + values[right] # Build the first window. | right total target
    right = right + 1
best = total
left = 0
while right < len(values):
    total = total - values[left] + values[right] # Slide one place by replacing the outgoing value. | left right total
    best = max(best,total)
    left = left + 1
    right = right + 1
return best
""",rules='window')

add('minimum-size-subarray-sum','Smallest Qualifying Window','sliding-window','variable-window',
    'Return the shortest contiguous length whose positive values sum to at least the positive target; return zero if impossible.',
    'Expand until a window qualifies, then shrink repeatedly to locate the shortest qualifying suffix.', 'Buy as few adjacent food parcels as possible while reaching a calorie goal.',
    'Negative values would invalidate the monotonic shrinking argument.', 'Why does the inner loop still permit linear total work?',
    'O(n)','O(1)',[([2,3,1,2,4,3],7,2),([],3,0),([1,2],7,0)],"""
left = 0
right = 0
total = 0
best = len(values) + 1
while right < len(values):
    total = total + values[right] # Expand the window at {right}. | left right total
    while total >= target:
        best = min(best,right - left + 1) # A qualifying window can now shrink. | left right total best
        total = total - values[left]
        left = left + 1
    right = right + 1
if best > len(values):
    return 0
return best
""",rules='positive positive-target',difficulty='medium')

add('longest-substring-without-repeating-characters','Longest Distinct Substring','sliding-window','variable-window',
    'Return the greatest length of a contiguous lowercase-letter sequence with no repeated letter.',
    'Use each letter’s previous position to move the left boundary just beyond a conflicting occurrence.',
    'Seat guests in a continuous row while admitting each badge colour only once.', 'The left boundary must never move backwards to a stale occurrence.',
    'What changes for arbitrary Unicode input?', 'O(n + 26)','O(26)',[([0,1,2,0,1,3],0,4),([],0,0),([0,0],0,1)],"""
last = [0] * 26
left = 0
right = 0
best = 0
while right < len(values):
    key = values[right]
    left = max(left,last[key]) # Exclude the previous occurrence when it lies inside this window. | left right key
    best = max(best,right - left + 1)
    last[key] = right + 1
    right = right + 1
return best
""",rules='letters',difficulty='medium')


