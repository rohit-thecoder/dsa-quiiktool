from catalog import add

add('climbing-stairs','Climbing Stairs','dynamic-programming','dynamic-programming',
    'Count ordered ways to reach target steps using hops of one or two. The values list is unused.',
    'Each route ends with either a one-step or two-step hop. Add the counts at those two predecessor stairs.',
    'Every route to a landing arrives from one of the previous two landings.', 'The starting floor has one empty route, so ways(0) equals one.',
    'What if three-step hops were allowed?', 'O(t)','O(1)',[([],6,13),([],0,1),([],1,1)],"""
prev = 1
curr = 1
i = 2
while i <= target:
    ways = prev + curr # Combine the two predecessor route counts. | i prev curr target
    prev = curr
    curr = ways
    i = i + 1
return curr
""",rules='small-target',pointers='')

add('house-robber','House Robber','dynamic-programming','dynamic-programming',
    'Choose nonadjacent entries of nonnegative value to maximize the total. Return the best sum.',
    'Compare skipping today with taking today plus the best available two positions back.',
    'Pick paid workshops on nonconsecutive days and compare attending today with keeping yesterday’s schedule.',
    'Taking every locally larger value can block a better pair later.', 'How would a circular street change the first and last choices?',
    'O(n)','O(1)',[([4,1,2,7,5],0,11),([],0,0),([3],0,3)],"""
twoBack = 0
best = 0
i = 0
while i < len(values):
    nextBest = max(best,twoBack + values[i]) # Compare skipping this position with taking it. | i twoBack best
    twoBack = best
    best = nextBest
    i = i + 1
return best
""",rules='nonnegative',difficulty='medium')

add('coin-change','Coin Change','dynamic-programming','dynamic-programming',
    'Use unlimited copies of the positive denominations to make target exactly. Return the minimum number of coins, or -1.',
    'For each amount, try each possible last coin and keep the shortest reachable predecessor plus one.',
    'A change counter writes the minimum number of coins on each smaller amount card.', 'Taking the largest coin first can fail for denominations such as 1, 3, 4.',
    'How would you reconstruct the actual chosen coins?', 'O(t × n)','O(t)',
    [([1,3,4],6,2),([4,6],5,-1),([],0,0),([],3,-1)],"""
dp = [0] * (target + 1)
amount = 1
while amount <= target:
    dp[amount] = target + 1
    i = 0
    while i < len(values):
        coin = values[i]
        if coin <= amount:
            dp[amount] = min(dp[amount],dp[amount - coin] + 1) # Try a final coin of {coin} for amount {amount}. | amount i coin
        i = i + 1
    amount = amount + 1
if dp[target] > target:
    return -1
return dp[target]
""",rules='positive pair-budget',board='dp',pointers='amount',difficulty='medium')

add('unique-paths','Unique Paths Around Blocks','dynamic-programming','grid-dp',
    'Count paths from top left to bottom right through a rectangular grid. Move only right or down. A one marks a blocked cell, zero marks an open cell. Target gives column count.',
    'Each open cell can be reached from its upper and left neighbours; add those counts.', 'Count routes between city intersections while avoiding closed streets.',
    'A blocked starting cell must contribute zero ways.', 'How could you keep only one row of counts?',
    'O(rows × columns)','O(rows × columns)',[([0,0,0,0,1,0,0,0,0],3,2),([1],1,0),([0],1,1)],"""
dp = [0] * len(values)
i = 0
while i < len(values):
    if values[i] == 0: # A blocked cell receives no routes. | i
        if i == 0:
            dp[i] = 1
        else:
            if i >= target:
                dp[i] = dp[i - target]
            if i % target > 0:
                dp[i] = dp[i] + dp[i - 1]
    i = i + 1 # The route count for this cell is ready. | i
return dp[len(values) - 1]
""",rules='bits grid',board='dp',shape='grid',difficulty='medium')

add('minimum-path-sum','Minimum Path Sum','dynamic-programming','grid-dp',
    'Travel from the top-left to bottom-right grid cell using right or down moves. The total includes both endpoints. Return the smallest path total. Target gives column count.',
    'Accumulate the cheapest known predecessor at every cell; the first row and column each have only one predecessor.',
    'A courier records the cheapest arrival fare at every junction before moving onward.',
    'The start cell must be counted exactly once.', 'How could a second table recover the chosen route?',
    'O(rows × columns)','O(rows × columns)',[([1,4,1,2,1,3],3,7),([-4],1,-4),([2,3],1,5)],"""
dp = values.copy()
i = 1
while i < len(dp):
    if i < target:
        dp[i] = dp[i] + dp[i - 1] # The first row can only be reached from the left. | i
    else:
        if i % target == 0:
            dp[i] = dp[i] + dp[i - target] # The first column can only be reached from above. | i
        else:
            dp[i] = dp[i] + min(dp[i - target], dp[i - 1]) # Add the cheaper predecessor cost. | i
    i = i + 1
return dp[len(dp) - 1]
""",rules='grid',board='dp',shape='grid',difficulty='medium')

