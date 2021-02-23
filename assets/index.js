// GLOBAL VARIABLES
let storeLocation;

// UNIVERSAL SETUP
const setupHead = () => {
  const title = getPage();
  document.title = `normal® ${title === "home" ? "" : `- ${title}`}`;
}

const getPage = () => {
  const path = window.location.pathname;
  if (path.includes("order")) {
    return "order";
  } else if (path.includes("store")) {
    return "store";
  } else if (path.includes("lab")) {
    return "lab";
  } else if (path.includes("delivery")) {
    return "delivery";
  } else if (path.includes("about")) {
    return "about";
  } else if (path.includes("pint-club")) {
    return "pint club";
  } else if (path.includes("cone-builder")) {
    return "cone builder";
  } else if (path.includes("merch")) {
    return "merch";
  } else {
    return "home";
  }
}

const setPage = () => {
  const page = getPage();
  console.log(`setPage -> page`, page);
  
  switch (page) {
    case "order":
      buildOrderPage();
      break;
    case "store":
      getCurrentStore();
      shopify();
      styleMenus();
      setupCarousels();
      fixCart();
      // buildCustomizationTool();
      // drinksStarburst();
      break;
    case "lab":
      getCurrentStore();
      shopify();
      styleMenus();
      fixCart();
      // buildCustomizationTool();
      // drinksStarburst();
      // setupCarousels();
      break;
    case "delivery":
      getCurrentStore();
      shopify();
      styleMenus();
      fixCart();
      // buildCustomizationTool();
      // drinksStarburst();
      // setupCarousels();
      break;
    case "about":
      buildLocationsGrid();
      fetchProductLocations();
      setupDownAnchors();
      break;
    case "pint club":
      floatPintLogo();
      buildPintBanner();
      setupPintSubOptions();
      buildClubFAQ();
      buildCustomizationTool();
      setupDownAnchors();
      break;
    case "cone builder":
      console.log("nothing yet~");
      break;
    case "merch":
      console.log("nothing yet~");
      break;
    case "home":
      buildIndexCarousel();
      break;
    default:
      console.error("something went wrong!")
      break;
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
        setBlockStyle(c, values);
      } else if (key === "color") {
        console.log(values);
        setBlockTheme(c, values); // set theme class on parent
      } else if (key === "code") {
        switch (values) {
          case "search":
            return buildProductSearch(c);
          case "pint-club":
            return buildPintClubCheckout(c);
          default:
            console.log(`${values} code block hasn't been configured yet`);
            break;
        }
      }
    });
  }
};

const setPageTheme = (color) => {
  const $body = document.querySelector("body");
  const configuredColors = ["bluepink", "bluewhite", "pink", "yellow"];
  if (configuredColors.includes(color)) {
    $body.classList.add("theme", `theme-${color}`);
  } else {
    $body.classList.add("theme", `theme-white`);
  }
};

