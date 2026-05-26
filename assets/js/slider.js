document.addEventListener("DOMContentLoaded", function () {
  ["#main-slider", "#mobile-slider"].forEach(function (selector) {
    var root = document.querySelector(selector);
    if (!root) return;

    var splide = new Splide(selector, {
      type: "loop", // Use 'loop' for continuous navigation
      rewind: false, // Keep rewind false because loop handles continuous movement
      arrows: true, // Keep the arrows for navigation (we will style them)
      pagination: false, // Explicitly hide the default Splide dots
      speed: 500, // Match the transition speed to the CSS transition
      autoHeight: true, // Adjust slider height dynamically based on active slide content
    });

    var bar = splide.root.querySelector(".my-slider-progress-bar");

    splide.on("mounted move", function () {
      if (!bar) return;
      var end = splide.Components.Controller.getEnd() + 1;
      var currentIndex = splide.index % end;
      var percentage = String(100 * (currentIndex + 1) / end) + "%";
      bar.style.width = percentage;
    });

    splide.mount();
  });
});
