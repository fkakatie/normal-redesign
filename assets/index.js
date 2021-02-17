// GLOBAL VARIABLES
let storeLocation;

// UNIVERSAL SETUP
const setPage = () => {
  const path = window.location.pathname;
  if (path.includes("store")) {
    // console.log("store");
    shopify();
    drinksStarburst();
    setupCarousels();
  } else if (path.includes("lab")) {
    // console.log("lab");
    shopify();
    drinksStarburst();
    setupCarousels();
  } else if (path.includes("delivery")) {
    // console.log("delivery");
    shopify();
    drinksStarburst();
    setupCarousels();
  } else if (path.includes("pint-club")) {
    // console.log("merch");
  } else if (path.includes("merch")) {
    // console.log("pint-club");
  } else {
    // default location is store
    console.log("index");
    buildIndexGrid();
  }
};

const classify = () => {
  // set path as main element's id
  const path = window.location.pathname.includes(".")
    ? cleanName(window.location.pathname.split(".")[0])
    : cleanName(window.location.pathname) || "index";
  const $main = document.querySelector("main");
  $main.setAttribute("id", path);
  // add classes/ids based on inner text of headings
  const $h1s = document.querySelectorAll("h1");
  const $h2s = document.querySelectorAll("h2");
  const $headings = [ $h1s, $h2s ];

  $headings.forEach((headings) => {
    if (headings) {
      // console.log(`$headings.forEach -> headings`, headings);
      headings.forEach((h) => {
        const text = cleanName(h.textContent);
        h.setAttribute("class", text); // attach class to heading
        h.parentNode.classList.add(`p-${text}`); // attach class to parent
      });
    }
  });
};

const codify = () => {
  const $code = document.querySelectorAll("code");
  if ($code) {
    $code.forEach((c, i) => {
      const [ key, value ] = c.textContent.split(": ");
      const [ style, color ] = value.split(" ");
      const $parent = $code[i].parentNode.parentNode.parentNode.parentNode.parentNode;
      $parent.classList.add(style);
      $parent.setAttribute("data-primary", color);
    })
  }
  colorize();
}

const colorize = () => {
  const $primary = document.querySelectorAll("[data-primary]");
  if ($primary) {
    $primary.forEach((el) => {
      const color = el.getAttribute("data-primary");
      const invert = getColorMatch(color);
      const classes = [ ...el.classList ];
      if (classes.includes("filled")) {
        el.style.backgroundColor = `var(--${color})`;
        el.style.borderColor = `var(--${color})`;
        el.style.color = `var(--${invert})`;
      } else if (classes.includes("outline")) {
        el.style.color = `var(--${color})`;
        el.style.borderColor = `var(--${color})`;
        el.style.color = `var(--${color})`;
      }
    })
  }
}

// INDEX
const buildIndexGrid = () => {
  console.log(`\nbuild index grid running`);
  const indexPaths = ["/", "/index", "/index.html"];
  if (indexPaths.includes(window.location.pathname)) {
    const $main = document.querySelector("main");
    const carouselHeight = parseInt(
      document.querySelector("#carousel").offsetHeight
    );
    $main.style.minHeight = `${
      carouselHeight > 0 ? carouselHeight + 32 : 697
    }px`;
    const $carousel = document.querySelector(".embed-internal-carousel");
    if ($carousel) {
      // set horizonal scroll on carousel
      $carousel.onwheel = (e) => {
        if (e.wheelDelta < 0) {
          $carousel.scrollLeft += 468;
        } else {
          $carousel.scrollLeft -= 468;
        }
      };
    }
  }
};

// STOREFRONTS
const shopify = () => {
  const squarePrefix = "https://squareup.com/dashboard/items/library/";
  const $as = document.querySelectorAll("main a");
  if ($as) {
    $as.forEach((a) => {
      const href = a.getAttribute("href");
      if (href.includes(squarePrefix)) {
        const id = href.substr(squarePrefix.length);
        a.setAttribute("data-id", id);
        a.setAttribute("onclick", "addToCart(this)");
        a.removeAttribute("href");
        a.classList.add("btn");
      }
    });
  }
};

const addToCart = (item) => {
  const id = item.getAttribute("data-id");
  console.log(`addToCart -> id`, id);
  alert("add to cart isn't quite built in this environment yet...");
  const $headerCart = document.querySelector(".header-cart");
  const currentVal = parseInt($headerCart.textContent);
  $headerCart.textContent = currentVal + 1;
}

