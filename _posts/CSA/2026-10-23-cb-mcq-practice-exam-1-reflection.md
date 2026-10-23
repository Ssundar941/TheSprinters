---
layout: post
codemirror: true
title: "CB Practice Exam 1 MCQ Reflection: 30/42"
description: My AP CSA Practice Exam 1 MCQ results, the 12 questions I missed and why, the patterns behind them in four units, and Java code runners that rebuild each missed question so I can trace it until it's automatic.
author: Skandan Sundar
permalink: /csa/mcq-reflection-practice-exam-1
---

## Summary

**Score: 30/42 (71%)** on the College Board AP CSA Practice Exam 1 multiple choice (2025–26 course, four units).

I missed 12 questions. When I sorted them by the idea that actually tripped me, **7 of the 12 were Unit 4 (Data Collections)**, the unit with the biggest share of the exam. None of the 12 were about syntax. Every one was a tracing or reading mistake: an endpoint I didn't check, an index I confused with a value, or a `return` I read backwards.

| What this reflection covers | Section |
|---|---|
| Score by unit and by mistake pattern | [Score by unit](#score-by-unit), [Five patterns](#the-five-patterns-behind-my-12-misses) |
| Problems I guessed on but got right | [Guessed but correct](#problems-i-guessed-on-but-got-right) |
| Every missed problem: my answer, the right answer, and why | [Unit deep dives](#unit-by-unit-deep-dive) |
| What each of the four units tests | The "What this unit tests" table in each deep dive |
| New code runners that rebuild every missed question | One or more runners in each deep dive |
| What went well, my test-taking changes, and a study plan with targets | [What went well](#what-went-well), [Plan](#study-plan) |

---

## Score by unit

| Unit | Weight on the real MCQ | Questions | My score |
|---|---|---|---|
| Unit 1: Using Objects and Methods | 15–25% | 12 | 8/12 (67%) |
| Unit 2: Selection and Iteration | 25–35% | 10 | 8/10 (80%) |
| Unit 3: Class Creation | 10–18% | 5 | **5/5 (100%)** |
| **Unit 4: Data Collections** | **30–40%** | 15 | **9/15 (60%)** |
| **Total** | | 42 | **30/42 (71%)** |

<sub>The score report counts each question under its first tag. Q25 (a `static` counter) is tagged 1.13 first and Q38 (`Scanner` with `split`) is tagged 1.15 first, so both count as Unit 1 misses above. The concepts are really Unit 3 and Unit 4, so the deep dives below put them there. Weights are from the Fall 2025 Course and Exam Description.</sub>

## The five patterns behind my 12 misses

| Pattern | Questions | What I'll do instead |
|---|---|---|
| **A. Exclusive endpoints (off by one)** | Q7, Q19, Q33, Q42 | Write the first and last value a variable actually takes before I read the choices |
| **B. Index vs. value** | Q23, Q41 | Use a trace table with separate columns for the index and the value stored there |
| **C. Reading the return logic backwards** | Q30, Q35, Q39 | Run each choice on 2–3 tiny inputs, including one where the answer is `false` |
| **D. Shared state** | Q25, Q23 | Ask "how many copies of this exist?" for every `static` field and every array passed to a method |
| **E. Data and input** | Q27, Q38 | Name what the question needs, then check that the data or the loop gives exactly that |

Pattern A alone accounts for a third of my misses. It's also the easiest to fix, because it's a habit, not a concept.

---

## Problems I guessed on but got right

None. I didn't guess on any of my 30 correct answers, so all of my gaps show up in the 12 misses below.

---

## Unit-by-unit deep dive

Each unit below starts with the categories of information the exam tests, then works through every question I missed in that unit. Each code runner rebuilds the missed question. **The rule for every runner: write your prediction first, then press Run.**

---

### Unit 1: Using Objects and Methods

**What this unit tests**

| Category | Topics | How I did |
|---|---|---|
| Expressions, assignment, input, casting | 1.3–1.5 | No misses |
| Method signatures and calling methods | 1.9, 1.10, 1.14 | No misses |
| The `Math` class | 1.11 | **Missed Q19** |
| Object creation | 1.12, 1.13 | Q25 counted here, explained in Unit 3 |
| `String` methods | 1.15 | **Missed Q7** (Q38 counted here, explained in Unit 4) |

#### Q7: `substring` (1.15)

`original = "DEFGHI"`. Which expression prints `"HIDE"`?

| Index | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Char | D | E | F | G | H | I |

- **I answered C:** `original.substring(5) + original.substring(1, 2)` → `"I" + "E"` = `"IE"`
- **Correct: B:** `original.substring(4) + original.substring(0, 2)` → `"HI" + "DE"` = `"HIDE"`

**Why I missed it:** I was off by one on *both* halves. I counted H as position 5 (counting from 1), and I treated `substring(1, 2)` as if it would include index 2. `substring(a, b)` gives the characters at `a` through `b - 1`, which is `b - a` characters. `"DE"` is two characters starting at 0, so it's `substring(0, 2)`.

#### Q19: `Math.random()` range (1.11)

```java
int r = (int) (Math.random() * 6) + 10;
```

- **I answered D:** 10 to 16, inclusive
- **Correct: C:** 10 to 15, inclusive

| Step | Possible values |
|---|---|
| `Math.random()` | 0.0 ≤ x < 1.0 (never 1.0) |
| `* 6` | 0.0 ≤ x < 6.0 |
| `(int)` truncates | 0, 1, 2, 3, 4, 5 (six values) |
| `+ 10` | 10 … 15 |

**Why I missed it:** I read the `6` as the top of the range. It's the **number** of possible values. The general form is `(int)(Math.random() * (max - min + 1)) + min`, so 10–16 would need `* 7`.

**Rule for Unit 1:** if a range starts at 0, the number you see is a count, and the last valid value is one less.

{% capture challenge_u1 %}
**Q7 + Q19: boundaries.** Before you run: write down what each of the four `substring` choices prints, and the smallest and largest value `r` can ever be. Run it and check. Then change the random expression so it gives 20 to 30 inclusive, and run it again to prove it.
{% endcapture %}

{% capture code_u1 %}
public class Main {
    public static void main(String[] args) {
        String original = "DEFGHI";

        // Show every index so nothing is counted from 1
        for (int i = 0; i < original.length(); i++) {
            System.out.print(i + ":" + original.charAt(i) + "  ");
        }
        System.out.println();

        System.out.println("A: " + original.substring(4) + original.substring(0, 1));
        System.out.println("B: " + original.substring(4) + original.substring(0, 2));
        System.out.println("C: " + original.substring(5) + original.substring(1, 2));
        System.out.println("D: " + original.substring(5) + original.substring(1, 3));

        // Q19: draw many values and record the smallest and largest
        int min = Integer.MAX_VALUE;
        int max = Integer.MIN_VALUE;
        for (int trial = 0; trial < 1000000; trial++) {
            int r = (int) (Math.random() * 6) + 10;
            min = Math.min(min, r);
            max = Math.max(max, r);
        }
        System.out.println("Q19 smallest r: " + min + ", largest r: " + max);
    }
}
{% endcapture %}

{% include runners/code.html
   runner_id="mcq_u1_boundaries"
   language="java"
   challenge=challenge_u1
   challenge_number="1"
   code=code_u1
%}

Lessons to redo: [1.11 Math Class](https://pages.opencodingsociety.com/csa/unit_01/1_11) · [1.15 String Manipulation](https://pages.opencodingsociety.com/csa/unit_01/1_15)

---

### Unit 2: Selection and Iteration

**What this unit tests**

| Category | Topics | How I did |
|---|---|---|
| Boolean expressions and `if` | 2.2, 2.3 | No misses |
| Nested `if` and compound conditions | 2.4–2.6 | **Missed Q30** |
| `while` and `for` loops | 2.7, 2.8 | **Missed Q42** |
| Algorithms with selection and iteration | 2.9, 2.10 | Q30 is also tagged 2.9 |
| Nested loops and run-time | 2.11, 2.12 | No misses |

#### Q30: `minOfThree` (2.4 / 2.9)

- **I answered B**
- **Correct: D:** `if (a <= b && a <= c) return a; else if (b <= a && b <= c) return b; else return c;`

**Why B is wrong:** its outer `else` (the case where `a > b`) returns `c` without ever comparing `b` and `c`. With `a = 20, b = 10, c = 30` it returns 30. When I tested B in Java, I also found it **doesn't compile**: when `a <= b`, `a > c` and `b > c`, no `return` runs, so `javac` reports `missing return statement`. The runner adds `return -1;` so it can still be tested.

**Why the other choices are wrong:** A has the same blind spot in its outer `else` (it returns `b` without checking `c`). C uses `||`, so `a` is returned when it's smaller than just one of the others.

**Why I missed it:** I checked that each branch looked reasonable, but I never fed the method an input that sends it down the outer `else`. A min-of-three method needs at least three tests: one where `a` is smallest, one for `b`, one for `c`.

{% capture challenge_u2a %}
**Q30: test every branch.** Predict which of A–D fail before you run. The runner tries all six orderings of 10, 20, 30, plus ties, and prints every failure and a PASS or failure count for each choice. Then explain in one sentence why choice A only fails on (30, 20, 10), and add one more test case that A also gets wrong.
{% endcapture %}

{% capture code_u2a %}
public class Main {
    static int choiceA(int a, int b, int c) {
        if (a <= b) {
            if (a <= c) { return a; } else { return c; }
        } else {
            return b;
        }
    }

    static int choiceB(int a, int b, int c) {
        if (a <= b) {
            if (a <= c) { return a; }
            else if (b <= c) { return b; }
        } else {
            return c;
        }
        return -1; // added so B compiles: as printed on the exam it is a compile error
    }

    static int choiceC(int a, int b, int c) {
        if (a <= b || a <= c) { return a; }
        else if (b <= a || b <= c) { return b; }
        else { return c; }
    }

    static int choiceD(int a, int b, int c) {
        if (a <= b && a <= c) { return a; }
        else if (b <= a && b <= c) { return b; }
        else { return c; }
    }

    public static void main(String[] args) {
        int[][] tests = {
            {10, 20, 30}, {10, 30, 20}, {20, 10, 30},
            {20, 30, 10}, {30, 10, 20}, {30, 20, 10},
            {10, 10, 20}, {20, 10, 10}, {5, 5, 5}
        };
        String[] names = {"A", "B", "C", "D"};
        for (int i = 0; i < names.length; i++) {
            int failures = 0;
            for (int[] t : tests) {
                int expected = Math.min(t[0], Math.min(t[1], t[2]));
                int got;
                if (i == 0) got = choiceA(t[0], t[1], t[2]);
                else if (i == 1) got = choiceB(t[0], t[1], t[2]);
                else if (i == 2) got = choiceC(t[0], t[1], t[2]);
                else got = choiceD(t[0], t[1], t[2]);
                if (got != expected) {
                    failures++;
                    System.out.println(names[i] + " FAIL on (" + t[0] + ", " + t[1] + ", " + t[2]
                        + "): returned " + got + ", expected " + expected);
                }
            }
            System.out.println(names[i] + ": " + (failures == 0 ? "PASS all tests" : failures + " failures"));
        }
    }
}
{% endcapture %}

{% include runners/code.html
   runner_id="mcq_u2_min_of_three"
   language="java"
   challenge=challenge_u2a
   challenge_number="2"
   code=code_u2a
%}

#### Q42: `while` loop to `for` loop (2.7 / 2.8)

```java
int j = 0;
int sum = 0;
while (j <= 5)
{
   j++;
   sum += j;
}
```

- **I answered A:** `for (int j = 0; j <= 5; j++) { j++; sum += j; }`
- **Correct: D:** `for (int j = 1; j <= 6; j++) { sum += j; }`

**Why I missed it:** I matched the loop *header* (`j <= 5` looks the same) instead of the values that get added. The `while` loop increments **before** it adds, so it adds 1, 2, 3, 4, 5, 6 and `sum` is 21. Choice A increments `j` twice per pass (once in the body, once in the header), so it adds only 1, 3, 5 and `sum` is 9.

**Rule:** two loops are equivalent when they add the same sequence of values, not when they look alike.

{% capture challenge_u2b %}
**Q42: compare the values, not the headers.** Predict the list of values each loop adds and its final sum. The runner prints both for the original loop and all four choices. Then write a fifth loop of your own that also gives 21 but counts down.
{% endcapture %}

{% capture code_u2b %}
public class Main {
    public static void main(String[] args) {
        // Original while loop
        int j = 0;
        int sum = 0;
        String added = "";
        while (j <= 5) {
            j++;
            sum += j;
            added += j + " ";
        }
        System.out.println("while: adds " + added + "-> sum = " + sum);

        // Choice A
        sum = 0; added = "";
        for (int k = 0; k <= 5; k++) { k++; sum += k; added += k + " "; }
        System.out.println("A:     adds " + added + "-> sum = " + sum);

        // Choice B
        sum = 0; added = "";
        for (int k = 0; k <= 6; k++) { k++; sum += k; added += k + " "; }
        System.out.println("B:     adds " + added + "-> sum = " + sum);

        // Choice C
        sum = 0; added = "";
        for (int k = 1; k <= 5; k++) { sum += k; added += k + " "; }
        System.out.println("C:     adds " + added + "-> sum = " + sum);

        // Choice D
        sum = 0; added = "";
        for (int k = 1; k <= 6; k++) { sum += k; added += k + " "; }
        System.out.println("D:     adds " + added + "-> sum = " + sum);
    }
}
{% endcapture %}

{% include runners/code.html
   runner_id="mcq_u2_loop_equivalence"
   language="java"
   challenge=challenge_u2b
   challenge_number="3"
   code=code_u2b
%}

Lessons to redo: [2.4 Nested if](https://pages.opencodingsociety.com/csa/unit_02/2_4) · [2.7 while Loops](https://pages.opencodingsociety.com/csa/unit_02/2_7) · [2.8 for Loops](https://pages.opencodingsociety.com/csa/unit_02/2_8) · [2.9 Algorithms](https://pages.opencodingsociety.com/csa/unit_02/2_9)

---

### Unit 3: Class Creation

**What this unit tests**

| Category | Topics | How I did |
|---|---|---|
| Abstraction and program design | 3.1, 3.2 | No misses |
| Anatomy of a class, constructors | 3.3, 3.4 | No misses |
| Writing methods, accessors and mutators | 3.5, 3.6 | No misses |
| `static` variables and methods | 3.7 | **Missed Q25** (the report counts it under 1.13) |
| Scope, access and `this` | 3.8, 3.9 | No misses |

Class design was my strongest area. My only miss was about `static`.

#### Q25: `static` counter (3.7)

```java
Shoe s1 = new Shoe(8.5, "sneaker");
Shoe s2 = new Shoe();
Shoe s3 = new Shoe(7.0, "sandal");
System.out.println(Shoe.getCount());
```

- **I answered B:** `1`
- **Correct: C:** `2`

| Statement | Constructor that runs | Changes `count`? | `count` after |
|---|---|---|---|
| `new Shoe(8.5, "sneaker")` | two-parameter | yes, `count++` | 1 |
| `new Shoe()` | no-argument | **no** | 1 |
| `new Shoe(7.0, "sandal")` | two-parameter | yes, `count++` | 2 |

**Why I missed it:** I answered as if each `Shoe` kept its own `count`, so I pictured one shoe's value (1). `static` means there is **one** `count` shared by the whole class, and `Shoe.getCount()` reads that one copy. The real trap is the no-argument constructor: it never touches `count`, so three objects only give 2.

**Rule:** for every `static` field, find each constructor and method that changes it, then count only the calls that actually run.

{% capture challenge_u3 %}
**Q25: count the shared copy.** Predict the count printed after each line. Then try two edits, predicting first each time: (1) add `count++;` to the no-argument constructor; (2) remove `static` from the `count` field. Edit 2 won't compile. Read the error and explain why a `static` method can't read an instance variable.
{% endcapture %}

{% capture code_u3 %}
public class Main {
    static class Shoe {
        private static int count = 0;

        private double size;
        private String style;

        public Shoe() {
            size = 7.0;
            style = "boot";
        }

        public Shoe(double mySize, String myStyle) {
            size = mySize;
            style = myStyle;
            count++;
        }

        public static int getCount() {
            return count;
        }
    }

    public static void main(String[] args) {
        Shoe s1 = new Shoe(8.5, "sneaker");
        System.out.println("after s1: " + Shoe.getCount());
        Shoe s2 = new Shoe();
        System.out.println("after s2: " + Shoe.getCount());
        Shoe s3 = new Shoe(7.0, "sandal");
        System.out.println("after s3: " + Shoe.getCount());
    }
}
{% endcapture %}

{% include runners/code.html
   runner_id="mcq_u3_static_count"
   language="java"
   challenge=challenge_u3
   challenge_number="4"
   code=code_u3
%}

Lesson to redo: [3.7 Class Variables and Methods](https://pages.opencodingsociety.com/csa/unit_03/3_7)

---

### Unit 4: Data Collections

This unit is 30–40% of the MCQ and also drives FRQ 3 (ArrayList) and FRQ 4 (2D array), so it's where my study time goes first.

**What this unit tests**

| Category | Topics | How I did |
|---|---|---|
| Data collection and data sets | 4.1, 4.2 | **Missed Q27** |
| 1D arrays: create, access, traverse, algorithms | 4.3–4.5 | **Missed Q23, Q33, Q41** |
| Text files with `Scanner` | 4.6 | **Missed Q38** (the report counts it under 1.15) |
| Wrapper classes and `ArrayList` methods | 4.7, 4.8 | No misses |
| `ArrayList` traversal and algorithms | 4.9, 4.10 | **Missed Q35** |
| 2D arrays | 4.11–4.13 | No misses |
| Searching, sorting, recursion | 4.14–4.16 | No misses |
| Recursive searching and sorting | 4.17 | **Missed Q39** |

#### Q23: array passed to a method (4.3)

```java
public static void updateArr(int[] arr, int val) { arr[val] = val; }

int[] numArr = new int[4];
updateArr(numArr, 1);
updateArr(numArr, 3);
```

- **I answered C:** `{1, 0, 3, 0}`
- **Correct: B:** `{0, 1, 0, 3}`

**Why I missed it:** `val` is used as **both** the index and the value. `arr[1] = 1` and `arr[3] = 3`. I put the values in the first open slots, as if arrays started at index 1. This question also checks pattern D: the method gets a reference to the same array, so its changes show up in `numArr`.

#### Q33: traverse from the end, step 2 (4.4)

```java
int[] arr = {10, 20, 30, 40, 50, 60};
for (int j = arr.length - 1; j >= 0; j -= 2) { arr[j]++; }
```

- **I answered A:** `{10, 20, 31, 40, 51, 60}` (changes indices 2 and 4)
- **Correct: B:** `{10, 21, 30, 41, 50, 61}`

| `j` | `arr[j]` before | `arr[j]` after |
|---|---|---|
| 5 | 60 | 61 |
| 3 | 40 | 41 |
| 1 | 20 | 21 |
| −1 | loop stops | |

**Why I missed it:** I saw "every other element, going backwards" and never wrote down where `j` starts. `arr.length - 1` is 5, the last index, so the odd indices change.

{% capture challenge_u4a %}
**Q23 + Q33: index vs. value.** Predict both arrays. The runner prints the array after every call and every pass, which is the trace table I should have written on the exam. Then change the loop to start at `arr.length - 2` and predict the new result before running.
{% endcapture %}

{% capture code_u4a %}
import java.util.Arrays;

public class Main {
    public static void updateArr(int[] arr, int val) {
        arr[val] = val;
    }

    public static void main(String[] args) {
        // Q23
        int[] numArr = new int[4];
        System.out.println("Q23 start:           " + Arrays.toString(numArr));
        updateArr(numArr, 1);
        System.out.println("after updateArr(1):  " + Arrays.toString(numArr));
        updateArr(numArr, 3);
        System.out.println("after updateArr(3):  " + Arrays.toString(numArr));

        // Q33
        int[] arr = {10, 20, 30, 40, 50, 60};
        System.out.println("\nQ33 start:  " + Arrays.toString(arr));
        for (int j = arr.length - 1; j >= 0; j -= 2) {
            arr[j]++;
            System.out.println("j = " + j + " -> " + Arrays.toString(arr));
        }
    }
}
{% endcapture %}

{% include runners/code.html
   runner_id="mcq_u4_array_trace"
   language="java"
   challenge=challenge_u4a
   challenge_number="5"
   code=code_u4a
%}

#### Q41: nested loop, last assignment wins (4.5)

```java
String[] colors = {"red", "green", "orange", "black", "yellow", "brown"};
int result = -1;
for (int j = 0; j < colors.length; j++)
   for (int k = j + 1; k < colors.length; k++)
      if (colors[j].length() == colors[k].length())
         result = k;
```

- **I answered C:** `4`
- **Correct: D:** `5`

**Why I missed it:** `result` is overwritten every time a pair matches. I stopped at the orange/yellow pair (index 4) instead of following the loop to its **last** match, black/brown (index 5). The lengths are red 3, green 5, orange 6, black 5, yellow 6, brown 5, and the assignments happen in the order 3, 5, 4, 5.

{% capture challenge_u4b %}
**Q41: follow every assignment.** Predict the order of the assignments to `result` and its final value. The runner logs each one. Then change the code so it keeps the **first** match instead of the last, without adding a `break`.
{% endcapture %}

{% capture code_u4b %}
public class Main {
    public static void main(String[] args) {
        String[] colors = {"red", "green", "orange", "black", "yellow", "brown"};
        int result = -1;
        for (int j = 0; j < colors.length; j++) {
            for (int k = j + 1; k < colors.length; k++) {
                if (colors[j].length() == colors[k].length()) {
                    result = k;
                    System.out.println(colors[j] + "(" + j + ") and " + colors[k] + "(" + k
                        + ") both have length " + colors[k].length() + " -> result = " + result);
                }
            }
        }
        System.out.println("final result = " + result);
    }
}
{% endcapture %}

{% include runners/code.html
   runner_id="mcq_u4_last_assignment"
   language="java"
   challenge=challenge_u4b
   challenge_number="6"
   code=code_u4b
%}

#### Q35: describe what `mystery` does (4.9 / 4.10)

```java
int prev = Integer.MAX_VALUE;
for (int num : numbers) {
   if (num > prev) return false;
   prev = num;
}
return true;
```

- **I answered B:** returns `false` if sorted greatest to least, `true` otherwise
- **Correct: D:** returns `true` if sorted greatest to least, `false` otherwise

**Why I missed it:** I spotted that the method is about greatest-to-least order, then flipped which case returns `true`. An early `return false` means "I found a problem": a number bigger than the one before it. Reaching the end without finding one means `true`. Testing `[30, 20, 10]` and `[10, 30, 20, 40]` in my head would have shown it.

{% capture challenge_u4c %}
**Q35: test the description on tiny inputs.** Predict `true` or `false` for each list. Then write a second method, `isAscending`, that returns `true` only for lists sorted least to greatest, and add a test list where the two methods disagree.
{% endcapture %}

{% capture code_u4c %}
import java.util.ArrayList;
import java.util.Arrays;

public class Main {
    public static boolean mystery(ArrayList<Integer> numbers) {
        int prev = Integer.MAX_VALUE;
        for (int num : numbers) {
            if (num > prev) {
                return false;
            }
            prev = num;
        }
        return true;
    }

    public static void main(String[] args) {
        Integer[][] lists = {
            {30, 20, 10},
            {10, 20, 30},
            {10, 30, 20, 40},
            {50, 50, 40},
            {}
        };
        for (Integer[] list : lists) {
            ArrayList<Integer> numbers = new ArrayList<Integer>(Arrays.asList(list));
            System.out.println(numbers + " -> " + mystery(numbers));
        }
    }
}
{% endcapture %}

{% include runners/code.html
   runner_id="mcq_u4_describe_behavior"
   language="java"
   challenge=challenge_u4c
   challenge_number="7"
   code=code_u4c
%}

#### Q39: binary search with duplicates (4.17)

`binarySearch(numbers, 0, 10, 10)` on `{10, 10, 10, 20, 20, 30, 40, 50, 50, 60, 80}`

| Call | `low` | `high` | `mid` | `numbers[mid]` | Next step |
|---|---|---|---|---|---|
| 1 | 0 | 10 | 5 | 30 | 10 < 30, search left |
| 2 | 0 | 4 | 2 | 10 | match, **return 2** |

- **I answered C:** `1`
- **Correct: D:** `2`

**Why I missed it:** I assumed binary search returns an early index for a value that repeats. It doesn't scan from the left. It returns the first matching index it **lands on**, and on the second call `mid` is already 2, so it never looks at index 0 or 1.

{% capture challenge_u4d %}
**Q39: trace `low`, `high`, `mid`.** Predict every call before running. The runner prints each one. Then search for 50 and for 25 (not in the array), predicting each trace first. Stretch goal: change the method so it returns the *first* occurrence of the target.
{% endcapture %}

{% capture code_u4d %}
public class Main {
    public static int binarySearch(int[] elements, int low, int high, int target) {
        if (low <= high) {
            int mid = (high + low) / 2;
            System.out.println("low = " + low + ", high = " + high + ", mid = " + mid
                + ", elements[mid] = " + elements[mid]);
            if (target < elements[mid]) {
                return binarySearch(elements, low, mid - 1, target);
            } else if (target > elements[mid]) {
                return binarySearch(elements, mid + 1, high, target);
            } else if (elements[mid] == target) {
                return mid;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] numbers = {10, 10, 10, 20, 20, 30, 40, 50, 50, 60, 80};
        int result = binarySearch(numbers, 0, numbers.length - 1, 10);
        System.out.println("result = " + result);
    }
}
{% endcapture %}

{% include runners/code.html
   runner_id="mcq_u4_binary_search"
   language="java"
   challenge=challenge_u4d
   challenge_number="8"
   code=code_u4d
%}

#### Q38: `Scanner` and `split` (4.6)

The file has four lines with no spaces, like `finest_artist`, and the goal is `firstList = [finest, biggest, nicest, best]` and `secondList = [artist, gamer, teacher, athlete]`.

- **I answered A:** two `sc.next()` calls per pass, one into each list
- **Correct: C:** one `sc.next()` per pass, then `split("_")` and add `temp[0]` and `temp[1]`

**Why I missed it:** with no spaces, each `sc.next()` returns a **whole line**. Choice A reads two lines per pass, so `firstList` gets lines 1 and 3 whole and `secondList` gets lines 2 and 4. I didn't count how many `next()` calls happen per pass.

{% capture challenge_u4e %}
**Q38: count the `next()` calls.** The runner reads the same four lines from a `String` (the runner has no file system, but `Scanner` works the same way). Predict both lists for choice A and choice C, then run.
{% endcapture %}

{% capture code_u4e %}
import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    static final String FILE_TEXT = "finest_artist\nbiggest_gamer\nnicest_teacher\nbest_athlete\n";

    public static void main(String[] args) {
        // Choice A
        Scanner sc = new Scanner(FILE_TEXT);
        ArrayList<String> firstList = new ArrayList<String>();
        ArrayList<String> secondList = new ArrayList<String>();
        while (sc.hasNext()) {
            firstList.add(sc.next());
            secondList.add(sc.next());
        }
        System.out.println("A: first = " + firstList + ", second = " + secondList);

        // Choice C
        sc = new Scanner(FILE_TEXT);
        firstList = new ArrayList<String>();
        secondList = new ArrayList<String>();
        while (sc.hasNext()) {
            String[] temp = sc.next().split("_");
            firstList.add(temp[0]);
            secondList.add(temp[1]);
        }
        System.out.println("C: first = " + firstList + ", second = " + secondList);
    }
}
{% endcapture %}

{% include runners/code.html
   runner_id="mcq_u4_scanner_split"
   language="java"
   challenge=challenge_u4e
   challenge_number="9"
   code=code_u4e
%}

#### Q27: choosing a data set (4.2)

The question: were students who took a CS course more or less likely to be in the photography club?

- **I answered D:** data set 4 (each student's favorite course and favorite club)
- **Correct: C:** data set 3 (each student's list of courses taken and list of clubs)

**Why I missed it:** "favorite" isn't "took" or "joined". The comparison needs **two facts for every student**: did they take CS, and are they in the photography club. Only data set 3 records both for the whole school. Data sets 1 and 2 have club members but no course history, and data set 2 only covers people who are already in the club, so there's nobody to compare them with.

{% capture challenge_u4f %}
**Q27: let the data answer the question.** This models a few rows of data set 3 and computes the photography-club rate for students who took CS and for students who didn't. Predict both rates. Then try to write the same calculation using only "favorite course" and "favorite club" fields, and note which students you can't classify.
{% endcapture %}

{% capture code_u4f %}
import java.util.ArrayList;
import java.util.Arrays;

public class Main {
    static class Student {
        String name;
        ArrayList<String> courses;
        ArrayList<String> clubs;

        Student(String name, String[] courses, String[] clubs) {
            this.name = name;
            this.courses = new ArrayList<String>(Arrays.asList(courses));
            this.clubs = new ArrayList<String>(Arrays.asList(clubs));
        }
    }

    public static void main(String[] args) {
        ArrayList<Student> dataSet3 = new ArrayList<Student>();
        dataSet3.add(new Student("Ana",   new String[]{"CS", "Art"},       new String[]{"Photography"}));
        dataSet3.add(new Student("Ben",   new String[]{"CS"},              new String[]{"Robotics"}));
        dataSet3.add(new Student("Cy",    new String[]{"History"},         new String[]{"Photography", "Chess"}));
        dataSet3.add(new Student("Dee",   new String[]{"Biology"},         new String[]{}));
        dataSet3.add(new Student("Eli",   new String[]{"CS", "Biology"},   new String[]{"Photography"}));
        dataSet3.add(new Student("Fay",   new String[]{"Art"},             new String[]{"Drama"}));

        int csTotal = 0, csPhoto = 0, otherTotal = 0, otherPhoto = 0;
        for (Student s : dataSet3) {
            boolean tookCS = s.courses.contains("CS");
            boolean inPhoto = s.clubs.contains("Photography");
            if (tookCS) {
                csTotal++;
                if (inPhoto) csPhoto++;
            } else {
                otherTotal++;
                if (inPhoto) otherPhoto++;
            }
        }
        System.out.println("Took CS:   " + csPhoto + "/" + csTotal + " in photography club");
        System.out.println("No CS:     " + otherPhoto + "/" + otherTotal + " in photography club");
    }
}
{% endcapture %}

{% include runners/code.html
   runner_id="mcq_u4_data_set"
   language="java"
   challenge=challenge_u4f
   challenge_number="10"
   code=code_u4f
%}

Lessons to redo: [4.2 Data Sets](https://pages.opencodingsociety.com/csa/unit_04/4_2) · [4.3 Arrays](https://pages.opencodingsociety.com/csa/unit_04/4_3) · [4.4 Array Traversals](https://pages.opencodingsociety.com/csa/unit_04/4_4) · [4.5 Array Algorithms](https://pages.opencodingsociety.com/csa/unit_04/4_5) · [4.6 Text Files](https://pages.opencodingsociety.com/csa/unit_04/4_6) · [4.9 ArrayList Traversals](https://pages.opencodingsociety.com/csa/unit_04/4_9) · [4.10 ArrayList Algorithms](https://pages.opencodingsociety.com/csa/unit_04/4_10) · [4.17 Recursive Searching](https://pages.opencodingsociety.com/csa/unit_04/4_17)

---

## All 12 misses at a glance

| Q | Topic | Unit (concept) | I chose | Correct | Pattern | Runner |
|---|---|---|---|---|---|---|
| Q7 | 1.15 `substring` | 1 | C | B | A | #1 |
| Q19 | 1.11 `Math.random` | 1 | D | C | A | #1 |
| Q30 | 2.4 / 2.9 nested `if` | 2 | B | D | C | #2 |
| Q42 | 2.7 / 2.8 loop equivalence | 2 | A | D | A | #3 |
| Q25 | 3.7 `static` | 3 | B | C | D | #4 |
| Q23 | 4.3 array parameter | 4 | C | B | B, D | #5 |
| Q33 | 4.4 array traversal | 4 | A | B | A | #5 |
| Q41 | 4.5 nested loop on an array | 4 | C | D | B | #6 |
| Q35 | 4.9 / 4.10 describe behavior | 4 | B | D | C | #7 |
| Q39 | 4.17 binary search | 4 | C | D | C | #8 |
| Q38 | 4.6 `Scanner` and `split` | 4 | A | C | E | #9 |
| Q27 | 4.2 data sets | 4 | D | C | E | #10 |

---

## What went well

30 of 42 is a solid start, and the right answers show what I can already count on:

- **Class design (Unit 3):** class anatomy, constructors, accessors and mutators, scope, and finding the errors in a broken class. My only Unit 3 miss was `static`.
- **Boolean logic (2.2–2.6):** every compound condition and equivalent-expression question.
- **2D arrays (4.11–4.13):** creation, row/column traversal including the column bound, and 2D algorithms.
- **Recursion, sorting and `ArrayList` methods (4.8, 4.15, 4.16).**
- **String algorithms, nested loops and run-time (2.10–2.12).**

The pattern I see: my misses weren't on the hardest-looking questions. They were on questions that looked familiar, where I matched the code to a shape I knew instead of tracing it.

## How I'll take the next MCQ

1. **Endpoints first.** For every loop, `substring` and `Math.random`, write the first and last value before reading the choices.
2. **Trace table for every array or list question.** Columns for the loop variable, the index, and the value. If a variable is reassigned inside a loop, the answer is its last assignment.
3. **Test "describe" and "which code works" choices** on 2–3 tiny inputs, including one where the answer is `false` and one per branch. Check that every path returns.
4. **Ask "how many copies?"** for every `static` field and every array or object passed to a method.
5. **Mark any guess with a ?** so I still study it like a miss, even if it turns out right.

## Study plan

- [ ] Run all 10 runners above on a fresh day. Write each prediction first and finish each challenge's edit.
- [ ] Redo all 12 missed questions on paper one week from now, without looking at this post.
- [ ] Make a boundary cheat sheet (`substring`, `Math.random`, `< length`, last index) and check it against 10 practice problems.
- [ ] Redo the OCS lessons linked under each unit, starting with Unit 4 (4.3–4.6, 4.9, 4.10, 4.17).
- [ ] Take the Unit 4 Progress Check MCQ on AP Classroom.
- [ ] Next full MCQ under real timing (90 minutes): **35+/42**, with Unit 4 at **12+/15**.

## Reflection

**What I know:** class design, Boolean logic, 2D arrays and recursion traces are solid, and none of my misses were about Java syntax.

**What I improved by doing this review:** I rebuilt each missed question as a runnable program, which made the mistakes concrete. Testing choice B of Q30 in Java showed me it doesn't even compile, something I'd never have noticed by reading it. Writing the trace tables for Q33 and Q39 showed me that the right answer was one written-down line away in both cases.

**What still needs work:** Unit 4 traversals and loop endpoints. These are habits more than knowledge, so the fix is a process I follow on every question: endpoints first, trace tables, tiny test inputs. I'll measure it with the Unit 4 progress check and the next full practice MCQ.