add('jump-game','Jump Game','greedy-and-intervals','greedy',
    'Each entry is the maximum forward jump from that position. Return 1 if the final position is reachable from index zero, otherwise 0.',
    'Keep the furthest position reachable by processing only positions already reachable.', 'A row of relay stations extends a signal only when the signal reaches the station.',
    'Using jump lengths from unreachable positions can create a fictitious route.', 'Why is every index up to the frontier reachable?',
    'O(n)','O(1)',[([2,3,1,1,4],0,1),([1,0,2],0,0),([0],0,1)],"""
reach = 0
i = 0
while i < len(values):
    if i > reach: # Verify that position {i} lies within the frontier {reach}. | i reach
        return 0
    reach = max(reach,i + values[i])
    i = i + 1
return 1
""",rules='nonempty nonnegative',pointers='i reach')

add('minimum-jumps','Minimum Forward Jumps','greedy-and-intervals','greedy',
    'Find the fewest jumps from the first index to the last, or -1 if unreachable. Each number is the maximum jump length from that index.',
    'All positions in a current frontier use the same jump budget. Accumulate the next frontier before spending another jump.',
    'Count bus transfers by expanding all stops available with the same number of tickets.',
    'Incrementing jumps for every position counts alternatives as extra trips.', 'Can you reconstruct an actual shortest sequence of jumps?',
    'O(n)','O(1)',[([2,3,1,1,4],0,2),([0,2],0,-1),([0],0,0)],"""
reach = 0
end = 0
jumps = 0
i = 0
while i < len(values) - 1:
    reach = max(reach,i + values[i])
    if i == end: # Finish the current jump frontier at {end}. | i end reach jumps
        if reach == end:
            return -1
        end = reach
        jumps = jumps + 1
    i = i + 1
return jumps
""",rules='nonempty nonnegative',pointers='i end reach',difficulty='medium')

add('single-number','Single Number','bit-manipulation','xor-cancellation',
    'Every input value occurs twice except one value that occurs once. Return the unpaired value.',
    'Equal numbers cancel under XOR. Rearranging pairs cannot change the result.', 'Paired light switches toggle a lamp twice, restoring its original state.',
    'This cancellation does not isolate a single value when repeated numbers occur three times.', 'How would you isolate two different unpaired numbers?',
    'O(n)','O(1)',[([6,2,6,-3,2],0,-3),([0],0,0),([-1,0,0],0,-1)],"""
result = 0
i = 0
while i < len(values):
    result = result ^ values[i] # Toggle the value at position {i} into the running XOR. | i result
    i = i + 1
return result
""",rules='odd-pairs')

add('missing-number','Missing Number','bit-manipulation','xor-cancellation',
    'The input has distinct values from zero through n inclusive, with one number missing. Identify that number.',
    'XOR every expected number and every supplied number. All values present in both groups cancel.',
    'Pair expected roll-call cards with attended cards; the unmatched card remains.', 'The inclusive upper endpoint n also belongs to the expected set.',
    'Would an arithmetic sum also work for this bounded input?', 'O(n)','O(1)',[([3,0,1],0,2),([],0,0),([0],0,1)],"""
result = len(values)
i = 0
while i < len(values):
    result = result ^ i ^ values[i] # Cancel the expected index and supplied value together. | i result
    i = i + 1
return result
""",rules='one-based')

add('number-of-1-bits','Number of Set Bits','bit-manipulation','bit-masking',
    'Count the set bits in the binary form of nonnegative target. The values list is unused.', 'Masking a positive number with one less clears its lowest set bit.',
    'Remove one lit lamp at a time and count the removals.', 'The routine assumes a nonnegative integer with a finite unsigned representation.',
    'Why does subtracting one change all low bits up to the first one?', 'O(number of set bits)','O(1)',[([],13,3),([],0,0),([],512,1)],"""
bits = target
count = 0
while bits > 0:
    bits = bits & (bits - 1) # Clear the lowest set bit in {bits}. | bits count
    count = count + 1
return count
""",rules='no-negative-target',pointers='')

add('power-of-two','Power of Two','bit-manipulation','bit-masking',
    'Return 1 if target is two raised to a nonnegative integer power and 0 otherwise. The values list is unused.',
    'A positive power of two has exactly one set bit. Clearing that bit produces zero.',
    'A binary shelf label for a power of two lights exactly one switch.', 'Zero also satisfies the mask equality and needs a separate positivity test.',
    'How would you recognize a power of four?', 'O(1) for fixed-width inputs','O(1)',[([],16,1),([],0,0),([],12,0),([],-2,0)],"""
if target <= 0: # Reject a nonpositive target before inspecting bits. | target
    return 0
remaining = target & (target - 1)
if remaining == 0: # Inspect the bits left after clearing the lowest one. | target remaining
    return 1
return 0
""",pointers='')

add('counting-bits','Counting Bits','bit-manipulation','bit-masking',
    'Return the count of set bits for every integer from zero through target. The input values list is unused.',
    'Removing the last binary digit halves the number. Add the discarded low bit to the known count for that smaller number.',
    'Reuse the tally for a shorter string of switches, then inspect just the new switch.',
    'Using the count of i minus one without accounting for carries fails at powers of two.',
    'How would you process a very large target in blocks?', 'O(t)','O(t) output',[([],5,[0,1,1,2,1,2]),([],0,[0]),([],1,[0,1])],"""
dp = [0] * (target + 1)
i = 1
while i <= target:
    dp[i] = dp[i // 2] + (i & 1) # Reuse the shorter prefix and add its final bit. | i
    i = i + 1
return dp
""",rules='pair-budget',board='dp')

