// GLOBAL VARIABLES
let storeLocation;

// UNIVERSAL SETUP
const setPage = () => {
  const path = window.location.pathname;
  if (path.includes("order")) {
    // console.log("order");
    buildOrderPage();
  } else if (path.includes("store")) {
    // console.log("store");
    shopify();
    // drinksStarburst();
    // setupCarousels();
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
  } else if (path.includes("about")) {
    // console.log("about page");
    buildLocationsGrid();
    setupAboutAnchors();
    fetchProductLocations();
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
  const $headings = [$h1s, $h2s];

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
      const [key, values] = c.textContent.split(": ");
      // console.log(`$code.forEach -> key, values`, key, values);
      if (key === "theme") {
        setPageTheme(values); // set theme class on body
      } else if (key === "style") {
        // console.log(values);
        setBlockStyle(c, values);
      } else if (key === "color") {
        setBlockTheme(c, values); // set theme class on parent
      } else if (key === "code") {
        switch (values) {
          case "search":
            return buildProductSearch(c);
          default:
            break;
        }
        console.log("does this work?");
      }
    });
  }
};

const setPageTheme = (color) => {
  const $body = document.querySelector("body");
  const configuredColors = ["blue", "pink", "yellow"];
  if (configuredColors.includes(color)) {
    $body.classList.add(`theme-${color}`);
  } else {
    $body.classList.add(`theme-${white}`);
  }
};

const setBlockTheme = ($el, color) => {
  const $parent = $el.parentNode.parentNode.parentNode.parentNode.parentNode;
  const configuredColors = ["blue", "pink", "yellow"];
  if (configuredColors.includes(color)) {
    $parent.classList.add(`theme-${color}`);
  } else {
    $parent.classList.add("theme-white");
  }
};

const setBlockStyle = ($el, style) => {
  const $parent = $el.parentNode.parentNode.parentNode.parentNode.parentNode;
  const configuredStyles = ["outline"];
  if (configuredStyles.includes(style)) {
    $parent.classList.add(`theme-${style}`);
  }
};

// FETCHING DATA
const fetchLabels = async () => {
  const resp = await fetch("/labels.json");
  let json = await resp.json();
  if (json.data) {
    json = json.data;
  }
  window.labels = {};
  json.forEach((j) => {
    window.labels[j.key] = j.value;
  });
  console.log(window.labels);
  return window.labels;
};

const fetchProductLocations = async () => {
  if (!window.productLocations) {
    const resp = await fetch("/product-locations.json");
    let json = await resp.json();
    if (json.data) {
      json = json.data;
    }
    window.productLocations = json;
  }
  return window.productLocations;
};

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

// ORDER PAGE
const buildOrderPage = () => {
  const showOrderBlock = (e) => {
    // console.log(`show order block running`);
    const $parent = e.target.closest("p");
    if ($parent) {
      const target = $parent.getAttribute("data-target");

      const showThis = document.querySelector(`.p-${target}`);
      const thisTheme = showThis.classList[1];
      const $body = document.querySelector("body");
      $body.classList.add(thisTheme);
      showThis.classList.add("show-flex");

      const $orderDiv = document.querySelector(".p-order");
      $orderDiv.classList.add("hide");
    }
  };

  const backToOptions = (e) => {
    const $btn = e.target.closest("aside");
    if ($btn) {
      const target = $btn.getAttribute("data-target");
      const theme = $btn.getAttribute("data-theme");

      const hideThis = document.querySelector(`.${target}`);
      hideThis.classList.remove("show-flex");

      const $body = document.querySelector("body");
      $body.classList.remove(theme);

      const $orderDiv = document.querySelector(".p-order");
      $orderDiv.classList.remove("hide");
    }
  };

  const $divs = document.querySelectorAll("main div");
  $divs.forEach((d) => {
    if ([...d.classList].includes("p-order")) {
      const $children = [...d.children];
      $children.forEach((c) => {
        const elName = cleanName(c.textContent.trim());
        c.setAttribute("data-target", elName);
        c.onclick = (e) => {
          showOrderBlock(e);
        };
      });
    } else if (d.classList.length > 1) {
      const $backBtn = document.createElement("aside");
      $backBtn.classList.add("btn-back");
      $backBtn.setAttribute("data-target", d.classList[0]);
      $backBtn.setAttribute("data-theme", d.classList[1]);
      $backBtn.textContent = "back to options";
      $backBtn.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-left"><use href="/icons.svg#arrow-left"></use></svg>`;
      $backBtn.onclick = (e) => {
        backToOptions(e);
      };
      d.prepend($backBtn);
    }
  });
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
};

