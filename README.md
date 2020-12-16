Advent of Code 2020
===================

This year's puzzles will be solved using Vue 3 and TypeScript, exploring the possibilities and limitations of both.

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
Also remember to [configure server routing](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations).

Puzzles
-------

### Day 1

Solved with simple, performant `for` loops.

### Day 2

Using regex matching, destructuring and functional techniques.

### Day 3

Utilizing modulo arithmetic and the convenient fact that strings can be indexed into directly.

### Day 4

This time the focus ended up being on enums and indexable types (and some regexes).

### Day 5

Taking advantage of built-in binary literal conversion. Since `String.prototype.replaceAll()` support is still sketchy I rolled my own substitution function.

### Day 6

Sets to the rescue!

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

Part 2 uses a caching strategy similar to day 10, but Chrome's memory handling went haywire when I used a plain object, so I had to resort to a `Map` which appears to be almost twice as slow in Firefox. Bah.
Since we're still in single-threaded mode the UI will freeze when computing part 2, so I've split the examples into sub buttons there and moved some code into the component. Performance varies greatly between browsers, but count on several seconds at the least.

### Day 16

Interface parsing galore! Part 2 is solved by continuously updating an index of matching positions for each field rule, looking for 1:1 matches.
