document.addEventListener("DOMContentLoaded", function() {
    // Select all elements with name="heading"
    const headings = document.getElementsByName("heading");
  
    // Function to wrap each character in a span without breaking existing HTML tags
    function wrapCharactersWithSpans(element) {
      element.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          // If it's a text node, wrap each character in a span
          const text = node.textContent;
          const wrappedText = text.replace(/./g, "<span>$&</span>");
          const spanWrapper = document.createElement('span');
          spanWrapper.innerHTML = wrappedText;
          node.replaceWith(spanWrapper);
        } else {
          // Recursively handle elements (like <u> tags)
          wrapCharactersWithSpans(node);
        }
      });
    }
  
    // Loop through all elements with name="heading" and apply the wrapping/animation
    Array.from(headings).forEach((heading) => {
      wrapCharactersWithSpans(heading);
  
      // Select all the newly created spans for animation
      const chars = heading.querySelectorAll("span span");
  
      // GSAP animation for each character
      gsap.from(chars, {
        opacity: 0,
        y: 50,
        stagger: 0.10,
        repeat:1,
        ease: "power2.out",
        duration: 3
      });
    });
  });
  