const drinksStarburst = () => {
  const $el = document.querySelector(".p-drinksdrinksdrinks");
  if ($el) {
    $el.style.position = "relative";
    const $starburst = document.createElement("div");
    $starburst.classList.add("starburst", "starburst-unclicked");
    const $starSpin = document.createElement("div");
    $starSpin.classList.add("starburst-spin");
    const $starText = document.createElement("p");
    $starText.classList.add("starburst-text");
    $starText.textContent = "need a drink?";
    $starburst.append($starSpin);
    $starburst.append($starText);

    $starburst.onclick = (e) => {
      e.preventDefault();
      const $el = document.querySelector(".p-drinksdrinksdrinks");
      const $target = document.querySelector(".starburst");
      if ([...$target.classList].includes("starburst-unclicked")) {
        $target.classList.remove("starburst-unclicked");
        $target.classList.add("starburst-clicked");
        $el.classList.remove("hide");
      } else {
        $target.classList.remove("starburst-clicked");
        $target.classList.add("starburst-unclicked");
        $el.classList.add("hide");
      }
    };
    $el.before($starburst);
    $el.classList.add("hide");
  }
};

// STOREFRONT CAROUSELS
const setupCarousels = ($el) => {
  const $carousels = document.querySelectorAll("div.embed-internal");
  // console.log(`showSlides -> $carousels`, $carousels);

  if ($carousels) {
    // setup carousels
    $carousels.forEach((c) => {
      const title = [...c.classList]
        .filter((name) => {
          return (
            name !== "embed" &&
            name !== "embed-internal" &&
            name !== "embed-internal-"
          );
        })[0]
        .split("-")
        .slice(-1)
        .pop();
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
      };
      const $nextBtn = document.createElement("button");
      $nextBtn.classList.add("btn-carousel", "btn-carousel-next");
      $nextBtn.setAttribute("data-title", title);
      $nextBtn.textContent = "⟶";
      $nextBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log(e.target.getAttribute("data-title"));
        shiftSlides(e.target.getAttribute("data-title"), "next");
      };

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
        });
      }
    });
  }
};

const shiftSlides = (title, direction) => {
  const $thisCarousel = document.querySelector(`div.embed-internal-${title}`);
  const $theseSlides = [...$thisCarousel.querySelectorAll("div")];
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
  });
};

// ABOUT PAGE
const buildLocationsGrid = () => {
  const $locationsBlock = document.querySelector(".p-locations");
  const locationsChildren = [ ...$locationsBlock.children];
  const $flexContainer = document.createElement("section");
    $flexContainer.classList.add("locations-container");

  let tempObj = [];
  let flexItems = [];

  locationsChildren.forEach((c) => {
    if (c.nodeName === "H3") { // start of new block
      tempObj = [];
      tempObj.push(c);
      flexItems.push(tempObj);
    } else if (c.nodeName !== "H2") { // exclude section header
      tempObj.push(c);
    }
  });
  
  flexItems.forEach((item) => {
    const heading = item[0].id;
    const $flexItem = document.createElement("div");
    $flexItem.classList.add("location-item");
    $flexItem.classList.add(heading);
    for (let i = 0; i < item.length; i++) {
      $flexItem.append(item[i]);
    }
    $flexContainer.append($flexItem);
  });
  $locationsBlock.append($flexContainer);
};