const drinksStarburst = () => {
  const $el = document.querySelector(".p-drinksdrinksdrinks");
  if ($el) {
    $el.style.position = "relative";
    const $starburst = document.createElement("div");
      $starburst.classList.add("starburst", "starburst-unclicked");
    const $starSpin = document.createElement("div");
      $starSpin.classList.add("starburst-spin")
    const $starText = document.createElement("p");
      $starText.classList.add("starburst-text")
      $starText.textContent = "need a drink?";
    $starburst.append($starSpin);
    $starburst.append($starText);

    $starburst.onclick = (e) => {
      e.preventDefault();
      const $el = document.querySelector(".p-drinksdrinksdrinks");
      const $target = document.querySelector(".starburst");
      if ([ ...$target.classList ].includes("starburst-unclicked")) {
        $target.classList.remove("starburst-unclicked");
        $target.classList.add("starburst-clicked");
        $el.classList.remove("hide");
      } else {
        $target.classList.remove("starburst-clicked");
        $target.classList.add("starburst-unclicked");
        $el.classList.add("hide");
      }
    }
    $el.before($starburst);
    $el.classList.add("hide");
  }
}

// STOREFRONT CAROUSELS
const setupCarousels = ($el) => {  
  const $carousels = document.querySelectorAll("div.embed-internal");
  // console.log(`showSlides -> $carousels`, $carousels);

  if ($carousels) {
    // setup carousels
    $carousels.forEach((c) => {
      const title = [ ...c.classList ].filter((name) => {
        return name !== "embed" && name !== "embed-internal" && name !== "embed-internal-";
      })[0].split("-").slice(-1).pop();
      c.setAttribute("data-title", title);

      const $prevBtn = document.createElement("button");
        $prevBtn.classList.add("btn-carousel", "btn-carousel-prev");
        $prevBtn.setAttribute("data-title", title);
        $prevBtn.textContent = "⟵";
        $prevBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          // console.log(e.target.getAttribute("data-title"));
          shiftSlides(e.target.getAttribute("data-title"), "prev");
        }
      const $nextBtn = document.createElement("button");
        $nextBtn.classList.add("btn-carousel", "btn-carousel-next");
        $nextBtn.setAttribute("data-title", title);
        $nextBtn.textContent = "⟶";
        $nextBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          // console.log(e.target.getAttribute("data-title"));
          shiftSlides(e.target.getAttribute("data-title"), "next");
        }

      c.prepend($prevBtn);
      c.prepend($nextBtn);

      // get title of carousel by extrapolating classes
      const $slides = c.querySelectorAll("div");

      if ($slides.length % 2 === 0) {
        c.classList.add("carousel-even");
      } else {
        c.classList.add("carousel-odd");
      }

      // setup slides inside carousels
      if ($slides) {
        $slides.forEach((s, i) => {
          s.setAttribute("data-index", i + 1);
          s.setAttribute("data-title", title);
          s.classList.add("carousel-slide");
        })
      }
    })
  }

}

const shiftSlides = (title, direction) => {
  const $thisCarousel = document.querySelector(`div.embed-internal-${title}`);
  const $theseSlides = [ ...$thisCarousel.querySelectorAll("div") ];
  while ($thisCarousel.lastChild.nodeName === "div") {
    $thisCarousel.removeChild($thisCarousel.lastChild);
  }
  if ($theseSlides) {
    const $first = $theseSlides[0];
    const $last = $theseSlides[$theseSlides.length - 1];
    if (direction === "prev") {
      $theseSlides.splice(-1, 1);
      $theseSlides.unshift($last);
      
    } else if (direction === "next") {
      $theseSlides.splice(1, 1);
      $theseSlides.push($first);
    }
  }
  $theseSlides.forEach((s) => {
    $thisCarousel.append(s);
  })
}

// HEADER
const testCart = () => {
  const $headerCart = document.querySelector(".header-cart");
  $headerCart.textContent = randomNum(0, 9);
};

// FOOTER
const updateCopyright = () => {
  // update copyright year in footer
  const date = new Date();
  const year = date.getFullYear();
  const $footer = document.querySelector("footer > div");
  if (year > 2021) {
    $footer.textContent += ` - ${year}`;
  }
};

// UTILITIES
const cleanName = (str) => {
  const clean = str
    .split(" ").join("") // remove spaces
    .toLowerCase()
    .replace(/[^0-9a-z]/gi, ""); // replace non alpha-numeric
  return clean;
};

const getColorMatch = (color) => {
  switch (color) {
    case "blue":
      return "white";
    case "white":
    case "pink":
      return "blue";
    default:
      return null;
  }
}

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.onload = (event) => {
  classify();
  codify();
  testCart();
  setPage();
  updateCopyright();
};