const setBlockTheme = ($el, color) => {
  const $parent = $el.parentNode.parentNode.parentNode.parentNode.parentNode;
  const configuredColors = ["bluepink", "bluewhite", "pink", "yellow"];
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

const fixCart = () => {
  const $cart = document.querySelector(".header-cart");
  if ($cart) {
    $cart.classList.add("header-cart-fixed")
  }
}

const buildBackToTopBtn = () => {
  const $btn = document.createElement("aside");
    $btn.id = "back-to-top";
    $btn.classList.add("hide");
    $btn.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-up">
    <use href="/icons.svg#arrow-up"></use>
    </svg>`;
    $btn.innerHTML += "back to top";
    $btn.onclick = (e) => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      const $backToTopBtn = document.getElementById("back-to-top");
      $backToTopBtn.classList.add("hide");
    }

  const $body = document.querySelector("body");
  $body.append($btn);
}

const showBackToTopBtn = debounce(function() {
  // console.log(`showing back to top`);
  const $btn = document.getElementById("back-to-top");
  if ($btn) {
    if (window.scrollY > 0) {
      $btn.classList.remove("hide");
    } else { 
      $btn.classList.add("hide");
    }
  }
}, 1000); // one second

// LOCAL STORAGE
const saveToLocalStorage = ($form) => {
  const $fieldsToStore = $form.querySelectorAll("[data-store=true]");
  if ($fieldsToStore) {
    $fieldsToStore.forEach((f) => {
      if (f.value.trim() !== "") {
        localStorage.setItem(`normal-${f.name}`, f.value);
      }
    })
  }
}

const getContactFromLocalStorage = () => {
  const $fieldsToStore = document.querySelectorAll("[data-store=true]");
  if ($fieldsToStore) {
    $fieldsToStore.forEach((f) => {
      const thisItem = localStorage.getItem(`normal-${f.name}`);
      if (thisItem) { 
        f.value = thisItem;
      } 
    })
  }
}

const getAddressFromLocalStorage = () => {
  const $fieldsToStore = document.querySelectorAll("[data-store=true][data-fieldType=address]");
  if ($fieldsToStore) {
    $fieldsToStore.forEach((f) => {
      const thisItem = localStorage.getItem(`normal-${f.name}`);
      if (thisItem) { 
        f.value = thisItem;
      } 
    })
  }
}

// FETCH DATA
const fetchLabels = async () => {
  const resp = await fetch("/_data/labels.json");
  let json = await resp.json();
  if (json.data) {
    json = json.data; // helix quirk, difference between live and local
  }
  window.labels = {};
  json.forEach((j) => {
    window.labels[j.key] = j.value;
  });
  return window.labels;
};

const fetchProductLocations = async () => {
  if (!window.productLocations) {
    const resp = await fetch("/_data/product-locations.json");
    let json = await resp.json();
    if (json.data) {
      json = json.data; // helix quirk, difference between live and local
    }
    window.productLocations = json;
  }
  return window.productLocations;
};

const fetchDeliveryZips = async () => {
  if (!window.deliveryZips) {
    const resp = await fetch("/_data/delivery-zips.json");
    let json = await resp.json();
    if (json.data) {
      json = json.data; // helix quirk, difference between live and local
    }
    window.deliveryZips =  json.sort((a, b) => {
      if (a.zip > b.zip) { return 1 }
      else { return -1 }
    });
  }
  return window.deliveryZips;
};

// INDEX
const buildIndexCarousel = () => {
  const $carousel = document.querySelector(".embed-internal-indexcarousel");
  
  if ($carousel) {
    $carousel.onwheel = (e) => {     // set horizonal scroll on carousel
      if (e.wheelDelta < 0) {
        $carousel.scrollLeft += 468;
      } else {
        $carousel.scrollLeft -= 468;
      }
    };
  }
}

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
const getCurrentStore = () => {
  const currentStore = getPage();
  // console.log(`getCurrentStore -> currentStore`, currentStore);
  return currentStore;
}

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
        a.classList.add("btn-rect");
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

const styleMenus = () => {
  // console.log(`building menus`);
  const $main = document.querySelector("main");
  const $divs = [ ...$main.querySelectorAll("div")];
  $divs.forEach((d) => {
    // console.log(d.firstElementChild, d.firstElementChild.nodeName);
    if (d.firstElementChild.nodeName === "H2" && d.firstElementChild.id !== "contact-us") {
      d.classList.add("menu");
      const $embed = d.querySelector(".embed");
      if ($embed) {
        d.classList.add("menu-carousel", "theme-outline");
      } else {
        d.classList.add("menu-filled", "theme-filled");
      }
    }
  })
}

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
const resetCarousels = debounce(function() {
  // console.log(`reseting carousels`);
  const currentStore = getCurrentStore();
  const configuredStores = [ "store", "lab", "delivery", "merch" ];

  if (configuredStores.includes(currentStore)) {
    const $carousels = document.querySelectorAll(`.embed-internal-${currentStore}menus`);
    if ($carousels) {
      $carousels.forEach((c) => {
        c.scrollLeft = 0;
      })
    }
  }
}, 500); // half second

const setupCarousels = () => {

  const $carouselWrappers = document.querySelectorAll(".menu-carousel");

  if ($carouselWrappers) {

    $carouselWrappers.forEach((w) => {
      const $carousel = w.querySelector(`div.embed-internal-${getPage()}menus`);

      if ($carousel) {
        // build btns
        const $leftBtn = document.createElement("aside");
          $leftBtn.classList.add("menu-carousel-btn", "menu-carousel-btn-left");
          $leftBtn.setAttribute("data-action", "slideLeft");
          $leftBtn.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-left">
            <use href="/icons.svg#arrow-left"></use>
          </svg>`;
          $leftBtn.onclick = (e) => { carouselNav(e, "left"); }
                  
          const $rightBtn = document.createElement("aside");
          $rightBtn.classList.add("menu-carousel-btn", "menu-carousel-btn-right");
          $rightBtn.setAttribute("data-action", "slideRight");
          $rightBtn.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-right">
            <use href="/icons.svg#arrow-right"></use>
          </svg>`;
          $rightBtn.onclick = (e) => { carouselNav(e, "right"); }
        $carousel.append($leftBtn, $rightBtn);

        const numOfSlides = $carousel.querySelectorAll("div").length;
        console.log(numOfSlides);

        if (numOfSlides % 2 === 0) {
          $carousel.classList.add("menu-carousel-even");
        } else {
          $carousel.classList.add("menu-carousel-odd");
        }

        if (numOfSlides === 1) {
          $carousel.classList.add("menu-carousel-one");
        } else if (numOfSlides === 2) {
          $carousel.classList.add("menu-carousel-two");
        } else if (numOfSlides === 3) {
          $carousel.classList.add("menu-carousel-three");
        } else if (numOfSlides > 3) {
          $carousel.classList.add("menu-carousel-full");
        }

      }
    })
  }
};

const carouselNav = (e, direction) => {
  const $btn = e.target.closest(".menu-carousel-btn");
  const $parent = $btn.parentNode;
  const childWidth = $parent.querySelector("div").offsetWidth;
  const numOfSlides = $parent.querySelectorAll("div").length;
  const prevPosition = $parent.scrollLeft;

  if (direction === "left") {
    const currPosition = prevPosition - childWidth;
    if (currPosition < 0) {
      reorgSlides($parent, "left");
    } else {
      $parent.scrollLeft -= childWidth;
    }
  } else if (direction === "right") {
    const currPosition = prevPosition + childWidth;
    if (currPosition >= ((numOfSlides - 2) * childWidth)) {
      reorgSlides($parent, "right");
    } else {
      $parent.scrollLeft += childWidth;
    }
  }

}

const reorgSlides = ($carousel, direction) => {
  const $slides = $carousel.querySelectorAll("div");
  if (direction === "left") {
    const $lastSlide = $slides[$slides.length - 1];
    $lastSlide.remove();
    $carousel.prepend($lastSlide);   
  } else if (direction === "right") {
    const $firstSlide = $slides[0];
    $firstSlide.remove();
    $carousel.append($firstSlide);
  }
}

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

const setupDownAnchors = () => {
  const $downArrows = document.querySelectorAll("svg.icon-arrow-down");
  if ($downArrows) {
    $downArrows.forEach((a) => {
      const $next = a.parentNode.parentNode.parentNode.nextElementSibling;
      // console.log(`$downArrows.forEach -> $next`, $next);
      const $anchor = a.parentNode;
      if ($next && $anchor && $next.classList[0]) {
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
  $inputField.placeholder = "enter city or zip here";
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

// PINT CLUB
const floatPintLogo = () => {
  // console.log(`float pint logo'`);
  const $pintLogo = document.querySelector("svg.icon-pint-club");
  // console.log(`floatPintLogo -> $pintLogo`, $pintLogo);
  if ($pintLogo) {
    const $parent = $pintLogo.parentNode;
    $parent.classList.add("pintclub-logo");
  }
}

const buildPintBanner = () => {
  const $pintbanner = document.querySelector(".embed-internal-pintbanner div p");
  if ($pintbanner) {
    // set horizonal scroll on banner
    $pintbanner.onwheel = (e) => {
      if (e.wheelDelta < 0) {
        $pintbanner.scrollLeft += 468;
      } else {
        $pintbanner.scrollLeft -= 468;
      }
    };
  }
}

const buildPintClubCheckout = ($code) => {
  // console.log(`building pint club checkout`);
  const $parent = $code.parentNode.parentNode.parentNode.parentNode.parentNode;
  // console.log($parent);
}

const setupPintSubOptions = () => {
  const $pintclubOptions = document.querySelector(".p-options");
  if ($pintclubOptions) {
    // console.log(`pint sub options`);
    const $options = $pintclubOptions.querySelectorAll("a");
    if ($options) {
      $options.forEach((o) => {
        const title = o.getAttribute("href")
        o.removeAttribute("href");
        o.classList.add("btn-rect");
        o.setAttribute("data-club-type", cleanName(title));
        o.onclick = (e) => {
          const $el = e.target.closest("a");
          const target = $el.getAttribute("data-club-type");
          populateCustomizationTool("customize your pint club subscription");
          customizeToolforClub(target);
        }
      })
    }
    // console.log($options);
  }
}

const customizeToolforClub = (target) => {
  // set payment option
  const $parent = document.getElementById("radio-paymentoption");
  if ($parent) {
    const $paymentOption = $parent.querySelector("div");
    const $sibling = $parent.querySelector("h3");
    const $radio = document.getElementById(target);
  
    $paymentOption.classList.remove("hide");
    $parent.setAttribute("data-open", true);
    $sibling.setAttribute("data-open", true);
    $paymentOption.setAttribute("data-open", true);
    $radio.checked = true;
  }

  // trigger address field on local delivery
  const $localDeliveryOpt = document.getElementById("localdelivery");
  const $pickupOpt = document.getElementById("pickup");

  if ($localDeliveryOpt && $pickupOpt) {

    $localDeliveryOpt.onclick = async (e) => {
      const $customBody = document.querySelector(".customize-table-body");
      const $addrFields = $customBody.querySelectorAll("[data-fieldtype=address]");

      if (!$addrFields.length) {
        let fields = getFields([ "address" ]);
        fields.forEach((f) => {
          $customBody.append(buildFields(f));
        });
        getAddressFromLocalStorage();

        const $zipDropdown = $customBody.querySelector("#zip");
        const deliveryZips = await fetchDeliveryZips();
        const zipArr = deliveryZips.map((z) => z.zip);        
        populateOptions($zipDropdown, zipArr);
      }
    }

    $pickupOpt.onclick = (e) => {
      const $customBody = document.querySelector(".customize-table-body");
      const $addrFields = $customBody.querySelectorAll("[data-fieldtype=address]");
      if ($addrFields.length) {
        $addrFields.forEach((f) => {
          f.remove();
        })
      }

    }
  }
}

const buildClubFAQ = () => {
  const $faqBlock = document.querySelector(".p-normalpintclubfaq");
  if ($faqBlock) {
    const faqChildren = [ ...$faqBlock.children].splice(2); // ignore header and desc

    const $flexContainer = document.createElement("section");
      $flexContainer.classList.add("faq-container");
  
    let tempObj = [];
    let flexItems = [];
  
    faqChildren.forEach((c) => {
      if (c.nodeName === "H3") { // start of new block
        tempObj = [];
        tempObj.push(c);
        flexItems.push(tempObj);
      } else if (c.nodeName !== "H2") { // exclude section header
        tempObj.push(c);
      }
    });
    
    flexItems.forEach((item, i) => {
      const $flexItem = document.createElement("div");
      $flexItem.classList.add("faq-item");
      $flexItem.setAttribute("data-index", i + 1);
      for (let i = 0; i < item.length; i++) {
        // setup click on qs
        if (item[i].nodeName === "H3") {
          item[i].onclick = (e) => {
            const $parent = e.target.parentNode;
            // console.log(`flexItems.forEach -> $parent`, $parent);
            const status = $parent.getAttribute("data-clicked");
            if (status === "true") { //already clicked
              $parent.classList.remove("show-block");
              $parent.setAttribute("data-clicked", false);
            } else { // not clicked
              $parent.setAttribute("data-clicked", true);
              $parent.classList.add("show-block");
            }
          }
        }
        $flexItem.append(item[i]);
      }
      $flexContainer.append($flexItem);
    });
    $faqBlock.append($flexContainer);
  }
}

// CUSTOMIZE COMPONENT
const buildCustomizationTool = () => {

  const $main = document.querySelector("main");
  const mainTheme = getMainTheme();

  const $customSection = document.createElement("section");
    $customSection.classList.add("customize", mainTheme, "hide");

  const $customClose = document.createElement("div");
    $customClose.classList.add("customize-close");
    $customClose.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-close">
      <use href="/icons.svg#close"></use>
    </svg>`;
    $customClose.onclick = (e) => {
      const $customScreen = document.querySelector(".customize");
      $customScreen.classList.add("hide");
    }

  const $customTable = document.createElement("div");
    $customTable.classList.add("customize-table");

  const $customHead = document.createElement("h2");
    $customHead.classList.add("customize-table-head");
    $customHead.textContent = "customize your ...";
  const $customBody = document.createElement("form");
    $customBody.classList.add("customize-table-body");
  
  const $customFoot = document.createElement("div");
    $customFoot.classList.add("customize-foot");

  $customTable.append($customHead, $customBody);

  $customSection.append($customClose, $customTable, $customFoot);

  $main.append($customSection);
}

const populateCustomizationTool = (title) => {

  const $customTool = document.querySelector(".customize-table");

  const $customHead = $customTool.querySelector(".customize-table-head");
    $customHead.textContent = title;
  
  const $customBody = $customTool.querySelector(".customize-table-body");
    $customBody.innerHTML = ""; // clear on each populate

  let fields = getFields([ "contact", "pint-club" ]);

  fields.forEach((f) => {
    $customBody.append(buildFields(f));
  })

  getContactFromLocalStorage();

  const $customFoot = document.querySelector(".customize-foot");
    $customFoot.innerHTML = ""; // clear on each populate
  
  const $btn = document.createElement("a");
    $btn.classList.add("btn-rect");
    $btn.textContent = "join the club";
    $btn.onclick = async (e) => {
      const $form = document.querySelector("form");
      const valid = validateSubmission($form);
      if (valid) {
        saveToLocalStorage($form);
        buildScreensaver("sending in your subscription...");
        const formData = await getSubmissionData($form);
        setTimeout(removeScreensaver, 8000);
        console.log(`formData`, formData);
      } else {
        console.error("please fill out all required fields!");
      }
    }
  $customFoot.append($btn);

  showCustomizationTool();
}

const showCustomizationTool = () => {
  const $customTool = document.querySelector(".customize");
  if ($customTool) {
    // console.log(`showing customization tool`);
    $customTool.classList.remove("hide");
  }
}

const validateSubmission = ($form) => {
  const $requiredFields = $form.querySelectorAll("[required]");
  const $radios = $form.querySelectorAll("[type=radio]");
  const $selects = $form.querySelectorAll("select");

  let invalidFieldsById = []; // inputs and selects go here
  let invalidRadiosByName = [];

  if ($requiredFields) {
    $requiredFields.forEach((f) => {
      if (!f.value.trim() || !f.checkValidity()) {
        invalidFieldsById.push(f.id);
      }
    });
  }

  if ($selects) {
    $selects.forEach((s) => {
      if (s.value === "") {
        invalidFieldsById.push(s.id);
      }
    });
  }

  if ($radios) {
    let radiosByName = {};

    $radios.forEach((r) => {
      if (radiosByName[r.name]) { // if property exists
        radiosByName[r.name].push(r.checked);
      } else { // if property does not exist
        radiosByName[r.name] = [r.checked];
      }
    });

    for (prop in radiosByName) {
      if (!radiosByName[prop].includes(true)) {
        invalidRadiosByName.push(prop);
      }
    }
  }

  const allInvalidFields = [...invalidFieldsById, ...invalidRadiosByName];

  if (allInvalidFields.length === 0) {
    return true;
  } else {
    invalidFieldsById.forEach((i) => { // attach error mssg on these fields
      const $field = document.getElementById(i);
      $field.classList.add("invalid-field");
    });

    invalidRadiosByName.forEach((n) => { // pop open dropdown with errors
      const $radioGroup = document.querySelector(`[name=${n}]`).parentNode
        .parentNode;
      $radioGroup.classList.add("invalid-field");
      const $parent = $radioGroup.parentNode;
      const $child = $parent.querySelector("h3");
      const open = $parent.getAttribute("data-open");
      if (open !== "true") {
        $radioGroup.classList.remove("hide");
        $parent.setAttribute("data-open", true);
        $child.setAttribute("data-open", true);
        $radioGroup.setAttribute("data-open", true);
      }
    });

    setTimeout(() => {
      const $invalidFields = document.querySelectorAll(".invalid-field");
      if ($invalidFields) {
        $invalidFields.forEach((f) => {
          f.classList.remove("invalid-field");
        });
      }
    }, 1000); //remove this class after the animation runs

    return false;
  }
};

const getSubmissionData = ($form) => {
  const $fields = $form.querySelectorAll("[name]"); // all named fields
  let data = {};

  if ($fields) {
    $fields.forEach((f) => {
      if (f.nodeName === "SELECT") {
        data[f.name] = f.value;
      } else if (f.type === "checkbox") {
        if (f.checked) { // only check checked checkbox (wow) options
          if (data[f.name]) { // if prop exists
            data[f.name].push(f.value)
          } else { // if prop DOES NOT exist
            data[f.name] = [ f.value ];
          }
        }
      } else if (f.type === "radio") {
        if (f.checked) { // only add selected radio option
          data[f.name] = f.value;
        }
      } else {
        if (f.value) { // exclude empty fields
          data[f.name] = f.value;
        }
      }
    })
  }

  return data;
}

const getFields = (fields) => {

  let allFields = [];
  fields.forEach((f) => {
    switch (f) {
      case "contact":
        allFields.push(
          { data: { store: true }, title: "name", type: "text", placeholder: "your name", required: true },
          { data: { store: true }, title: "cell", type: "tel", placeholder: "your cell", required: true },
          { data: { store: true }, title: "email", type: "email", placeholder: "your email", required: true }
        );
        break;
      case "address":
        allFields.push(
          { data: { fieldtype: "address", store: true }, title: "addr1", type: "text", placeholder: "your address", required: true },
          { data: { fieldtype: "address", store: true }, title: "addr2", type: "text", placeholder: "apt # or building code? add here!" },
          { data: { fieldtype: "address", store: true }, title: "city", type: "text", placeholder: "your city", required: true },
          { data: { fieldtype: "address", store: true }, title: "state", type: "text", value: "utah", readonly: true },
          { data: { fieldtype: "address" }, title: "zip", type: "select", placeholder: "your zip code", src: "deliveryZips", required: true }          
        );
        break;
        case "pint-club":
          allFields.push(
            { title: "payment-option", type: "radio", label: "select payment option", options: [ "prepay", "monthly" ], required: true },
            { title: "customize-pints", type: "checkbox", label: "customize your pints (select any that apply)", options: [ "vegan", "half-vegan", "nut free", "gluten free" ], required: true },
            { title: "allergies", type: "text", placeholder: "any allergies? even shellfish, seriously! ya never know!" },
            { title: "delivery-option", type: "radio", label: "how do you want to get your pints?", options: [ "pickup", "local delivery" ], required: true }
          );
        break;
      default:
        break;
    }
  })
  return allFields;
}

const buildFields = (field) => {
  let $field;

  if (field.type === "radio" || field.type === "checkbox") {
    //setup options
    $field = document.createElement("div");
      $field.classList.add(`customize-table-body-${field.type}`);
      $field.id = `${field.type}-${cleanName(field.title)}`;

    const $title = document.createElement("h3");
      $title.textContent = field.label;
      $title.onclick = (e) => {
        const $parent = e.target.parentNode;
        const $sibling = e.target.nextElementSibling;
        const open = $sibling.getAttribute("data-open");

        if (open === "true") {
          $sibling.classList.add("hide");
          $parent.setAttribute("data-open", false);
          $sibling.setAttribute("data-open", false);
          e.target.setAttribute("data-open", false)
        } else {
          $sibling.classList.remove("hide");
          $parent.setAttribute("data-open", true);
          $sibling.setAttribute("data-open", true);
          e.target.setAttribute("data-open", true);
        }

      }
    $field.append($title); 

    const $optionsContainer = document.createElement("div");
      $optionsContainer.classList.add(`customize-table-body-${field.type}-container`, "hide");
    
    field.options.forEach((o) => {
      
      const $label = document.createElement("label");
        $label.classList.add(`customize-table-body-${field.type}-container-optionblock`);
        $label.setAttribute("for", cleanName(o));
        $label.textContent = o;

      const $customEl = document.createElement("span");
        $customEl.classList.add(`customize-table-body-${field.type}-container-optionblock-custom`);
      
      const $option = document.createElement("input");
        $option.classList.add(`customize-table-body-${field.type}-container-optionblock-option`);
        $option.id = cleanName(o);
        $option.name = field.title;
        $option.type = field.type;
        $option.value = o;

      $label.append($option, $customEl);      

      $optionsContainer.append($label);
    })
    $field.append($optionsContainer);

  } 
  else if (field.type === "select") {

    $field = document.createElement("div"); // wrapper
      $field.classList.add("customize-table-body-selectwrapper");
    if (field.data) {
      for (dataType in field.data) {
        $field.setAttribute(`data-${dataType}`, field.data[dataType]);
      }
    }
    $select = document.createElement(field.type);
      $select.classList.add("customize-table-body-selectwrapper-select");
      $select.id = cleanName(field.title);
      $select.name = cleanName(field.title);
    
    const $option = document.createElement("option");
      $option.value = "";
      $option.textContent = field.placeholder;
      $option.disabled = true;
      $option.selected = true;
      $option.hidden = true;
    $select.append($option);
    $field.append($select);
  } else {
    $field = document.createElement("input");
      $field.classList.add("customize-table-body-field");
      $field.id = cleanName(field.title);
      $field.name = cleanName(field.title);
      $field.type = field.type || "text";

      if (field.type === "tel") {
        // tel pattern
        $field.pattern = "[0-9]{10,11}";
      } else if (field.type === "email") {
        $field.pattern = "[a-zA-Z0-9]+@[a-zA-Z0-9]+(\\.[a-zA-Z0-9]+)+";
      }

      if (field.placeholder) {
        $field.placeholder = field.placeholder;
      }
      if (field.value) {
        $field.value = field.value;
      }
      if (field.data) {
        for (dataType in field.data) {
          $field.setAttribute(`data-${dataType}`, field.data[dataType]);
        }
      }
      if (field.required) {
        $field.required = field.required;
      }
      if (field.readonly) {
        $field.readOnly = field.readonly;
      }
  }

  return $field;
}

const populateOptions = ($el, data) => {
  data.forEach((d) => {
    // console.log(d);
    const $option = document.createElement("option");
      $option.value = d;
      $option.textContent = d;
    $el.append($option);
  })
}

// SCREENSAVER COMPONENT
const buildScreensaver = (message) => {
  const $main = document.querySelector("main");
  const mainTheme = getMainTheme();

  const $screensaver = document.createElement("section");
    $screensaver.classList.add("screensaver", mainTheme);

  const $message = document.createElement("h2");
    $message.classList.add("screensaver-message");
    $message.textContent = message;
  
  const $logoContainer = document.createElement("div");
    $logoContainer.classList.add("screensaver-logocontainer")
    $logoContainer.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-normal">
    <use href="/icons.svg#normal"></use>
  </svg>`;
    
  $screensaver.append($message, $logoContainer);

  $main.append($screensaver);
}

const removeScreensaver = () => {
  const $screensaver = document.querySelector(".screensaver");
  if ($screensaver) {
    $screensaver.remove();
  }
}

// HEADER
const testCart = () => {
  const $headerText = document.querySelector(".header-cart-text");
  if ($headerText) { 
    $headerText.textContent = randomNum(0, 19);
  }
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
  if (str) {
    const clean = str
      .split(" ").join("") // remove spaces
      .toLowerCase()
      .replace(/[^0-9a-z]/gi, ""); // replace non alpha-numeric
      return clean;
  }
};

const getMainTheme = () => {
  const $body = document.querySelector("body");
  const classList = [ ...$body.classList ];
  if (classList.includes("theme")) {
    if (classList[classList.length - 1].includes("theme-")) {
      return classList[classList.length - 1];
    } else {
      return "theme-white"
    }
  }
  return "theme-white";
}

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* from underscore.js */
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) { func.apply(context, args) };
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) { func.apply(context, args) };
  };
}

window.onload = async (e) => {
  setupHead();
  classify();
  codify();
  setPage();
  
  await fetchLabels();

  testCart();
  buildBackToTopBtn();
  updateCopyright();
};

window.onscroll = showBackToTopBtn;
window.onresize = resetCarousels;