const setupAboutAnchors = () => {
  const $downArrows = document.querySelectorAll("svg.icon-arrow-down");
  if ($downArrows) {
    $downArrows.forEach((a) => {
      const $next = a.parentNode.parentNode.parentNode.nextElementSibling;
      const $anchor = a.parentNode;
      if ($next && $anchor) {
        const classList = $next.classList[0].split("p-")[1];
        $next.setAttribute("id", classList);
        $anchor.href = `#${classList}`;
        // setup smooth scroll
        $anchor.onclick = (e) => {
          e.preventDefault();
          const $target = document.getElementById(classList);
          $target.scrollIntoView({ behavior: "smooth" });
        };
      }
    });
  }
};

const buildProductSearch = ($code) => {
  const $parent = $code.parentNode.parentNode.parentNode.parentNode.parentNode;

  const $searchForm = document.createElement("form");
  $searchForm.classList.add("search-form");
  const $inputField = document.createElement("input");
  $inputField.type = "search";
  $inputField.id = "product-search";
  $inputField.placeholder = "enter city or zip code here";
  const $searchBtn = document.createElement("button");
  $searchBtn.textContent = "search";
  $searchForm.onsubmit = (e) => {
    e.preventDefault();
    const $resultsBlock = document.getElementById("product-search-results");
    $resultsBlock.innerHTML = ""; // clear any previous results

    const inputVal = document.getElementById("product-search").value.trim();

    if (inputVal == parseInt(inputVal)) {
      searchByZip(parseInt(inputVal));
    } else if (inputVal) {
      searchByCity(inputVal.toLowerCase());
    }
  };
  const $resultsBlock = document.createElement("section");
  $resultsBlock.id = "product-search-results";

  $searchForm.append($inputField, $searchBtn);
  $parent.append($searchForm, $resultsBlock);
};

const searchByZip = (zip) => {
  const productLocations = window.productLocations;
  let matches = productLocations.filter((l) => {
    return zip === l.zip;
  });
  if (!matches.length) {
    /// fuzzier zip search
    matches = productLocations.filter((l) => {
      return l.zip >= zip - 10 && l.zip <= zip + 10;
    });
  }
  populateSearchResults(matches, "zip", zip);
};

const searchByCity = (city) => {
  // catch slc variants
  const slcVariants = ["slc", "salt lake"];
  if (slcVariants.includes(city)) {
    city = "salt lake city";
  }
  const productLocations = window.productLocations;
  const matches = productLocations.filter((l) => {
    return city === l.city.toLowerCase();
  });
  populateSearchResults(matches, "city", city);
};

const populateSearchResults = (locations, type, val) => {
  const $resultsBlock = document.getElementById("product-search-results");
  const $resultsTitle = document.createElement("h3");

  if (locations.length) {
    $resultsTitle.textContent = `results by ${type}`;
    $resultsBlock.append($resultsTitle);

    locations.forEach((l) => {
      const $block = buildLocationBlock(l);
      $resultsBlock.append($block);
    });
  } else {
    $resultsTitle.textContent = `no results for ${val}... but take a look at our other locations:`;
    $resultsBlock.append($resultsTitle);
    window.productLocations.forEach((l) => {
      const $block = buildLocationBlock(l);
      $resultsBlock.append($block);
    });
  }
};

const buildLocationBlock = (location) => {
  const $block = document.createElement("div");
  const $title = document.createElement("h4");
  const $titleA = document.createElement("a");
  $titleA.textContent = location.name.toLowerCase();
  $titleA.href = location.link;
  $titleA.setAttribute("target", "_blank");
  $title.append($titleA);
  const $location = document.createElement("h5");
  $location.textContent = location.location.toLowerCase();
  const $address = document.createElement("p");
  $address.textContent = `${location.address}, ${location.city}, ${location.state}`.toLowerCase();
  const $phone = document.createElement("p");
  $phone.textContent = location.phone;
  if (location.location) {
    $block.append($title, $location, $address, $phone);
  } else {
    $block.append($title, $address, $phone);
  }
  return $block;
};

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
};

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.onload = async (event) => {
  classify();
  codify();
  setPage();

  // await fetchLabels();

  testCart();
  updateCopyright();
};
