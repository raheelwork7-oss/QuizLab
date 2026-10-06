
const QUESTIONS = [
  
  
  
  {
    id: "html-01",
    category: "html",
    difficulty: "easy",
    type: "conceptual",
    question: "Which element is the most appropriate landmark for the primary site navigation?",
    options: ["<nav>", "<menu>", "<aside>", "<section>"],
    correctAnswer: 0,
    explanation: "<nav> is the semantic landmark specifically intended for major navigation blocks. Screen readers announce it as a navigation region.",
    code: null
  },
  {
    id: "html-02",
    category: "html",
    difficulty: "easy",
    type: "multiple-choice",
    question: "What is the correct way to associate a <label> with an <input> for accessibility?",
    options: [
      "Wrap the input in a <div> with role=\"label\"",
      "Use matching for and id attributes",
      "Add aria-label only on the form",
      "Place the label after the input without attributes"
    ],
    correctAnswer: 1,
    explanation: "Matching for/id (or wrapping the control) creates an explicit association so activating the label focuses the input and announces its name.",
    code: null
  },
  {
    id: "html-03",
    category: "html",
    difficulty: "medium",
    type: "code-output",
    question: "Given this markup, which heading level should follow for a subsection under the article title?",
    options: ["<h1>", "<h2>", "<h4>", "<h6>"],
    correctAnswer: 1,
    explanation: "Heading levels should not skip. After an article <h1>, the next subsection should typically be <h2> to preserve document outline structure.",
    code: `<article>
  <h1>Deploying static sites</h1>
  next subsection heading?
</article>`
  },
  {
    id: "html-04",
    category: "html",
    difficulty: "medium",
    type: "scenario",
    question: "You need an image that adapts to different viewport widths with multiple source files. Which approach is most appropriate?",
    options: [
      "A single <img> with width=\"100%\" only",
      "<img> with srcset and sizes attributes",
      "CSS background-image with media queries only",
      "Multiple <img> tags shown/hidden with display"
    ],
    correctAnswer: 1,
    explanation: "srcset and sizes let the browser choose an appropriate image candidate based on viewport and DPR, which is the standard responsive images pattern.",
    code: null
  },
  {
    id: "html-05",
    category: "html",
    difficulty: "easy",
    type: "conceptual",
    question: "Which attribute makes a form control required before submission?",
    options: ["mandatory", "required", "validate", "needed"],
    correctAnswer: 1,
    explanation: "The boolean required attribute triggers native constraint validation and communicates the requirement to assistive technologies.",
    code: null
  },
  {
    id: "html-06",
    category: "html",
    difficulty: "medium",
    type: "debugging",
    question: "A screen reader user cannot determine the purpose of this icon-only button. What is the best fix?",
    options: [
      "Increase the button font-size",
      "Add a visible or accessible name (aria-label or visually hidden text)",
      "Replace <button> with <div onclick>",
      "Add title on a parent <div>"
    ],
    correctAnswer: 1,
    explanation: "Icon-only controls need an accessible name. Prefer visible text, or aria-label / visually hidden text. title alone is unreliable for accessibility.",
    code: `<button type="button">
  <svg aria-hidden="true">...</svg>
</button>`
  },
  {
    id: "html-07",
    category: "html",
    difficulty: "hard",
    type: "scenario",
    question: "For SEO and accessibility, how should you mark up the main page title in the document body?",
    options: [
      "One <h1> that describes the page’s primary topic",
      "Multiple <h1> elements, one per section, always",
      "Only a <title> tag; no headings in the body",
      "A <p class=\"title\"> styled large"
    ],
    correctAnswer: 0,
    explanation: "A single clear <h1> (or carefully structured outline) describing the primary topic helps both users and crawlers. Decorative large text is not a substitute.",
    code: null
  },
  {
    id: "html-08",
    category: "html",
    difficulty: "medium",
    type: "multiple-choice",
    question: "Which element is best for a self-contained piece of content that could be syndicated (e.g., a blog post)?",
    options: ["<section>", "<article>", "<div>", "<main>"],
    correctAnswer: 1,
    explanation: "<article> represents independent, self-contained content. <section> groups thematically related content; <main> is the document’s primary content landmark.",
    code: null
  },
  {
    id: "html-09",
    category: "html",
    difficulty: "easy",
    type: "conceptual",
    question: "What does the alt attribute on <img> primarily provide?",
    options: [
      "A CSS fallback color",
      "Alternative text when the image cannot be seen or fails to load",
      "SEO keywords only, ignored by screen readers",
      "The image filename for caching"
    ],
    correctAnswer: 1,
    explanation: "alt supplies a textual alternative for non-visual users and when the image fails. Decorative images should use alt=\"\".",
    code: null
  },
  {
    id: "html-10",
    category: "html",
    difficulty: "hard",
    type: "code-output",
    question: "Which input type is most appropriate for collecting an email address with built-in validation hints?",
    options: ['type="text"', 'type="email"', 'type="url"', 'type="search"'],
    correctAnswer: 1,
    explanation: 'type="email" enables native format validation, appropriate mobile keyboards, and clearer semantics for assistive tech.',
    code: `<form>
  <label for="mail">Work email</label>
  <input id="mail" name="mail" >
</form>`
  },
  {
    id: "html-11",
    category: "html",
    difficulty: "medium",
    type: "scenario",
    question: "You need a skip link so keyboard users can bypass repeated navigation. Where should it appear?",
    options: [
      "As the first focusable element in the document",
      "Only in the footer",
      "Inside each <nav> as the last item",
      "Only when the mouse is used"
    ],
    correctAnswer: 0,
    explanation: "Skip links should be among the first focusable elements so keyboard users can jump to main content before tabbing through chrome.",
    code: null
  },
  {
    id: "html-12",
    category: "html",
    difficulty: "easy",
    type: "multiple-choice",
    question: "Which attribute opens a link in a new browsing context?",
    options: ['rel="external"', 'target="_blank"', 'type="new"', 'role="link-new"'],
    correctAnswer: 1,
    explanation: 'target="_blank" opens a new tab/window. Pair it with rel="noopener noreferrer" for security when linking to untrusted origins.',
    code: null
  },
  {
    id: "html-13",
    category: "html",
    difficulty: "hard",
    type: "debugging",
    question: "This form submits even when the email field is empty. Why might that happen?",
    options: [
      "required only works with type=\"email\"",
      "The submit button uses type=\"button\" so validation never runs on submit — wait, actually: novalidate is on the form",
      "Labels disable validation",
      "id and name must be identical"
    ],
    correctAnswer: 1,
    explanation: "The form has the novalidate attribute, which disables native HTML constraint validation on submit.",
    code: `<form novalidate>
  <input type="email" name="email" required>
  <button type="submit">Send</button>
</form>`
  },
  {
    id: "html-14",
    category: "html",
    difficulty: "medium",
    type: "conceptual",
    question: "What is the primary purpose of the <main> element?",
    options: [
      "To wrap the entire page including header and footer",
      "To identify the dominant content unique to the document",
      "To replace <body> in modern HTML",
      "To create a CSS grid container automatically"
    ],
    correctAnswer: 1,
    explanation: "<main> represents the dominant content of the document body — content unique to that page. There should typically be only one visible <main>.",
    code: null
  },
  {
    id: "html-15",
    category: "html",
    difficulty: "hard",
    type: "scenario",
    question: "For a data table with complex headers, which attribute helps associate header cells with data cells?",
    options: ["scope or headers", "aria-table", "data-header", "cell-link"],
    correctAnswer: 0,
    explanation: "scope on <th>, or headers/id associations, clarify relationships in complex tables for assistive technologies.",
    code: null
  },
  {
    id: "html-16",
    category: "html",
    difficulty: "easy",
    type: "multiple-choice",
    question: "Which meta tag is essential for responsive layout on mobile browsers?",
    options: [
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      '<meta name="mobile" content="true">',
      '<meta name="responsive" content="on">',
      '<meta charset="utf-8">'
    ],
    correctAnswer: 0,
    explanation: "The viewport meta tag controls layout viewport width and scale so CSS media queries and fluid layouts behave correctly on mobile.",
    code: null
  },
  {
    id: "html-17",
    category: "html",
    difficulty: "medium",
    type: "code-output",
    question: "Which element should wrap a group of related form controls with a caption?",
    options: ["<group>", "<fieldset> with <legend>", "<section> with <title>", "<form-group>"],
    correctAnswer: 1,
    explanation: "<fieldset> groups related controls; <legend> provides the group caption, improving structure and accessibility.",
    code: `Group: Billing address
which wrapper?
  <input name="city">
  <input name="zip">`
  },
  {
    id: "html-18",
    category: "html",
    difficulty: "hard",
    type: "conceptual",
    question: "What does loading=\"lazy\" on an <img> instruct the browser to do?",
    options: [
      "Compress the image to WebP automatically",
      "Defer loading until the image is near the viewport",
      "Disable caching for that image",
      "Load the image before CSS"
    ],
    correctAnswer: 1,
    explanation: "Native lazy loading defers fetching offscreen images until they approach the viewport, improving initial page performance.",
    code: null
  },
  {
    id: "html-19",
    category: "html",
    difficulty: "medium",
    type: "scenario",
    question: "You need a disclosure widget for FAQ answers without JavaScript. Which elements are purpose-built for this?",
    options: [
      "<details> and <summary>",
      "<dialog> and <menu>",
      "<accordion> and <panel>",
      "<expand> and <collapse>"
    ],
    correctAnswer: 0,
    explanation: "<details>/<summary> provide native expandable disclosure UI with built-in keyboard behavior.",
    code: null
  },
  {
    id: "html-20",
    category: "html",
    difficulty: "easy",
    type: "debugging",
    question: "Why might this link be problematic for accessibility and SEO?",
    options: [
      "Anchor text is non-descriptive (“click here”)",
      "href uses https",
      "It is an inline element",
      "It lacks a target attribute"
    ],
    correctAnswer: 0,
    explanation: "Vague link text fails to convey destination purpose out of context. Prefer descriptive phrases naming the target page or action.",
    code: `<a href="/docs/api">click here</a>`
  },

  
  
  
  {
    id: "css-01",
    category: "css",
    difficulty: "easy",
    type: "scenario",
    question: "A developer wants to center a child both vertically and horizontally inside a container. Which approach is most appropriate in modern CSS?",
    options: [
      "float: left with negative margins",
      "display: flex; align-items: center; justify-content: center",
      "position: absolute; left: 50% only",
      "text-align: center on the child"
    ],
    correctAnswer: 1,
    explanation: "Flexbox centering with align-items and justify-content is the standard, robust approach for one-axis or both-axis centering of a child.",
    code: null
  },
  {
    id: "css-02",
    category: "css",
    difficulty: "medium",
    type: "conceptual",
    question: "Which selector has the highest specificity?",
    options: ["div.card", "#hero", ".card.featured", "article > p"],
    correctAnswer: 1,
    explanation: "IDs outweigh classes and elements. #hero beats class combinations and type/descendant selectors.",
    code: null
  },
  {
    id: "css-03",
    category: "css",
    difficulty: "medium",
    type: "code-output",
    question: "What does gap: 1rem do in this grid?",
    options: [
      "Adds padding inside each item",
      "Sets spacing between grid rows and columns",
      "Sets the outer margin of the container",
      "Creates a 1rem border on the grid"
    ],
    correctAnswer: 1,
    explanation: "gap controls gutters between tracks in Grid (and Flexbox), not padding inside items or outer margin.",
    code: `.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}`
  },
  {
    id: "css-04",
    category: "css",
    difficulty: "hard",
    type: "debugging",
    question: "An absolutely positioned child is not covering its parent. The parent has no position set. What is the likely cause?",
    options: [
      "Absolute positioning always uses the viewport",
      "The containing block is not the parent — position relative/absolute/fixed/sticky was never set on an ancestor",
      "z-index is required for absolute elements",
      "display: block disables absolute positioning"
    ],
    correctAnswer: 1,
    explanation: "position: absolute is relative to the nearest positioned ancestor. Without one, it uses the initial containing block (often the viewport).",
    code: `.parent {  }
.child { position: absolute; inset: 0; }`
  },
  {
    id: "css-05",
    category: "css",
    difficulty: "easy",
    type: "multiple-choice",
    question: "Which pseudo-element is commonly used to insert generated content before an element’s content?",
    options: ["::before", "::first-line", "::marker", "::backdrop"],
    correctAnswer: 0,
    explanation: "::before creates a pseudo-element as the first child of the selected element, often for icons or decorative content.",
    code: null
  },
  {
    id: "css-06",
    category: "css",
    difficulty: "medium",
    type: "scenario",
    question: "You need a two-column layout that collapses to one column under 768px. What is the cleanest approach?",
    options: [
      "JavaScript measuring window.innerWidth on scroll",
      "CSS Grid/Flex with a max-width media query",
      "Multiple duplicate HTML trees for each breakpoint",
      "zoom property on <html>"
    ],
    correctAnswer: 1,
    explanation: "Responsive layout belongs in CSS via Grid/Flex and media queries (or container queries), not by cloning markup or measuring on scroll.",
    code: null
  },
  {
    id: "css-07",
    category: "css",
    difficulty: "hard",
    type: "conceptual",
    question: "What creates a new stacking context?",
    options: [
      "Any element with display: block",
      "An element with position: relative and z-index other than auto (among other conditions)",
      "Only <html> and <body>",
      "Elements with visibility: hidden"
    ],
    correctAnswer: 1,
    explanation: "Stacking contexts form under specific conditions — e.g. positioned elements with z-index not auto, opacity < 1, transforms, etc.",
    code: null
  },
  {
    id: "css-08",
    category: "css",
    difficulty: "medium",
    type: "code-output",
    question: "What is the computed width contribution of flex: 1 1 0% on a flex item (simplified)?",
    options: [
      "It cannot shrink",
      "It can grow and shrink from a zero flex basis, sharing free space",
      "It is always 100% of the container",
      "It disables flexbox on the parent"
    ],
    correctAnswer: 1,
    explanation: "flex: 1 1 0% means grow and shrink equally from a 0% basis, so free space is distributed proportionally among siblings.",
    code: `.item { flex: 1 1 0%; }`
  },
  {
    id: "css-09",
    category: "css",
    difficulty: "easy",
    type: "conceptual",
    question: "What do custom properties (CSS variables) enable?",
    options: [
      "Server-side rendering only",
      "Reusable, cascade-aware values that can be updated at runtime",
      "Automatic vendor prefixing",
      "Replacing all media queries"
    ],
    correctAnswer: 1,
    explanation: "Custom properties inherit and can be redefined on subtrees or via JavaScript, enabling theming and shared design tokens.",
    code: null
  },
  {
    id: "css-10",
    category: "css",
    difficulty: "hard",
    type: "debugging",
    question: "A transition on height from 0 to auto does not animate smoothly. Why?",
    options: [
      "height cannot be transitioned between auto and a length reliably",
      "Transitions only work on colors",
      "You must use !important",
      "display: none is required to animate"
    ],
    correctAnswer: 0,
    explanation: "Browsers cannot interpolate to/from height: auto. Techniques include max-height, grid 0fr/1fr, or WAAPI/JS measurement.",
    code: `.panel {
  height: 0;
  transition: height 0.3s;
}
.panel.open { height: auto; }`
  },
  {
    id: "css-11",
    category: "css",
    difficulty: "medium",
    type: "multiple-choice",
    question: "Which property controls whether an element establishes a block formatting context that contains floats?",
    options: ["float", "overflow (e.g. auto/hidden)", "letter-spacing", "list-style"],
    correctAnswer: 1,
    explanation: "overflow values other than visible (among other methods) create a BFC that contains floated descendants.",
    code: null
  },
  {
    id: "css-12",
    category: "css",
    difficulty: "easy",
    type: "scenario",
    question: "You want subtle hover feedback on a button without layout shift. What should you prefer?",
    options: [
      "Changing border-width from 0 to 4px",
      "Transform/opacity or box-shadow changes",
      "Adding 20px margin on hover",
      "Switching display from inline to block"
    ],
    correctAnswer: 1,
    explanation: "Transforms, opacity, and shadows typically avoid reflow. Changing border, margin, or display often causes layout shift.",
    code: null
  },
  {
    id: "css-13",
    category: "css",
    difficulty: "hard",
    type: "code-output",
    question: "In this Grid definition, what does minmax(0, 1fr) help prevent?",
    options: [
      "Grid items overflowing due to min-content sizing defaults",
      "All media queries from applying",
      "Flexbox from working on children",
      "z-index from creating stacking contexts"
    ],
    correctAnswer: 0,
    explanation: "Tracks default to a minimum of auto (min-content), which can overflow. minmax(0, 1fr) allows tracks to shrink below content size.",
    code: `.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}`
  },
  {
    id: "css-14",
    category: "css",
    difficulty: "medium",
    type: "conceptual",
    question: "What does position: sticky require to work as expected?",
    options: [
      "A threshold (top/right/bottom/left) and room to stick within a scrolling ancestor",
      "z-index: 9999 always",
      "display: flex on the element",
      "JavaScript IntersectionObserver"
    ],
    correctAnswer: 0,
    explanation: "Sticky positioning needs an inset threshold and a scroll container; overflow: hidden on ancestors can prevent sticking.",
    code: null
  },
  {
    id: "css-15",
    category: "css",
    difficulty: "easy",
    type: "multiple-choice",
    question: "Which unit is relative to the root element’s font-size?",
    options: ["em", "rem", "vh", "ch"],
    correctAnswer: 1,
    explanation: "rem is relative to the root (html) font-size; em is relative to the element’s own (or inherited) font-size.",
    code: null
  },
  {
    id: "css-16",
    category: "css",
    difficulty: "hard",
    type: "scenario",
    question: "You need an animation that runs once when an element enters the page. Which approach fits?",
    options: [
      "animation with animation-iteration-count: 1 (or omit infinite)",
      "transition on :root only",
      "position: fixed keyframes",
      "filter: blur as a replacement for animation"
    ],
    correctAnswer: 0,
    explanation: "CSS animations run based on iteration-count. Default is 1; use infinite only when continuous motion is intended.",
    code: null
  },
  {
    id: "css-17",
    category: "css",
    difficulty: "medium",
    type: "debugging",
    question: "text-overflow: ellipsis is not showing. Which condition is commonly missing?",
    options: [
      "overflow: hidden and a constrained width (plus white-space: nowrap for single-line)",
      "display: flex on the same element always",
      "color: transparent",
      "font-weight: 900"
    ],
    correctAnswer: 0,
    explanation: "Ellipsis requires overflow clipping, typically nowrap for single-line, and a defined max width so text actually overflows.",
    code: `.title {
  text-overflow: ellipsis;
  
}`
  },
  {
    id: "css-18",
    category: "css",
    difficulty: "medium",
    type: "conceptual",
    question: "What is the main advantage of container queries over viewport media queries?",
    options: [
      "They style based on a parent container’s size, enabling component-level responsiveness",
      "They replace JavaScript entirely",
      "They only work in Internet Explorer",
      "They disable specificity rules"
    ],
    correctAnswer: 0,
    explanation: "Container queries let components adapt to their allocated space rather than the whole viewport — ideal for reusable UI.",
    code: null
  },
  {
    id: "css-19",
    category: "css",
    difficulty: "easy",
    type: "code-output",
    question: "What does box-sizing: border-box change?",
    options: [
      "Width includes padding and border within the declared size",
      "Margins collapse twice as fast",
      "Flex items cannot shrink",
      "Outline is drawn inside the border"
    ],
    correctAnswer: 0,
    explanation: "With border-box, the specified width/height include padding and border, making layout math more predictable.",
    code: `*, *::before, *::after {
  box-sizing: border-box;
}`
  },
  {
    id: "css-20",
    category: "css",
    difficulty: "hard",
    type: "scenario",
    question: "A fixed header overlaps content when focus moves to an in-page anchor. What CSS feature helps?",
    options: [
      "scroll-padding-top (or scroll-margin on targets)",
      "pointer-events: none on the header",
      "zoom: 1",
      "table-layout: fixed"
    ],
    correctAnswer: 0,
    explanation: "scroll-padding-top on the scroll container (or scroll-margin on targets) offsets scroll position so anchored content clears sticky/fixed headers.",
    code: null
  },

  
  
  
  {
    id: "js-01",
    category: "javascript",
    difficulty: "easy",
    type: "code-output",
    question: "What does this code log?",
    options: ["undefined", "2", "ReferenceError", "null"],
    correctAnswer: 1,
    explanation: "The inner function closes over x from the outer scope. After create() runs, x remains 2 in the closure.",
    code: `function create() {
  let x = 2;
  return function () {
    return x;
  };
}
const fn = create();
console.log(fn());`
  },
  {
    id: "js-02",
    category: "javascript",
    difficulty: "medium",
    type: "code-output",
    question: "What is the result of this expression?",
    options: ["[1, 2, 3, 4]", "[1, 2, [3, 4]]", "Error", "[1, 2, 3], 4"],
    correctAnswer: 0,
    explanation: "The spread operator expands iterable elements into the new array, flattening one level for [3, 4].",
    code: `const a = [1, 2];
const b = [...a, ...[3, 4]];
console.log(b);`
  },
  {
    id: "js-03",
    category: "javascript",
    difficulty: "medium",
    type: "conceptual",
    question: "What is event delegation?",
    options: [
      "Attaching one listener on a parent to handle events from descendant targets",
      "Removing all listeners automatically after click",
      "Using inline onclick only",
      "Preventing the capture phase forever"
    ],
    correctAnswer: 0,
    explanation: "Delegation uses bubbling: a single parent listener inspects event.target, efficient for dynamic lists.",
    code: null
  },
  {
    id: "js-04",
    category: "javascript",
    difficulty: "hard",
    type: "code-output",
    question: "What does this log?",
    options: ["1 then 2", "2 then 1", "1 only", "2 only"],
    correctAnswer: 1,
    explanation: "Promise callbacks are microtasks and run before the next macrotask. The resolved promise’s then runs before setTimeout.",
    code: `setTimeout(() => console.log(1), 0);
Promise.resolve().then(() => console.log(2));`
  },
  {
    id: "js-05",
    category: "javascript",
    difficulty: "easy",
    type: "multiple-choice",
    question: "Which method creates a new array with the results of calling a function on every element?",
    options: ["forEach", "map", "reduce", "find"],
    correctAnswer: 1,
    explanation: "map transforms each element and returns a new array. forEach is for side effects; reduce aggregates; find returns one match.",
    code: null
  },
  {
    id: "js-06",
    category: "javascript",
    difficulty: "medium",
    type: "debugging",
    question: "Why does this often log 3, 3, 3?",
    options: [
      "var i is function-scoped; all callbacks share the final i",
      "setTimeout cannot run in loops",
      "console.log is asynchronous only with let",
      "Arrays are zero-indexed incorrectly"
    ],
    correctAnswer: 0,
    explanation: "With var, there is one loop variable. By the time timeouts run, i is 3. Use let (block scope) or bind the value per iteration.",
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`
  },
  {
    id: "js-07",
    category: "javascript",
    difficulty: "hard",
    type: "scenario",
    question: "You need to read a value from localStorage and fall back if missing or invalid JSON. What is a sound pattern?",
    options: [
      "JSON.parse without try/catch and assume success",
      "Try/catch around getItem + JSON.parse with a default",
      "Use document.cookie only",
      "Store functions directly in localStorage"
    ],
    correctAnswer: 1,
    explanation: "localStorage stores strings; JSON.parse can throw. Guard with try/catch and provide defaults for missing/corrupt data.",
    code: null
  },
  {
    id: "js-08",
    category: "javascript",
    difficulty: "easy",
    type: "code-output",
    question: "What is logged?",
    options: ["{ a: 1, b: 2 }", "{ a: 1 }", "Error", "undefined"],
    correctAnswer: 0,
    explanation: "Object destructuring with rest collects remaining enumerable own properties into a new object.",
    code: `const obj = { a: 1, b: 2, c: 3 };
const { c, ...rest } = obj;
console.log(rest);`
  },
  {
    id: "js-09",
    category: "javascript",
    difficulty: "medium",
    type: "conceptual",
    question: "In a regular function used as a DOM event handler, what does this refer to (non-arrow)?",
    options: [
      "The element the handler is bound to",
      "Always window",
      "Always undefined in browsers",
      "The event object"
    ],
    correctAnswer: 0,
    explanation: "For a normal function event listener, this is the current target element. Arrow functions inherit this lexically instead.",
    code: null
  },
  {
    id: "js-10",
    category: "javascript",
    difficulty: "hard",
    type: "code-output",
    question: "What does await do inside an async function when the promise rejects?",
    options: [
      "Returns undefined quietly",
      "Throws, which you can catch with try/catch",
      "Retries indefinitely",
      "Converts the rejection to null"
    ],
    correctAnswer: 1,
    explanation: "await on a rejected promise throws at that line. Wrap in try/catch or let the async function return a rejected promise.",
    code: `async function load() {
  try {
    await Promise.reject(new Error("fail"));
  } catch (e) {
    return "handled";
  }
}`
  },
  {
    id: "js-11",
    category: "javascript",
    difficulty: "medium",
    type: "scenario",
    question: "You need the sum of numbers in an array. Which approach is idiomatic?",
    options: [
      "reduce with an accumulator",
      "map that mutates a global",
      "forEach that returns the sum",
      "filter with addition"
    ],
    correctAnswer: 0,
    explanation: "reduce is designed for aggregating values into a single result, such as a sum.",
    code: `const nums = [1, 2, 3];
const total = nums.reduce((sum, n) => sum + n, 0);`
  },
  {
    id: "js-12",
    category: "javascript",
    difficulty: "easy",
    type: "conceptual",
    question: "What is hoisting in JavaScript?",
    options: [
      "Moving DOM nodes to <head>",
      "Declarations being available in their scope before the line where they appear (with TDZ rules for let/const)",
      "Automatically sorting imports",
      "Lazy-loading images"
    ],
    correctAnswer: 1,
    explanation: "var/function declarations are hoisted; let/const are hoisted but temporal dead zone prevents use before initialization.",
    code: null
  },
  {
    id: "js-13",
    category: "javascript",
    difficulty: "hard",
    type: "debugging",
    question: "Why might optional chaining help here without throwing?",
    options: [
      "user?.profile?.name short-circuits if an intermediate value is nullish",
      "It converts all values to strings",
      "It deep-clones user",
      "It freezes the object"
    ],
    correctAnswer: 0,
    explanation: "?. stops evaluation and yields undefined when the base is null or undefined, avoiding TypeError on property access.",
    code: `const name = user?.profile?.name;`
  },
  {
    id: "js-14",
    category: "javascript",
    difficulty: "medium",
    type: "code-output",
    question: "What does Array.prototype.filter return when no elements match?",
    options: ["null", "undefined", "[]", "false"],
    correctAnswer: 2,
    explanation: "filter always returns a new array — empty if nothing matched.",
    code: `[1, 2, 3].filter((n) => n > 10);`
  },
  {
    id: "js-15",
    category: "javascript",
    difficulty: "easy",
    type: "multiple-choice",
    question: "Which statement correctly imports a named export in ES modules?",
    options: [
      'import { fetchUser } from "./api.js"',
      'include fetchUser from "./api.js"',
      'require { fetchUser } "./api.js"',
      'using fetchUser from api'
    ],
    correctAnswer: 0,
    explanation: "ESM named imports use import { name } from \"module\". require is CommonJS.",
    code: null
  },
  {
    id: "js-16",
    category: "javascript",
    difficulty: "hard",
    type: "scenario",
    question: "You attach listeners inside a render loop and the UI gets slower over time. What is the likely issue?",
    options: [
      "Listener accumulation / leaks from not removing or using delegation",
      "CSS specificity wars",
      "Too many rem units",
      "Using const instead of var"
    ],
    correctAnswer: 0,
    explanation: "Re-binding listeners every render without cleanup multiplies handlers. Prefer delegation or removeEventListener / AbortController.",
    code: null
  },
  {
    id: "js-17",
    category: "javascript",
    difficulty: "medium",
    type: "code-output",
    question: "What is the value of result?",
    options: ["3", "\"12\"", "\"3\"", "NaN"],
    correctAnswer: 1,
    explanation: "With +, if either operand is a string, concatenation occurs: 1 + \"2\" => \"12\".",
    code: `const result = 1 + "2";`
  },
  {
    id: "js-18",
    category: "javascript",
    difficulty: "easy",
    type: "conceptual",
    question: "What does Promise.all settle to when one input promise rejects?",
    options: [
      "Rejects with that reason (fail-fast)",
      "Ignores rejections",
      "Always resolves to []",
      "Waits only for the rejected one"
    ],
    correctAnswer: 0,
    explanation: "Promise.all rejects as soon as any promise rejects. Use allSettled when you need every outcome.",
    code: null
  },
  {
    id: "js-19",
    category: "javascript",
    difficulty: "hard",
    type: "code-output",
    question: "What does this return?",
    options: ["[2, 4]", "[1, 2, 3, 4]", "[1, 3]", "Error"],
    correctAnswer: 0,
    explanation: "filter keeps even numbers; map is not used. [1,2,3,4] filtered by n % 2 === 0 yields [2, 4].",
    code: `const result = [1, 2, 3, 4]
  .filter((n) => n % 2 === 0);
console.log(result);`
  },
  {
    id: "js-20",
    category: "javascript",
    difficulty: "medium",
    type: "scenario",
    question: "A modal should close on Escape and return focus to the opener. Which practice is essential?",
    options: [
      "Store previously focused element and restore it on close; listen for keydown Escape",
      "Use alert() for modals",
      "Remove all tabindex from the page",
      "Disable the keyboard entirely"
    ],
    correctAnswer: 0,
    explanation: "Accessible modal UX includes focus trap/management, Escape to dismiss, and restoring focus to the invoking control.",
    code: null
  }
];


const CATEGORY_META = {
  html: {
    id: "html",
    name: "HTML",
    subtitle: "Structure & Semantics",
    description: "Semantic markup, accessibility, forms, and document structure.",
    icon: "html"
  },
  css: {
    id: "css",
    name: "CSS",
    subtitle: "Layout & Styling",
    description: "Flexbox, Grid, specificity, responsive design, and modern layout.",
    icon: "css"
  },
  javascript: {
    id: "javascript",
    name: "JavaScript",
    subtitle: "Logic & Interactivity",
    description: "Scope, async patterns, DOM, and language fundamentals.",
    icon: "js"
  },
  mixed: {
    id: "mixed",
    name: "Mixed",
    subtitle: "Complete Web Challenge",
    description: "A balanced assessment across HTML, CSS, and JavaScript.",
    icon: "mixed"
  }
};
