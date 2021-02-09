// GLOBAL VARIABLES
let storeLocation;

// UNIVERSAL SETUP
const setPage = () => {
  const path = window.location.pathname;
  if (path.includes("store")) {
    // console.log("store");
    shopify();
    starburst();
  } else if (path.includes("lab")) {
    // console.log("lab");
  } else if (path.includes("delivery")) {
    // console.log("delivery");
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
};

const addToCart = (item) => {
  const id = item.getAttribute("data-id");
  console.log(`addToCart -> id`, id);
  alert("add to cart isn't quite built in this environment yet...");
  const $headerCart = document.querySelector(".header-cart");
  const currentVal = parseInt($headerCart.textContent);
  $headerCart.textContent = currentVal + 1;
}

const starburst = () => {
  console.log(`\nstarburst is running`);
  const $el = document.querySelector(".p-drinksdrinksdrinks");
  $el.style.position = "relative";
  const $starburst = document.createElement("div");
    $starburst.classList.add("starburst");
    console.log(`starburst -> $el`, $el);
  const $starText = document.createElement("p");
    $starText.textContent = "need a drink?";
  $starburst.append($starText);
  $el.prepend($starburst);
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
