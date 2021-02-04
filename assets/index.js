// GLOBAL VARIABLES
let storeLocation;

const setPage = () => {
  const path = window.location.pathname;
  if (path.includes("lab")) {
    // console.log("lab");
  } else if (path.includes("delivery")) {
    // console.log("delivery");
  } else if (path.includes("pint-club")) {
    // console.log("merch");
  } else if (path.includes("merch")) {
    // console.log("pint-club");
  } else {
    // default location is store
    // console.log("store");
    buildIndexGrid();
  }
};

const classify = () => {
  // set path as main element's id
  const path = window.location.pathname.includes(".") ? 
    cleanName(window.location.pathname.split(".")[0]) : 
    cleanName(window.location.pathname) || "index";
  const $main = document.querySelector("main");
  $main.setAttribute("id", path);
  // add classes/ids based on inner text of headings
  const $h1s = document.querySelectorAll("h1");
  const $h2s = document.querySelectorAll("h2");
  const $h3s = document.querySelectorAll("h3");
  const $headings = [$h1s, $h2s, $h3s];

  $headings.forEach((headings) => {
    if (headings) {
      // console.log(`$headings.forEach -> headings`, headings);
      headings.forEach((h) => {
        const text = cleanName(h.textContent);
        h.setAttribute("class", text); // attach class to heading
        h.parentNode.setAttribute("id", text); // attach id to parent
      });
    }
  });
};

const cleanName = (str) => {
  const clean = str
    .split(" ")
    .join("") // remove spaces
    .toLowerCase()
    .replace(/[^0-9a-z]/gi, ""); // replace non alpha-numeric
  return clean;
};

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const buildIndexGrid = () => {
  // console.log(`\nbuild index grid running`);
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
    if ($carousel) { // set horizonal scroll on carousel
      $carousel.onwheel = (e) => {
        if (e.wheelDelta < 0) {
          document.querySelector(".embed-internal-carousel").scrollLeft += 468;
        } else {
          document.querySelector(".embed-internal-carousel").scrollLeft -= 468;
        }
      };
    }
  }
};

const testCart = () => {
  const $headerCart = document.querySelector(".header-cart");
  $headerCart.textContent = randomNum(0, 9);
}

const updateCopyright = () => {
  // update copyright year in footer
  const date = new Date();
  const year = date.getFullYear();
  const $footer = document.querySelector("footer > div");
  if (year > 2021) {
    $footer.textContent += ` - ${year}`;
  }
};

window.onload = (event) => {
  console.log("page is fully loaded");

  classify();
  testCart();
  setPage();
  updateCopyright();
};
