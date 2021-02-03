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
  } else { // default location is store
    // console.log("store");
    buildIndexGrid();
    // horizontalScroll();
  }
}

const classify = () => {
  // add classes/ids based on inner text of headings
  const $h1s = document.querySelectorAll("h1");
  const $h2s = document.querySelectorAll("h2");
  const $h3s = document.querySelectorAll("h3");
  const $headings = [ $h1s, $h2s, $h3s ];

  $headings.forEach((headings) => {
    if (headings) {
      // console.log(`$headings.forEach -> headings`, headings);
      headings.forEach((h) => {
        const text = cleanName(h.textContent);
        h.setAttribute("class", text); // attach class to heading
        h.parentNode.setAttribute("id", text); // attach id to parrent
      })
    }
  })
  
}

const cleanName = (str) => {
  const clean = str.split(" ").join("") // remove spaces
    .toLowerCase()
    .replace(/[^0-9a-z]/gi, ''); // replace non alpha-numeric
  return clean;
}

const buildIndexGrid = () => {
  // console.log(`\nbuild index grid running`);
  const indexPaths = [ "/", "/index", "/index.html" ];
  if (indexPaths.includes(window.location.pathname)) {
    const $main = document.querySelector("main");
    $main.classList.add("flex");
  }
}

const updateCopyright = () => {
  // update copyright year in footer
  const date = new Date; 
  const year = date.getFullYear();
  const $footer = document.querySelector("footer > div");
  if (year > 2021) {
    $footer.textContent += ` - ${year}`;
  }
}

// const horizontalScroll = () => {
//   const $carousel = document.querySelector(".embed-internal-carousel");
//   if ($carousel) {
//     console.log(`horizontalScroll -> $carousel`, $carousel);
//     $carousel.onwheel = (e) => {
//       console.log(`horizontalScroll -> $carousel.onwheel`);
//       e.preventDefault();
//       this.scrollLeft -= (e.wheelDelta);
//     }
//   }
// }

window.onload = (event) => {
  console.log("page is fully loaded");

  setPage();
  classify();
  updateCopyright();
};
