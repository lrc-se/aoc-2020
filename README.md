Advent of Code 2020
===================

This year's puzzles will be solved using Vue 3 and TypeScript, exploring the possibilities and limitations of both.
The application structure is somewhat artificial since there is no backend, which would normally take care of the heavy processing now handled entirely by the frontend, but at least puzzle inputs are fetched AJAX-illy.

Running
-------

```bash
$ yarn install    # install dependencies
$ yarn serve      # start development server
$ yarn lint       # lint and auto-fix files
$ yarn lint-nofix # lint and don't auto-fix files
$ yarn build      # build for production
```

When building for production, the base path can be changed by defining the `VUE_BASE_PATH` environment variable.
Also remember to [configure server routing](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations), but exclude the *inputs* directory to get proper error handling on the AJAX requests.

Puzzles
-------

### Day 1

Solved with simple, performant `for` loops.

### Day 2

Using regex matching, destructuring and functional techniques.

### Day 3

Utilizing modulo arithmetic and the convenient fact that strings can be indexed into directly.

### Day 4

This time the focus ended up being on `enum`s and indexable types (and some regexes).

### Day 5

Taking advantage of built-in binary literal conversion. Since `String.prototype.replaceAll()` support is still sketchy I rolled my own substitution function.

### Day 6

`Set`s to the rescue!

### Day 7

Regexes and recursion in perfect(?) harmony.

### Day 8

Using the prototype system directly, with error handling.

### Day 9

Back to `for` loops. Yay!

### Day 10

Using recursion with a dynamically populated cache for the second part, which increases its performance by many orders of magnitude (viz. makes it workable at all).
Also, as it turns out, taking advantage of `number`-to-`string` coercion for plain object keys was easier than using `Map`s due to the rigidity and limited control flow analysis capabilities of the TypeScript compiler.

### Day 11

Made a proper visualization of the solutions this time, based on CSS classes and background images.
Performance varies quite a bit between browsers (the test cases are deliberately slowed down for clarity).

### Day 12

This time the solution comes in three flavors, based on functions, classes and prototypes respectively, with a wee bit of evolution along the way.
Spotting and analyzing the differences *and* similarities between these approaches is left as an exercise to the reader.
Part one exploits the convenient fact that TypeScript `enum`s are also regular objects the values of which can be indexed.

### Day 13

Simple iteration for part 1 and a general math-based algorithm without (too many) assumptions for part 2.

### Day 14

Using built-in binary string conversion, since regular bitwise operators in JS are restricted to 32-bit integers. This also enabled a shortcut for part 2.

### Day 15

~~Part 2 uses a caching strategy similar to day 10, but Chrome's memory handling went haywire when I used a plain object, so I had to resort to a `Map` which appears to be almost twice as slow in Firefox. Bah.~~
*__Update:__ Changed the cache to use a pre-allocated typed array instead, which was considerably faster.*
Since we're still in single-threaded mode the UI will freeze when computing part 2, so I've split the examples into sub buttons there and moved some code into the component. Performance varies between browsers.

### Day 16

Interface parsing galore! Part 2 is solved by continuously updating an index of matching positions for each field rule, looking for 1:1 matches.

### Day 17

Using classes this time. It took some time figuring out a workable way to represent the infinite grid in a finite manner, but it worked out in the end. Be aware that part 2 may take a few seconds to run.
*__Update:__ Changed the grid representation to the simpler format used in day 24, which is slightly faster, and rearranged some code.*

### Day 18

Solved using Dijkstra's shunting-yard algorithm and an RPN evaluator, with a parsing step that supports negative numbers.
Error handling is also included, so the test examples have been expanded with an additional five cases only the first of which should pass, with correct handling of multi-digit and negative values (as well as some whitespace sabotage).

### Day 19

Part 1 solved with recursive matching. For part 2 I first tried a somewhat general approach, but in the end just gave up and made a specialized function exploiting the fact that the behavior of rules `0`, `8` and `11` is known. Not very pretty, but it got the job done.

### Day 20

Prototype-based with *lots* of helper functions, plus error handling. Part 2 includes a rudimentary visualization of the sea monsters.

### Day 21

Employing a filtering strategy similar to day 16, but with `Set`s this time.

### Day 22

Nothing of particular note here, except perhaps the string `Set`s used to keep track of previous rounds in part 2 (which takes several seconds to run).

### Day 23

Using a simple implementation of a linked list to keep the cup ring performant (although the actual performance of part 2 varies between browsers).

### Day 24

Since this was largely a repeat of day 17 I reused much of that solution here, but with a more performant representation of the floor grid (and the transformations). As usual, part 2 performance varies between browsers.

### Day 25

~~Easily solved with a simple key cache.~~ *__Update:__ Skipped the cache and just fed the previous value directly into the next iteration instead.* Nice reindeer!

Summary
-------

Well, all problems solved! Some were easier than others, but on the whole things went well – especially considering the limitations and idiosyncrasies of the browser platform.

As for TS, it has helped at times and hindered at others, sometimes resulting in hoops-jumping for stuff that plain JS handles without a second thought. My strategy has been to limit myself to annotations and syntax sugar such as enums, so that the transpiled code should *not* contain statements that serve no actual logic function but are solely there for TS's benefit – and I think that has largely worked out.

The dive into Vue 3 didn't get quite as deep as it might have gotten, with most days using the basic "terminal output" component, but several new core concepts were adequately trialled.

Lastly, I have consistently aimed to solve the puzzles using combinations of generalized functions, in various forms, so that the solutions should depend as little as possible on concrete features of the problem presentations and/or the specific nature of the provided input data. This has resulted in code which is probably not quite as performant as it could have been had I modelled it more closely after the situations at hand at every step, but on the other hand it is also likely more robust – including pervasive error handling – and more in line with typical on-the-job production code. By and large, I think I've reached this goal.

See you next year!
