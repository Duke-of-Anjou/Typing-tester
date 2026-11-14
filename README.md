# ⌨️ Typing Speed Tester

A 60-second typing test that checks every keystroke in real time. Correct letters turn green, mistakes turn red, and live cards show your time left, mistakes, words per minute (WPM) and accuracy.

Built with plain HTML, CSS and JavaScript: no frameworks, libraries or CDNs.

**Live demo:** _typing-testerv2.vercel.app/_

## Features

- Random quote from a built-in pool on every round
- Timer starts on your first keypress, not when the page loads
- Live colour coding: green for correct, red with a pink highlight for wrong
- Blinking cursor on the next letter to type
- Live stats: Time Left, Mistakes, Net WPM, Accuracy %
- Results popup when the timer runs out or you finish the quote
- Restart button that clears the old timer, so the clock never runs double speed
- Works on phones and desktops

## How to run

No install needed. Double-click `index.html` to open it in any browser.

## How it works

1. **Quote injection:** the chosen quote is split into single characters with `.split("")`, and each one is wrapped in its own `<span>` inside the display box.
2. **First-key countdown:** a flag (`isTyping`) starts as `false`. The first keystroke flips it and starts `setInterval(updateTimer, 1000)`.
3. **Real-time checking:** on every `input` event, the code compares character `i` you typed with span `i` and gives the span the `correct` or `incorrect` class.
4. **Teardown:** when time hits 0 or the quote is complete, `clearInterval` stops the timer, the input is disabled and the results popup appears.

The page uses two layers: you type into a `<textarea>`, but what you see is the row of coloured `<span>`s. You can't colour individual letters inside a textarea, which is why the display is separate.

### Formulas

```
Net WPM  = ((characters typed − mistakes) ÷ 5) ÷ minutes elapsed
Accuracy = (correct characters ÷ characters typed) × 100
```

A "word" is the standard 5 characters. WPM shows 0 instead of a negative number, `NaN` or `Infinity`, and accuracy shows 100% before anything is typed.

## Concepts covered

`.split()` · `createElement` / `appendChild` · CSS class toggling · the `input` event · `setInterval` / `clearInterval` · CSS `@keyframes` · CSS Grid · media queries

## Files

```
typing-tester/
├── index.html   # page structure: stats cards, quote display, input, results popup
├── style.css    # layout, colours, blinking cursor, responsive rules
└── script.js    # quote pool, timer, keystroke checking, WPM and accuracy maths
```
