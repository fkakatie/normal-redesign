// GLOBAL VARIABLES
let storeLocation;

/*==========================================================
UNIVERSAL SETUP
==========================================================*/
const setupHead = () => {
  const title = getPage();
  document.title = `normal® ${title === "home" ? "" : ` ${title.split("-").join(" ")}`}`;
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
    return "pint-club";
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
  // console.log(`setPage -> page`, page);
  
  switch (page) {
    case "order":
      buildOrderPage();
      break;
    case "store":
      setCurrentStore();
      shopify();
      styleMenus();
      setupCarousels();
      fixCart();
      buildCustomizationTool();
      // drinksStarburst();
      break;
    case "lab":
      setCurrentStore();
      shopify();
      styleMenus();
      fixCart();
      buildCustomizationTool();
      // drinksStarburst();
      // setupCarousels();
      break;
    case "delivery":
      setCurrentStore();
      shopify();
      styleMenus();
      fixCart();
      buildCustomizationTool();
      // drinksStarburst();
      // setupCarousels();
      break;
    case "about":
      buildLocationsGrid();
      fetchProductLocations();
      setupDownAnchors();
      break;
    case "pint-club":
      setCurrentStore();
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
      setCurrentStore();
      buildCustomizationTool();
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
        // console.log(values);
        setBlockTheme(c, values); // set theme class on parent
      } else if (key === "starburst") {
        // console.log("starburst", values);
      } else if (key === "starburst-collapse") {
        // console.log("starburst collapse", values);
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

/*==========================================================
LOCAL STORAGE
==========================================================*/
const setCurrentStore = () => {
  const page = getPage();
  localStorage.setItem("normal-lastVisited", page);
}

const getLastStore = () => {
  const lastStore = localStorage.getItem("normal-lastVisited");
  return lastStore || "store";
}

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

/*==========================================================
FETCHING DATA
==========================================================*/
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

/*==========================================================
INDEX PAGE
==========================================================*/
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

/*==========================================================
ORDER PAGE
==========================================================*/
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

/*==========================================================
STOREFRONT PAGES
==========================================================*/
const getCurrentStore = () => {
  const page = getPage();
  const configuredStores = [ "store", "lab", "delivery", "pint club", "merch" ];

  if (configuredStores.includes(page)) {
    return page;
  } else {
    return getLastStore();
  }
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

const styleMenus = () => {
  // console.log(`building menus`);
  const $main = document.querySelector("main");
  const $divs = [ ...$main.querySelectorAll("div")];
  $divs.forEach((d) => {
    if (d.firstElementChild) {
      if (d.firstElementChild.nodeName === "H2" && d.firstElementChild.id !== "contact-us") {
        d.classList.add("menu");
        const $embed = d.querySelector(".embed");
        if ($embed) {
          d.classList.add("menu-carousel", "theme-outline");
        } else {
          d.classList.add("menu-filled", "theme-filled");
        }
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

const customizeToolforStore = (target) => {
  // limit soft serve toppings
  const $toppingCheckboxes = document.querySelectorAll("input[name=topping]");
  // console.log($toppingCheckboxes);
  if ($toppingCheckboxes) {
    $toppingCheckboxes.forEach((c) => {
      // console.log(c);
      c.onchange = (e) => {
        const max = 3;
        const $cbs =  [ ...document.querySelectorAll("input[name=topping]")];
        const numChecked = $cbs.filter((c) => c.checked).length;
      
        if (numChecked === max) { // max checkboxes checked
          $cbs.forEach((c) => {
            if (!c.checked) { c.disabled = true }; // disable checkboxes
          })
        } else { 
          $cbs.forEach((c) => {
            c.disabled = false; // enable checkboxes
          })
        }
      }

    })
  }

  // set payment option
  // if ($parent) {
  //   const $paymentOption = $parent.querySelector("div");
  //   const $sibling = $parent.querySelector("h3");
  //   const $radio = document.getElementById(target);
  
  //   $paymentOption.classList.remove("hide");
  //   $parent.setAttribute("data-open", true);
  //   $sibling.setAttribute("data-open", true);
  //   $paymentOption.setAttribute("data-open", true);
  //   $radio.checked = true;
  // }

}

const customizeCheckoutForStorefront = () => {

  // this is setting the pickup times
  // const $pickupDate = document.getElementById("pickupdate");
  const $pickupTimeDropdown = document.getElementById("pickuptime");
    $pickupTimeDropdown.innerHTML = ""; // clear on each customize
  const pickupTimes = getPickupTimes();

  populateDynamicOptions($pickupTimeDropdown, pickupTimes);

  // decide whether or not to show checkout form
  const labels = window.labels;
  const currentStore = getCurrentStore();
  const storeOpen = labels[`${currentStore}_open`];
  // console.log(`customizeCheckoutForStorefront -> storeOpen`, storeOpen);
  const storeOpenByTime = currentStore !== "pint-club" ? checkIfStorefrontOpen() : true; // pint club is always open
  // console.log(`customizeCheckoutForStorefront -> storeOpenByTime`, storeOpenByTime);

  const itemsInCart = cart.totalItems();
  
  const $checkoutFormContainer = document.querySelector(".checkoutform-container");

  if (storeOpen && storeOpenByTime && itemsInCart > 0) { // store is open, items in the cart
    $checkoutFormContainer.classList.remove("hide"); 
    const $checkoutDisabledMessage = document.querySelector(".checkout-disabled");
    if ($checkoutDisabledMessage) { $checkoutDisabledMessage.remove() };
  } else if (storeOpen && storeOpenByTime) { // store is open, but nothing in the cart
    hideCheckoutForm();
    const $checkoutDisabledMessage = document.querySelector(".checkout-disabled");
    if ($checkoutDisabledMessage) { $checkoutDisabledMessage.remove() };
  } else { // store is CLOSED
    hideCheckoutForm();

    const messageExists = document.querySelector(".checkout-disabled");
    
    if (!messageExists) {
      const $messageContainer = document.createElement("div");
        $messageContainer.classList.add("checkout-disabled");
  
      const $messageText = document.createElement("p");
        $messageText.classList.add("checkout-disabled-message");
        $messageText.textContent = labels.checkout_toolate;
  
      $messageContainer.append($messageText);
  
      const $checkoutContainer = document.querySelector(".checkout-container");
      $checkoutContainer.append($messageContainer)
    }

  }
}

const getPickupTimes = () => {
  const store = getCurrentStore();
  const date = new Date();
  const now = parseInt(`${date.getHours()}${date.getMinutes().toString().padStart(2, "0")}`);
  const { open, close } = getHoursOfOp(store);

  let pickupTimes = [];
  let startTimeObj;

  if (now < (open * 100)) { // BEFORE opening
    // console.log(`before opening`);
    startTimeObj = new Date(date.setHours(open, 0, 0));
  } else { // AFTER opening
    // console.log(`after opening`);
    const currentMinutes = date.getMinutes();
    const startMinutes = Math.ceil(currentMinutes / 10) * 10;
    const diff = startMinutes - currentMinutes;
    startTimeObj = new Date(date.getTime() + diff * 60000);
  }

  const closeTimeObj = new Date(date.setHours(close, 0, 0));
  let currentTimeObj = new Date(startTimeObj.setSeconds(0, 0));

  while (currentTimeObj <= closeTimeObj) {
    const currentTimeHourFull = currentTimeObj.getHours(); // 24 hr time
    const currentTimeHour = currentTimeHourFull > 12 ? currentTimeHourFull - 12 : currentTimeHourFull; // 12 hr time
    const currentTimeMinutes = currentTimeObj.getMinutes().toString().padStart(2, "0");
    const currentTimePeriod = currentTimeHourFull < 12 ? "am" : "pm";
    const currentTimePrint = `${currentTimeHour}:${currentTimeMinutes}${currentTimePeriod}`;
    pickupTimes.push({ text: currentTimePrint, value: currentTimeObj.toISOString() });
    currentTimeObj = new Date(currentTimeObj.getTime() + 10 * 60000); // add ten minutes
  } 
  return pickupTimes;
}

const getISODates = (date) => {
  console.log(date);
  if (date === "today") {
    return new Date();
  }
}

/*==========================================================
CART FUNCTIONALITY
==========================================================*/
const updateCart = () => {
  // console.log(`updating cart where it counts`);
  setCartTotal();
  getContactFromLocalStorage();
  customizeCheckoutForStorefront();

  const $checkoutTable = document.querySelector(".checkout-table-body");
    $checkoutTable.innerHTML = ""; // clear on each update

  if (cart.line_items.length > 0) {
    cart.line_items.forEach((i) => {
      const variation = catalog.byId[i.variation];
      const variationName = variation.item_variation_data.name; // for use with mods
      const item = catalog.byId[variation.item_variation_data.item_id];
      const itemName = item.item_data.name;
      const mods = i.mods.map((m) => catalog.byId[m].modifier_data.name);

      const $row = document.createElement("tr");
        $row.setAttribute("data-id", i.fp);
  
      const $quantity = document.createElement("td");
        $quantity.classList.add("checkout-table-body-quantity");
        $quantity.innerHTML = `<span onclick="minus(this)" class="quantity quantity-minus">-</span>
          <span class="quantity-num">${i.quantity}</span>
          <span onclick="plus(this)" class="quantity quantity-plus">+</span>`;
  
      const $item = document.createElement("td");
        $item.classList.add("checkout-table-body-item");
        if (mods.length >= 1) {
          $item.textContent = `${variationName} ${removeStorefrontName(itemName)}, ${mods.join(", ")}`;
        } else {
          $item.textContent = itemName;
        }
  
      const $price = document.createElement("td");
        $price.classList.add("checkout-table-body-price");
        $price.textContent = `$${formatMoney(i.price * i.quantity)}`;
  
      $row.append($quantity, $item, $price);
      $checkoutTable.append($row);
  
    });
  } else {
    const $row = document.createElement("tr"); 

    const $quantity = document.createElement("td");
      $quantity.classList.add("checkout-table-body-quantity");

    const $item = document.createElement("td");
      $item.classList.add("checkout-table-body-item");
      $item.textContent = "your cart is empty! fill ’er up!";

    const $price = document.createElement("td");
      $price.classList.add("checkout-table-body-price");

    $row.append($quantity, $item, $price);
    $checkoutTable.append($row);
  }

  const $checkoutTotal = document.getElementById("checkout-foot-total");
      $checkoutTotal.textContent = `$${formatMoney(cart.totalAmount())}`;

  // BUILD CO ITEMS DISPLAY

}

const plus = (e) => {
  const fp = e.closest("tr").getAttribute("data-id");
  const item = cart.line_items.find((i) => fp === i.fp );
  cart.setQuantity(fp, item.quantity + 1);
  updateCart();
}

const minus = (e) => {
  const fp = e.closest("tr").getAttribute("data-id");
  const item = cart.line_items.find((i) => fp === i.fp );
  cart.setQuantity(fp, item.quantity - 1);
  if (item.quantity < 1) { cart.remove(fp) };
  updateCart();
}

// move to utilities
const checkIfStorefrontOpen = () => {
  const currentStore = getCurrentStore();
  const date = new Date();
  const now = parseInt(`${date.getHours()}${date.getMinutes().toString().padStart(2, "0")}`);
  const close = getHoursOfOp(currentStore, "close");
  return now < (close * 100);
}

/* TO DO
const getDaysOfOp = () => {
  // check if storefront is open today
} */

// move this to utilities
const getHoursOfOp = (store, type) => {
  const labels = window.labels;
  const date = new Date();
  const today = date.toString().substring(0,3).toLowerCase();
  let todayHours;

  if (store === "pint-club") {
    return "pint-club";
  }

  if (today.includes("sat") || today.includes("sun")) {
    todayHours = labels[`${store}_weekendhours`];
  } else {
    todayHours = labels[`${store}_weekdayhours`];
  }

  let [openHour, closeHour] = todayHours.split(" - ");

  openHour.replace(/am|AM|pm|PM/g, "");
    openHour = parseInt(openHour);
    if (openHour < 12) { openHour += 12 };

  closeHour.replace(/am|AM|pm|PM/g, "");
    closeHour = parseInt(closeHour);
    if (closeHour < 12) { closeHour += 12 };

  if (type === "open") {
    return openHour;
  } else if (type === "close") {
    return closeHour;
  } else {
    return { open: openHour, close: closeHour };
  }
  
}

/*==========================================================
CHECKOUT FUNCTIONALITY
==========================================================*/

const submitOrder = async (store, formData) => {
  let orderParams = {};

  for (prop in formData) {
    switch (prop) {
      case "name":
        orderParams.display_name = formData[prop];
        break;
      case "cell":
        orderParams.cell = formData[prop];
        break;
      case "email":
        orderParams.email_address = formData[prop];
        break;
      case "addr1":
        orderParams.address = formData[prop];
        break;
      case "city":
        orderParams.city = formData[prop];
        break;
      case "state":
        orderParams.state = formData[prop];
        break;
      case "zip":
        orderParams.zip = formData[prop];
        break;
      case "deliverydate":
        orderParams.delivery_at = formData[prop];
          break;
      case "pickuptime":
        orderParams.pickup_at = formData[prop];
        break;
      default:
        // console.log(`${prop} ${formData[prop]} doesn't fit on your order obj`);
        break;
    }
  }

  orderParams.reference_id = generateId();
  
  if (formData.discount) {
    console.log(formData.discount);
  } else {
    console.log(`no discount`);
  }

  orderParams.line_items = [];

  cart.line_items.forEach((i) => {
    const mods = i.mods.map((m) => { return { "catalog_object_id": m }});
    const lineItem = {
      catalog_object_id: i.variation,
      quantity: i.quantity.toString()
    };
    if (mods.length) { lineItem.modifiers = mods };
    orderParams.line_items.push(lineItem); 
  });
  
  let qs = "";
  for (prop in orderParams) {
      if (prop === "line_items") {
        qs += prop + "=" + encodeURIComponent(JSON.stringify(orderParams[prop]));
      } else {
        qs += prop + "=" + encodeURIComponent(orderParams[prop]);
      }
      qs += "&";
  }

  const credentials = getStorefrontCheckoutCred(store);

  const orderObj = await fetch(credentials.endpoint + "?" + qs, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  })
  .catch((error) => {
    console.error(error);
    return makeScreensaverError("something went wrong and your order didn't go through. try again?");
  })
  .then((resp) => {
    if (!resp.ok) {
      return resp.text().then((errorInfo) => { Promise.reject(errorInfo) });
    }
    return resp.text();
  }).then((data) => {
    const obj = JSON.parse(data);
    if (typeof obj.order != "undefined") {
      return obj.order;
    } else {
      console.error("errors:", data);
      return makeScreensaverError("something went wrong and your order didn't go through. try again?");
    }
  })

  return orderObj;
}

const getStorefrontCheckoutCred = (storefront) => {
  // console.log(`get storefront credentials`);
  switch (storefront) {
    case "store":
      // console.log("store", storefront);
      return {
        name: storefront,
        endpoint: "https://script.google.com/macros/s/AKfycbzPFOTS5HT-Vv1mAYv3ktpZfNhGtRPdHz00Qi9Alw/exec",
        locationId: "6EXJXZ644ND0E"
      };
    case "lab":
      // console.log("lab", storefront);
      return {
        name: storefront,
        endpoint: "https://script.google.com/macros/s/AKfycbyQ1tQesQanw1Dd13t0c7KLxBRwKTesCfbHJQdHMMvc02aWiLGZ/exec",
        locationId: "3HQZPV73H8BHM"
      };
    case "delivery":
      // console.log("delivery", storefront);
      return {
        name: storefront,
        endpoint: "https://script.google.com/macros/s/AKfycbwXsVa_i4JBUjyH7DyWVizeU3h5Rg5efYTtf4pcF4FXxy6zJOU/exec",
        locationId: "WPBKJEG0HRQ9F"
      };
    case "pint-club":
      // console.log("pint-club", storefront);
      return {
        name: storefront,
        endpoint: "https://script.google.com/macros/s/AKfycbwXsVa_i4JBUjyH7DyWVizeU3h5Rg5efYTtf4pcF4FXxy6zJOU/exec",
        locationId: "WPBKJEG0HRQ9F"
      };
    case "merch":
      // console.log("merch", storefront);
      return {
        name: storefront,
        endpoint: "https://script.google.com/macros/s/AKfycbzPFOTS5HT-Vv1mAYv3ktpZfNhGtRPdHz00Qi9Alw/exec",
        locationId: "6EXJXZ644ND0E"
      };
    default:
      console.error(`location ${storefront} is not configured`);
      return {
        name: storefront
      };
  }
}

/*==========================================================
STOREFRONT CAROUSELS
==========================================================*/
const resetCarousels = debounce(function() {
  // console.log(`reseting carousels`);
  const currentStore = getCurrentStore();
  const $carousels = document.querySelectorAll(`.embed-internal-${currentStore}menus`);
  if ($carousels) {
    $carousels.forEach((c) => {
      c.scrollLeft = 0;
    })
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

/*==========================================================
ABOUT PAGE
==========================================================*/
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

// move to setup or utilities
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

/*==========================================================
PINT CLUB PAGE
==========================================================*/
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
          populateCustomizationTool("customize your pint club subscription", [ "contact", "pint-club" ]);
          customizeToolforClub(target);
        }
      })
    }
    // console.log($options);
  }
}

const customizeToolforClub = (target) => {
  getContactFromLocalStorage();
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
  const $deliveryOpt = document.getElementById("delivery");
  const $pickupOpt = document.getElementById("pickup");

  if ($deliveryOpt && $pickupOpt) {

    $deliveryOpt.onclick = async (e) => {
      const $customBody = document.querySelector(".customize-table-body");
      const $addrFields = $customBody.querySelectorAll("[data-fieldtype=address]");

      if (!$addrFields.length) {
        let fields = getFields([ "address" ]);
        fields.forEach((f) => {
          $customBody.append(buildFields("customize", f));
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

/*==========================================================
CUSTOMIZATION TOOL
==========================================================*/
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
    $customBody.classList.add("customize-table-body", "customize-form");
  
  const $customFoot = document.createElement("div");
    $customFoot.classList.add("customize-foot");

  $customTable.append($customHead, $customBody);

  $customSection.append($customClose, $customTable, $customFoot);

  $main.append($customSection);
}

const clearCustomizationTool = () => {
  const $customTool = document.querySelector(".customize-table");
  if ($customTool) {
    const $customBody = $customTool.querySelector(".customize-table-body");
      $customBody.innerHTML = ""; 
  
    const $customFoot = document.querySelector(".customize-foot");
      $customFoot.innerHTML = ""; 
  }
}

const populateCustomizationTool = (title, fields) => {

  clearCustomizationTool();

  const $customTool = document.querySelector(".customize-table");

  const $customHead = $customTool.querySelector(".customize-table-head");
    $customHead.textContent = title;
  
  const $customBody = $customTool.querySelector(".customize-table-body");

  let allFields = getFields(fields);

  allFields.forEach((f) => {
    $customBody.append(buildFields("customize", f));
  })

  const $customFoot = document.querySelector(".customize-foot");
  
  const $btn = document.createElement("a");
    $btn.classList.add("btn-rect");
    $btn.textContent = "join the club";
    $btn.onclick = async (e) => {
      const $form = document.querySelector("form");
      const valid = validateSubmission($form);
      if (valid) {
        buildScreensaver("sending in your subscription...");
        await saveToLocalStorage($form);
        const formData = await getSubmissionData($form);
        console.log(`$btn.onclick= -> formData`, formData);
        await clearCustomizationTool();
        await hideCustomizationTool();
        removeScreensaver();
      } else {
        console.error("please fill out all required fields!");
      }
    }
  $customFoot.append($btn);

  showCustomizationTool();
}

const populateCustomizationToolSquare = (title, item) => {
  const itemData = item.item_data;
  const itemVariations = itemData.variations;
  const itemModifiers = itemData.modifier_list_info;

  const $customTool = document.querySelector(".customize-table");

  const $customHead = $customTool.querySelector(".customize-table-head");
  $customHead.textContent = title;

  const $customBody = $customTool.querySelector(".customize-table-body");
  $customBody.innerHTML = ""; // clear on each populate

  if (itemVariations) { // this is ALWAYS a radio, only one choice!

    const $field = document.createElement("div");
    $field.classList.add(`customize-table-body-radio`);
    $field.id = `radio-variation`;

    const $title = document.createElement("h3");
    $title.onclick = (e) => {
      const $parent = e.target.parentNode;
      const $sibling = e.target.nextElementSibling;
      const open = $sibling.getAttribute("data-open");

      if (open === "true") {
        $sibling.classList.add("hide");
        $parent.setAttribute("data-open", false);
        $sibling.setAttribute("data-open", false);
        e.target.setAttribute("data-open", false);
      } else {
        $sibling.classList.remove("hide");
        $parent.setAttribute("data-open", true);
        $sibling.setAttribute("data-open", true);
        e.target.setAttribute("data-open", true);
      }
    };

    if (itemData.name.includes("soft serve")) {
      $title.textContent = "flavor (select 1)"; 
    } else if (itemVariations[0].item_variation_data.name.includes("oz") || itemVariations[0].item_variation_data.name.includes("size")) {
      $title.textContent = "select your size";
    } else if (itemVariations[0].item_variation_data.name.includes("shot")) {
      $title.textContent = "shots";
    } else if (itemVariations[0].item_variation_data.name.includes("varietal")) {
      $title.textContent = "select your varietal";
    } else {
      $title.textContent = "make a selection";
      console.log("hey normal, here's a new scenario:");
      console.log(" >", itemData.name, itemVariations);
    }

    $field.append($title);

    //setup options
    const $optionsContainer = document.createElement("div");
    $optionsContainer.classList.add(
      `customize-table-body-radio-container`,
      "hide"
    );

    itemVariations.forEach((v) => {

      if (
        v.item_variation_data.name.includes("select topping") || 
        v.item_variation_data.name.includes("select a") || 
        v.item_variation_data.name.includes("select an") ||
        v.item_variation_data.name.includes("select your") ||
        v.item_variation_data.name.includes("choose topping") || 
        v.item_variation_data.name.includes("choose a") || 
        v.item_variation_data.name.includes("choose an") ||
        v.item_variation_data.name.includes("choose your") ||
        v.item_variation_data.name.includes("make it")
      ) {
        return; // do not display "make..." or "select..." or "choose..." options
      }
      
      const $label = document.createElement("label");
      $label.classList.add(`customize-table-body-radio-container-optionblock`);
      $label.setAttribute("for", cleanName(v.item_variation_data.name));
      $label.textContent = v.item_variation_data.name;

      const $customEl = document.createElement("span");
      $customEl.classList.add(
        `customize-table-body-radio-container-optionblock-custom`
      );

      const $option = document.createElement("input");
      $option.classList.add(
        `customize-table-body-radio-container-optionblock-option`
      );
      $option.id = cleanName(v.item_variation_data.name);
      $option.name = cleanName(itemData.name);
      $option.type = "radio";
      $option.value = v.id;

      $label.append($option, $customEl);
      $optionsContainer.append($label);
    });
    $field.append($optionsContainer);
    $customBody.append($field);
  }

  if (itemModifiers) { // except for soft serve toppings, these are ALL RADIOS!
    // console.log(``);
    // console.log(itemData.name);

    itemModifiers.forEach((m) => {
      const modCat = catalog.byId[m.modifier_list_id]; // this is a single modifier category (obj)
      const modCatData = modCat.modifier_list_data; // this is a single modifer category WITH DATA I CARE ABOUT (obj)
      const modCatName = modCatData.name; // this is the single modifier category NAME (str)
      const modCatModifiers = modCatData.modifiers; // these are all the modifiers in a category (arr);

      if (
        modCatName.includes("topping 2") ||
        modCatName.includes("topping 3")
      ) {
        return; // only show ONE topping group
      }

      //setup options
      const $field = document.createElement("div");
      $field.classList.add(`customize-table-body-radio`);
      // $field.id = `radio-modifer-${cleanName(modCatName)}`;

      const $title = document.createElement("h3");
      $title.textContent = removeStorefrontName(modCatName);

      // do something special for soft serve toppings
      if (
        itemData.name.includes("soft serve") &&
        modCatName.includes("topping")
      ) {
        // ONLY for soft serve toppings
        const noNumberName = modCatName.replace(/[0-9]/g, "");
        $title.textContent = removeStorefrontName(noNumberName).trim(); // remove numbers
        $title.textContent += "s (select up to 3)";
        $field.id = `radio-modifer-${removeStorefrontName(
          cleanName(noNumberName)
        )}`;
      // all other mod categories (not soft serve toppings)
      } else {
        $title.textContent = removeStorefrontName(modCatName);
      }

      $title.onclick = (e) => {
        const $parent = e.target.parentNode;
        const $sibling = e.target.nextElementSibling;
        const open = $sibling.getAttribute("data-open");

        if (open === "true") {
          $sibling.classList.add("hide");
          $parent.setAttribute("data-open", false);
          $sibling.setAttribute("data-open", false);
          e.target.setAttribute("data-open", false);
        } else {
          $sibling.classList.remove("hide");
          $parent.setAttribute("data-open", true);
          $sibling.setAttribute("data-open", true);
          e.target.setAttribute("data-open", true);
        }
      };

      $field.append($title);

      const $optionsContainer = document.createElement("div");
      $optionsContainer.classList.add(
        `customize-table-body-radio-container`,
        "hide"
      );

      modCatModifiers.forEach((mod) => {
        // console.log(`modCatModifiers.forEach -> mod`, mod);
        const modId = mod.id;
        const modData = mod.modifier_data;
        const modName = modData.name;
        const modPrice = formatMoney(modData.price_money.amount);

        if (
          modName.includes("select topping") || 
          modName.includes("select a") || 
          modName.includes("select an") ||
          modName.includes("select your") ||
          modName.includes("choose topping") || 
          modName.includes("choose a") || 
          modName.includes("choose an") ||
          modName.includes("choose your") ||
          modName.includes("make it")
        ) {
          return; // do not display "make..." or "select..." or "choose..." options
        }

        // do something special for soft serve toppings
        if (
          itemData.name.includes("soft serve") &&
          modCatName.includes("topping")
        ) {
          const noNumberName = modCatName.replace(/[0-9]/g, "");

          const $label = document.createElement("label");
          $label.classList.add(
            `customize-table-body-checkbox-container-optionblock`
          );
          $label.setAttribute("for", cleanName(modName)); // item specific
          $label.textContent = modName; // item specific
          if (modPrice > 0) {
            $label.textContent += ` (+$${modPrice})`;
          }

          const $customEl = document.createElement("span");
          $customEl.classList.add(
            `customize-table-body-checkbox-container-optionblock-custom`
          );

          const $option = document.createElement("input");
          $option.classList.add(
            `customize-table-body-checkbox-container-optionblock-option`,
            `topping-option`
          );
          $option.id = cleanName(modName); // item specific
          $option.name = removeStorefrontName(cleanName(noNumberName)); // name of ENTIRE category
          $option.type = "checkbox";
          $option.value = modId; // item specific id

          $label.append($option, $customEl); // add input el and custom radio btn to label el
          $optionsContainer.append($label); // add label el to options container el
        } else {
          const $label = document.createElement("label");
          $label.classList.add(
            `customize-table-body-radio-container-optionblock`
          );
          $label.setAttribute("for", cleanName(modName)); // item specific
          $label.textContent = modName; // item specific
          if (modPrice > 0) {
            $label.textContent += ` (+$${modPrice})`;
          }

          const $customEl = document.createElement("span");
          $customEl.classList.add(
            `customize-table-body-radio-container-optionblock-custom`
          );

          const $option = document.createElement("input");
          $option.classList.add(
            `customize-table-body-radio-container-optionblock-option`
          );
          $option.id = cleanName(modName); // item specific
          $option.name = cleanName(modCatName); // name of ENTIRE category
          $option.type = "radio";
          $option.value = modId; // item specific id

          $label.append($option, $customEl); // add input el and custom radio btn to label el
          $optionsContainer.append($label); // add label el to options container el
        }
      });

      $field.append($optionsContainer); // add options container el to field el
      $customBody.append($field); // add entire field to custom body el
    });
  }

  const $customFoot = document.querySelector(".customize-foot");
    $customFoot.innerHTML = ""; // clear on each populate

  const $btn = document.createElement("a");
    $btn.classList.add("btn-rect");
    $btn.id = "customize-form";
    $btn.textContent = "add to cart";
    $btn.onclick = async (e) => {
      const targetClass =  e.target.closest("a").id;
      const $form = document.querySelector(`.${targetClass}`);
      const valid = validateSubmission($form);
      if (valid) {
        buildScreensaver("customizing your cone...");
        const formData = await getSubmissionData($form);
        await addConfigToCart(formData);
        await clearCustomizationTool();
        await hideCustomizationTool();
        removeScreensaver();
      } else {
        console.error("please fill out all required fields!");
      }
    };

  $customFoot.append($btn);
  showCustomizationTool();
};

const showCustomizationTool = () => {
  const $customTool = document.querySelector(".customize");
  if ($customTool) {
    // console.log(`showing customization tool`);
    $customTool.classList.remove("hide");
  }
}

const hideCustomizationTool = () => {
  const $customTool = document.querySelector(".customize");
  if ($customTool) {
    // console.log(`hideing customization tool`);
    $customTool.classList.add("hide");
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
          { title: "delivery-option", type: "radio", label: "how do you want to get your pints?", options: [ "pickup", "delivery" ], required: true }
        );
        break;
      case "pick-up":
        allFields.push(
          { title: "pickup-date", type: "text", value: "today", readonly: true },
          { title: "pickup-time", type: "select", placeholder: "select your pickup time", src: "hoursOfOp", required: true }
        )
        break;
      case "discount-code":
        allFields.push(
          { title: "discount", type: "text", placeholder: "discount code" }
        )
        break;
      case "tip":
        allFields.push(
          { title: "tip", type: "select", placeholder: "no tip", src: "tipPercentages" }
        )
        break;
      default:
        console.error("hey normal, you tried to build a form with an invalid field");
        break;
    }
  })
  return allFields;
}

const buildFields = (formType, field) => {
  let $field;

  if (field.type === "radio" || field.type === "checkbox") {
    //setup options
    $field = document.createElement("div");
      $field.classList.add(`${formType}-table-body-${field.type}`);
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
      $optionsContainer.classList.add(`${formType}-table-body-${field.type}-container`, "hide");
    
    field.options.forEach((o) => {
      
      const $label = document.createElement("label");
        $label.classList.add(`${formType}-table-body-${field.type}-container-optionblock`);
        $label.setAttribute("for", cleanName(o));
        $label.textContent = o;

      const $customEl = document.createElement("span");
        $customEl.classList.add(`${formType}-table-body-${field.type}-container-optionblock-custom`);
      
      const $option = document.createElement("input");
        $option.classList.add(`${formType}-table-body-${field.type}-container-optionblock-option`);
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
      $field.classList.add(`${formType}-table-body-selectwrapper`);
    if (field.data) {
      for (dataType in field.data) {
        $field.setAttribute(`data-${dataType}`, field.data[dataType]);
      }
    }
    $select = document.createElement(field.type);
      $select.classList.add(`${formType}-table-body-selectwrapper-select`);
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
      $field.classList.add(`${formType}-table-body-field`);
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

const populateDynamicOptions = ($el, data) => {
  // console.log(`populate dynamic options`);
  // console.log($el)
  // console.log(data);
  data.forEach((d) => {
    const $option = document.createElement("option");
      $option.value = d.value;
      $option.textContent = d.text;
    $el.append($option);
  })
}

/*==========================================================
CHECKOUT TOOL
==========================================================*/

const buildCheckoutTool = () => {
  // console.log(`build checkout tool`);

  const $main = document.querySelector("main");
    const mainTheme = getMainTheme();

  // this is the background
  const $checkoutSection = document.createElement("section");
    $checkoutSection.classList.add("checkout", mainTheme, "hide");

  // this is the container to hold all the checkout stuff
  const $checkoutContainer = document.createElement("div");
    $checkoutContainer.classList.add("checkout-container");

  // this is the back btn
  const $checkoutBack = document.createElement("aside");
    $checkoutBack.classList.add("checkout-back", "btn-back");
    $checkoutBack.innerHTML = `<p>back to ${getLastStore().split("-").join(" ")}</p>`;
    $checkoutBack.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-left">
      <use href="/icons.svg#arrow-left"></use>
    </svg>`;
    $checkoutBack.onclick = (e) => {
      hideCheckoutTool();
    }

  // this is the CHECKOUT CART (all the items)
  const $checkoutTable = document.createElement("table");
    $checkoutTable.classList.add("checkout-table");

    // this is the HEAD of the checkout cart (the title)
  const $checkoutHead = document.createElement("thead");
  $checkoutHead.classList.add("checkout-table-head");
  $checkoutHead.innerHTML = `<tr>
    <th colspan="3">
      <h2>your ${getCurrentStore().split("-").join(" ")} order</h2>
    </th>
  </tr>`;

  // this is the BODY of the checkout cart (all the items)
  const $checkoutBody = document.createElement("tbody");
    $checkoutBody.classList.add("checkout-table-body");
  
  // this is the FOOTER of the checkout cart (total amount)
  const $checkoutFoot = document.createElement("tfoot");
    $checkoutFoot.classList.add("checkout-table-foot");
    $checkoutFoot.innerHTML = `<tr class="checkout-table-foot-total">
      <td colspan="2">total</td>
      <td id="checkout-foot-total"></td>
    </tr>`;

  $checkoutTable.append($checkoutHead, $checkoutBody, $checkoutFoot);

  // this is the CHECKOUT FORM CONTAINER
  const $checkoutFormContainer = document.createElement("div");
    $checkoutFormContainer.classList.add("checkoutform-container", "hide");

  // this is the CHECKOUT FORM
  const $checkoutForm = document.createElement("form");
    $checkoutForm.classList.add("checkout-form");

  let allFields = getFields(["contact", "pick-up", "discount-code"]);

  allFields.forEach((f) => {
    $checkoutForm.append(buildFields("checkout", f));
  });

  getContactFromLocalStorage();

  // this is the CHECKOUT BTN
  const $checkoutBtn = document.createElement("a");
    $checkoutBtn.classList.add("btn-rect");
    $checkoutBtn.id = "checkout-form";
    $checkoutBtn.textContent = "place order";
    $checkoutBtn.onclick = async (e) => {
      const $form = document.querySelector(".checkout-form");
      const valid = validateSubmission($form);
      if (valid) {
        buildScreensaver("checking your order...");
        await saveToLocalStorage($form);
        const formData = await getSubmissionData($form);
        const currentStore = getCurrentStore();
        const orderObj = await submitOrder(currentStore, formData);

        if (orderObj) {
          // await hideCheckoutTool();
          await disableCartEdits();
          await displayOrderObjInfo(orderObj, formData);
          await hideCheckoutForm();
          await buildSquarePaymentForm();
          // await initPaymentForm(currentStore);
          removeScreensaver();
        } else {
          console.error("something went wrong and your order didn't go through. try again?");
          makeScreensaverError("something went wrong and your order didn't go through. try again?")
        }
      } else {
        console.error("please fill out all required fields!");
      }
    };

  $checkoutFormContainer.append($checkoutForm, $checkoutBtn);

  //////////////////////////////////////////////////////////
  $checkoutContainer.append($checkoutBack, $checkoutTable, $checkoutFormContainer);
  $checkoutSection.append($checkoutContainer);

  $main.append($checkoutSection);

}

const showCheckoutTool = () => {
  const $checkoutTool = document.querySelector(".checkout");
  if ($checkoutTool) {
    // console.log(`showing checkout tool`);
    $checkoutTool.classList.remove("hide");
  }
}

const hideCheckoutTool = () => {
  const $checkoutTool = document.querySelector(".checkout");
  if ($checkoutTool) {
    // console.log(`hiding checkout tool`);
    $checkoutTool.classList.add("hide");
  }
}

const hideCheckoutForm = () => {
  const $checkoutFormContainer = document.querySelector(".checkoutform-container");
  if ($checkoutFormContainer) {
    $checkoutFormContainer.classList.add("hide");
  }
}

const disableCartEdits = () => {
  const $quantityBtns = document.querySelectorAll(".quantity");
  if ($quantityBtns) {
    $quantityBtns.forEach((b) => {
      b.remove();
    })
  }
}

const displayOrderObjInfo = (orderObj, formData) => {
  console.log(orderObj);
  console.log(formData);

  const $checkoutTableBody = document.querySelector(".checkout-table-body");
  
  const $checkoutTableFooter = document.querySelector(".checkout-table-foot");

  // TAX INFO
  const $taxRow = document.createElement("tr");

  const $taxTitle = document.createElement("td");
    $taxTitle.colSpan = 2;
    $taxTitle.textContent = "prepared food tax (included)";

  const $taxAmount = document.createElement("td");
    $taxAmount.id = "checkout-foot-tax";
    $taxAmount.textContent = `$${formatMoney(orderObj.total_tax_money.amount)}`;

  $taxRow.append($taxTitle, $taxAmount);

  // TIP INFO
  const $tipRow = document.createElement("tr");

  const $tipTitle = document.createElement("td");
    $tipTitle.colSpan = 2;
    $tipTitle.textContent = "tip";

  const $tipAmount = document.createElement("td");
    $tipAmount.id = "checkout-foot-tip";
    $tipAmount.textContent = `$${formatMoney(0)}`;

  $tipRow.append($tipTitle, $tipAmount);  

  $checkoutTableFooter.prepend($taxRow, $tipRow);
}

const buildSquarePaymentForm = () => {
  const $checkoutContainer = document.querySelector(".checkout-container");
  if ($checkoutContainer) {

    const $sqContainer = document.createElement("div");
      $sqContainer.classList.add("sq-container");

    const fields = getFields( [ "tip" ] );

    fields.forEach((f) => {
      $sqContainer.append(buildFields("sq", f));
    })

    const $tipDropdown = $sqContainer.querySelector("#tip");
    const tipArr = [ 
      { text: "no tip", value: 0 },
      { text: "10%", value: 10 },
      { text: "15%", value: 15 },
      { text: "20%", value: 20 },
      { text: "25%", value: 25 }
    ];

    populateDynamicOptions($tipDropdown, tipArr);

    const $tipWrapper = $sqContainer.querySelector(".sq-table-body-selectwrapper");
      $tipWrapper.append($tipDropdown);

    const $sqForm = document.createElement("div");
      $sqForm.id = "form-container";
      $sqForm.classList.add("sq-form");

    const $sqCard = document.createElement("div");
      $sqCard.id = "sq-card-number";
      $sqCard.classList.add("sq-form-field");

    const $sqExp = document.createElement("div");
      $sqExp.id = "sq-expiration-date";
      $sqExp.classList.add("sq-form-field");

    const $sqCVV = document.createElement("div");
      $sqCVV.id = "sq-cvv";
      $sqCVV.classList.add("sq-form-field");

    const $sqZip = document.createElement("div");
      $sqZip.id = "sq-postal-code";
      $sqZip.classList.add("sq-form-field");

    const $sqBtn = document.createElement("button");
      $sqBtn.id = "sq-creditcard";
      $sqBtn.classList.add("sq-form-btn");
      $sqBtn.textContent = "pay";
      $sqBtn.onclick = (e) => {
        onGetCardNonce(e);
      }

    $sqForm.append($sqCard, $sqExp, $sqCVV, $sqZip, $sqBtn);
    $sqContainer.append($tipWrapper, $sqForm);
    $checkoutContainer.append($sqContainer);
  }
}

/*==========================================================
SCREENSAVER
==========================================================*/
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

const makeScreensaverError = (error) => {
  const $screensaver = document.querySelector(".screensaver");
  if ($screensaver) {
    $screensaver.classList.add("theme-error");
    const $message = document.querySelector(".screensaver-message");
      $message.textContent = error;
    const $refreshBtn = document.createElement("button");
      $refreshBtn.classList.add("screensaver-btn");
      $refreshBtn.textContent = "refresh the page";
      $refreshBtn.onclick = (e) => {
        location.reload();
      }
    $screensaver.append($refreshBtn);
  }
}

/*==========================================================
HEADER
==========================================================*/
const makeCartClickable = () => {
  const $headerCart = document.querySelector(".header-cart");
  if ($headerCart) {
    $headerCart.onclick = (e) => {
      updateCart();
      showCheckoutTool();
    }
  }

}

const setCartTotal = () => {
  const $headerText = document.querySelector(".header-cart-text");
  if ($headerText) { 
    cart.load();
    $headerText.textContent = cart.totalItems() || 0;
  }
};

/*==========================================================
FOOTER
==========================================================*/
const updateCopyright = () => {
  // update copyright year in footer
  const date = new Date();
  const year = date.getFullYear();
  const $footer = document.querySelector("footer > div");
  if (year > 2021) {
    $footer.textContent += ` - ${year}`;
  }
};

/*==========================================================
UTILITIES
==========================================================*/
const cleanName = (str) => {
  if (str) {
    const clean = str
      .split(" ").join("") // remove spaces
      .toLowerCase()
      .replace(/[^0-9a-z]/gi, ""); // replace non alpha-numeric
      return clean;
  }
};

const removeStorefrontName = (str) => {
  if (str) {
    const clean = str.toLowerCase().replace(/store|lab|delivery|merch/g, "");
    return clean;
  }
}

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

const formatMoney = (num) => {
  return Number(num / 100).toFixed(2);
}

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

/*==========================================================
LEGACY
==========================================================*/

var cart = {
  line_items: [],
  shipping_item: {},
  remove: (fp) => {
    var index = cart.line_items.findIndex((li) => fp == li.fp);
    cart.line_items.splice(index, 1);
    cart.store();
  },
  add: (variation, mods) => {
    if (!mods) { mods = []; }
    var li = cart.find(variation, mods);
    if (li) {
      li.quantity++;
    } else {
      var fp = variation;
      var price =
        catalog.byId[variation].item_variation_data.price_money.amount;
      mods.forEach((m) => {
        fp += "-" + m;
        price += catalog.byId[m].modifier_data.price_money.amount;
      });
      cart.line_items.push({
        fp: fp,
        variation: variation,
        mods: mods,
        quantity: 1,
        price: price,
      });
    }
    cart.store();
  },
  addShipping: (variation) => {
    var fp = variation;
    var price = catalog.byId[variation].item_variation_data.price_money.amount;
    cart.shipping_item = {
      fp: fp,
      variation: variation,
      mods: [],
      quantity: 1,
      price: price,
    };
  },
  find: (variation, mods) => {
    var fp = variation;
    mods.forEach((m) => {
      fp += "-" + m;
    });
    return cart.line_items.find((li) => fp === li.fp);
  },
  setQuantity: (fp, q) => {
    var index = cart.line_items.findIndex((li) => fp == li.fp);
    cart.line_items[index].quantity = q;
    cart.store();
  },
  totalAmount: () => {
    var total = 0;
    cart.line_items.forEach((li) => {
      if (li.quantity > 0) {
        total += li.price * li.quantity;
      }
    });
    // add shipping to total on delivery orders
    if (storeLocation === "delivery" && cart.shipping_item.price) {
      total += cart.shipping_item.price;
    }
    return total;
  },
  totalItems: () => {
    var total = 0;
    cart.line_items.forEach((li) => {
      // don't count out-of-stock
      if (li.quantity) {
        total += li.quantity;
      }
    });
    return total;
  },
  clear: () => {
    cart.line_items = [];
    cart.shipping_item = {};
    cart.store();
  },
  store: () => {
    localStorage.setItem(
      "cart-" + getCurrentStore(),
      JSON.stringify({ lastUpdate: new Date(), line_items: cart.line_items })
    );
  },
  load: () => {
    
    var cartObj = JSON.parse(localStorage.getItem("cart-" + getLastStore()));
    cart.line_items = [];

    if (cartObj && cartObj.line_items) {
      // validate
      cartObj.line_items.forEach((li) => {
        if (catalog.byId[li.variation]) {
          var push = true;
          li.mods.forEach((m) => {
            if (!catalog.byId[m]) { push = false };
          });
          if (push) { cart.line_items.push(li) };
        }
      });
    }

  }
};

function indexCatalog() {
  catalog = {
    byId: {},
    items: [],
    categories: [],
    discounts: {},
  };
  catalog_raw.forEach((e) => {
    if (!catalog.byId[e.id]) catalog.byId[e.id] = e;

    if (e.type == "ITEM") {
      catalog.items.push(e);
      if (e.item_data.variations)
        e.item_data.variations.forEach((v) => {
          catalog.byId[v.id] = v;
        });
    }
    if (e.type == "MODIFIER_LIST") {
      if (e.modifier_list_data.modifiers)
        e.modifier_list_data.modifiers.forEach((m) => {
          m.modifier_data.modifier_list_id = e.id;
          // console.log(m.modifier_data.modifier_list_id);
          catalog.byId[m.id] = m;
        });
    }
    if (e.type == "DISCOUNT") {
      if (e.discount_data.name) {
        catalog.discounts[e.discount_data.name.toLowerCase()] = { id: e.id };
      }
    }
    if (e.type == "CATEGORY") {
      catalog.categories.push(e);
    }
  });
} 

function addToCart(e) {
  var id = e.getAttribute("data-id");
  if (id) {
    var obj = catalog.byId[id];
    if (obj.type === "ITEM") {
      if (
        obj.item_data.modifier_list_info ||
        obj.item_data.variations.length > 1
      ) {
        var callout = findCallout(e.parentNode);
        configItem(obj, callout);
      } else {
        cart.add(obj.item_data.variations[0].id);
        updateCart();
      }
    } else {
      cart.add(obj.id);
      updateCart();
    }
  }
}

function addConfigToCart(formData) {
  let variation;
  let mods = [];

  for (const key in formData) {
    if (!variation) {
      variation = formData[key];
    } else if (typeof formData[key] === "object") {
      // push all checkboxes
      formData[key].forEach((k) => {
        mods.push(k);
      });
    } else {
      mods.push(formData[key]);
    }
  }

  cart.add(variation, mods)
  updateCart();
}

// NOT WORKING in this environment -- necessary?
function findCallout($parent) { 
  // console.log(`findCallout is running`);
  // console.log(`\nfindCallout -> $parent`, $parent);
  var callout="";
  var $e=$parent.nextSibling;
  while ($e && $e.tagName != $parent.tagName) {
    if ($e.tagName === "P" && $e.textContent.indexOf("*") === 0) {
        callout += `<p>${$e.textContent}</p>`;        
    }
    $e = $e.nextSibling;
  }
  // console.log(`\nfindCallout -> callout`, callout);
  return callout;
}

function configItem(item, callout) {
  const itemName = item.item_data.name;
  populateCustomizationToolSquare(`customize your ${removeStorefrontName(itemName).trim()}`, item);
  customizeToolforStore();
}

function legacyupdateCart() {
  const labels = window.labels;

  var cartEl = document.getElementById("cart");

  var count = cart.totalItems();

  if (count > 0) {
    cartEl.classList.remove("hidden");
  } else {
    cartEl.classList.add("hidden");
    document.body.classList.remove("noscroll");
  }

  // check delivery cart
  if (storeLocation === "delivery") {
    const $zipSelect = document.getElementById("delivery-zip");
    const zipValue = parseInt($zipSelect.value);
    let match;

    // convert dollar amount from google sheet to cents for comparison
    const minOrder = parseInt(window.labels.delivery_free) * 100;
    // check if zip is set and available
    const deliveryDate = cartEl.querySelector("#delivery-date").value;
    if (!zipValue) {
      // if zip has not been selected yet
    } else if (cart.totalAmount() - cart.shipping_item.price < minOrder) {
      match = window.deliveryZips.find((zip) => {
        return zip.zip === zipValue;
      });
      cartEl.querySelector(
        ".freedelivery"
      ).textContent = `${labels.checkout_minorder}${labels.delivery_free}.`;
      cartEl.querySelector(".freedelivery").classList.remove("hidden");
      cartEl.querySelector(".freedelivery").textContent += ` you're $${
        (minOrder - (cart.totalAmount() - cart.shipping_item.price)) / 100
      } away!`;
    } else {
      cartEl.querySelector(
        ".freedelivery"
      ).textContent = `${labels.checkout_minorder}${labels.delivery_free}.`;
      cartEl.querySelector(".freedelivery").classList.add("hidden");
    }
    if (
      deliveryDate.includes("SOLD OUT") ||
      deliveryDate.includes("select your zip")
    ) {
      cartEl.querySelector("#orderBtn").disabled = true;
      cartEl.querySelector("#orderBtn").classList.add("hidden");
    } else {
      cartEl.querySelector("#orderBtn").disabled = false;
      cartEl.querySelector("#orderBtn").classList.remove("hidden");
    }
  }

  var summaryEl = cartEl.querySelector(".summary");
  summaryEl.innerHTML = `${count} item${
    count == 1 ? "" : "s"
  } in your cart ($${formatMoney(
    cart.totalAmount()
  )}) <button onclick="toggleCartDisplay()">check out</button>`;

  var lineitemsEl = cartEl.querySelector(".lineitems");
  let oosMessageDiv = document.createElement("div");
  oosMessageDiv.className = "line item";
  let oosMessage = document.createElement("div");
  oosMessage.setAttribute("id", "oos");
  oosMessage.className = "desc oos";

  // placeholders for ALL out of stock items
  var oosItems = [];
  var oosItemStr = `oh no, we're out of `;

  var html = ``;

  cart.line_items.forEach((li) => {
    var v = catalog.byId[li.variation];
    var i = catalog.byId[v.item_variation_data.item_id];
    var mods = "";
    var cone = "";
    if (i.item_data.name == "lab cone" && li.quantity > 0)
      cone = `<div class="cone">${createConeFromConfig(li.mods)}</div>`;
    li.mods.forEach(
      (m, i) => (mods += ", " + catalog.byId[m].modifier_data.name)
    );
    if (li.quantity > 0) {
      html += `<div class="line item" data-id="${li.fp}">
          <div class="q"><span onclick="minus(this)" class="control">-</span> ${
            li.quantity
          } <span class="control" onclick="plus(this)">+</span></div>
          <div class="desc">${cone} 
          ${i.item_data.name} : ${v.item_variation_data.name} ${mods}</div>
          <div class="amount">$${formatMoney(li.quantity * li.price)}</div>
          </div>`;
    } else if (li.quantity === "OUT OF STOCK") {
      let oosItem;
      if (i.item_data.name == "soft serve") {
        oosItem = `${v.item_variation_data.name} ${i.item_data.name}`;
        oosItems.push(oosItem);
      } else {
        oosItem = `${i.item_data.name}s`;
        oosItems.push(oosItem);
      }
    }
  });

  if (storeLocation === "delivery") {
    const shipping = cart.shipping_item;
    const validShipping = Object.entries(shipping).length;
    // display shipping info at the bottom of the cart
    let shippingLi;
    if (validShipping) {
      const v = catalog.byId[shipping.variation];
      const i = catalog.byId[v.item_variation_data.item_id];
      const zip = document.getElementById("delivery-zip").value;

      if (shipping.fp === "GTMQCMXMAHX4X6NFKDX5AYQC") {
        // convert dollar amount from google sheet to cents for comparison
        const minOrder = parseInt(window.labels.delivery_free) * 100;
        shippingLi = `<div class="line shipping"><span class="desc">${
          i.item_data.name
        } (to ${zip} on orders over $${formatMoney(
          minOrder
        )})</span><span class="amount">$${formatMoney(
          v.item_variation_data.price_money.amount
        )}</span></div>`;
      } else {
        shippingLi = `<div class="line shipping"><span class="desc">${
          i.item_data.name
        } (to ${zip})</span><span class="amount">$${formatMoney(
          v.item_variation_data.price_money.amount
        )}</span></div>`;
      }

      // shippingLi = `<div class="line shipping"><span class="desc">${i.item_data.name} (to ${zip})</span><span class="amount">$${formatMoney(v.item_variation_data.price_money.amount)}</span></div>`
    } else {
      shippingLi = `<div class="line shipping"><span class="desc">shipping + handling</span><span class="amount">(calculated after you select your zip)</span></div>`;
    }
    html += shippingLi;
  }

  html += `<div class="line total"><div class="q"></div><div class="desc">total</div><div>$${formatMoney(
    cart.totalAmount()
  )}</div>`;

  lineitemsEl.innerHTML = html;

  // build oos item message, if items in cart are out of stock
  if (oosItems.length) {
    switch (oosItems.length) {
      case 0:
        break;
      case 1:
        oosItemStr += `${oosItems[0]} right now`;
        break;
      case 2:
        oosItemStr += `${oosItems[0]} and ${oosItems[1]} right now`;
        break;
      default:
        for (let i = 0; i < oosItems.length - 1; i++) {
          oosItemStr += `${oosItems[i]}, `;
        }
        oosItemStr += `and ${oosItems[oosItems.length - 1]} right now`;
        break;
    }

    oosMessage.innerHTML += `<div id="oos-close" onclick="removeOOS()"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-close"><use href="/icons.svg#close"></use></svg>`;
    oosMessage.innerHTML += oosItemStr;
    oosMessage.innerHTML += `<br />we've removed them from your cart`;
    oosMessageDiv.append(oosMessage);
    lineitemsEl.prepend(oosMessageDiv);
  }

  var checkoutItemsEl = cartEl.querySelector(".checkoutitems");
  html = "";

  var coCategory = catalog.categories.find(
    (e) => e.category_data.name == "checkout items " + storeLocation
  );
  if (coCategory) {
    var coItems = catalog.items.filter(
      (i) => i.item_data.category_id == coCategory.id
    );
    if (coItems.length) {
      html = `<div>${labels.checkout_addtoorder}</div>`;
      coItems.forEach((i) => {
        var price = formatMoney(
          i.item_data.variations[0].item_variation_data.price_money.amount
        );
        var id = i.item_data.variations[0].id;
        var name = i.item_data.name;
        var checked = cart.find(id, []) ? "checked" : "";
        html += `<div><input type="checkbox" ${checked} value="${id}" onclick="toggleCart(this)">${name} ($${price})</input></div>`;
      });
    }
  }

  checkoutItemsEl.innerHTML = html;
}

async function legacysubmitOrder() {
  // console.log(`submitOrder running`);
  removeOOS();
  var alertEl=document.getElementById("alert").remove();
  var cartEl=document.getElementById("cart");

  var orderParams={};
  var now=false;
  orderParams.pickup_at=document.getElementById("pickup-time").value || "delivery";
  if (orderParams.pickup_at=="now") {
      now=true;
      orderParams.pickup_at=new Date().toISOString();
      orderParams.now="yes";
  } else if (orderParams.pickup_at === "delivery") {
      delete orderParams.pickup_at; // remove pickup from delivery orders
      orderParams.email_address = document.getElementById("email").value;

      const deliveryDate = document.getElementById("delivery-date").getAttribute("data-date");
      orderParams.deliver_at = new Date(deliveryDate).toISOString();

      const deliveryAddress = document.getElementById("delivery-address").value;
      const deliveryCity = document.getElementById("delivery-city").value; 
      const deliveryState = document.getElementById("delivery-state").value; 
      const deliveryZip = document.getElementById("delivery-zip").value;
      const deliveryFullAddress = [deliveryAddress, deliveryCity, deliveryState, deliveryZip];
      // if the address is missing any piece
      if (deliveryFullAddress.includes("")) {
          document.getElementById("delivery-address").focus();
          return;
      }
      orderParams.address = deliveryAddress;
      orderParams.city = deliveryCity;
      orderParams.state = deliveryState;
      orderParams.zip = deliveryZip;
  }
  orderParams.display_name=document.getElementById("name").value;
  orderParams.cell=document.getElementById("cell").value;
  orderParams.reference_id=generateId();
  orderParams.discount_name=document.getElementById("discount").value;
  orderParams.discount=document.getElementById("discount").getAttribute("data-id");

  // console.log(`  submitOrder -> orderParams`, orderParams);

  if (cart.itemCount==0) return;
  if (orderParams.display_name=="") {
      document.getElementById("name").focus();
      return;
  }
  if (orderParams.cell=="") {
      document.getElementById("cell").focus();
      return;
  }
  if (orderParams.email_address=="") { // if the email address is missing
      document.getElementById("email").focus();
      return;
  }
  if (orderParams.discount=="" && orderParams.discount_name) {
      document.getElementById("discount").focus();
      alert("we don't recognize this discount anymore, typo?");
      return;
  }

  localStorage.setItem("name",orderParams.display_name);
  localStorage.setItem("cell",orderParams.cell);
  localStorage.setItem("address",orderParams.address);
  localStorage.setItem("email",orderParams.email_address);

  cartEl.querySelector(".lineitems").classList.add("hidden");
  cartEl.querySelector(".checkoutitems").classList.add("hidden");
  cartEl.querySelector(".info").classList.add("hidden");
  var orderEl=cartEl.querySelector(".order");
  orderEl.classList.remove("hidden");
  orderEl.innerHTML=`<div class="ordering"><svg><use href="/icons.svg#normal"></use></svg></div>`;

  var nomore = await checkCart();
  // console.log(`submitOrder -> nomore`, nomore);

  if (nomore.length>0) {
      var sorry="we are so sorry we just ran out of "
      nomore.forEach((li, i) => {
      // console.log(`submitOrder -> li`, li);
          var v=catalog.byId[li.variation];
          var item=catalog.byId[v.item_variation_data.item_id];
              sorry+=(i?", ":"")+item.item_data.name+" : "+v.item_variation_data.name;
          cart.remove(li.fp);
      })
      sorry+=". we will refresh the store so you can look for alternatives. so sorry.";
      alert(sorry);
      window.location.reload();
      return;
  }
  
  orderParams.line_items=[];
  cart.line_items.forEach((li) => { 
      // console.log(`submitOrder -> li`, li);
      var mods=[];
      li.mods.forEach((m) => mods.push({"catalog_object_id": m}));
      var line_item = {
          "catalog_object_id": li.variation,
          "quantity": ""+li.quantity 
      };    
      if (mods.length) {
          line_item.modifiers=mods;
      }
      orderParams.line_items.push(line_item);       
  });

  if (storeLocation === "delivery") {
      orderParams.line_items.push({
          "catalog_object_id": cart.shipping_item.variation,
          "quantity": ""  + cart.shipping_item.quantity
      });
  }
      
  var qs="";
  for (var a in orderParams) {
      if (a=="line_items") {
          qs+=a+"="+encodeURIComponent(JSON.stringify(orderParams[a]));
      } else {
          qs+=a+"="+encodeURIComponent(orderParams[a]);
      }
      qs+="&";
  }

  // console.log ("order qs: "+qs);

  fetch(storeLocations[storeLocation].endpoint + "?" + qs, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
  .catch((err) => {
      alert("Network error: " + err);
  })
  .then((response) => {
      // console.log(`\n  submitOrder -> response`, response);
      // console.log(`\n  submitOrder -> response.url`, response.url);
      if (!response.ok) {
        return response.text().then((errorInfo) => Promise.reject(errorInfo));
      }
      // console.log(`  submitOrder -> response.text()`, response.text());
      return response.text();
  })
  .then((data) => {
      // console.log(`\n    submitOrder -> data`);
      // console.log(data);
      var obj = JSON.parse(data);
      // console.log(`    submitOrder -> obj`, obj);
      if (typeof obj.order != "undefined") {
        displayOrder(obj.order);
      } else {
        alert("order submission failed. sorry.");
      }
  })
  .catch((err) => {
      console.error(err);
  });       
}

function generateId() {
  var id = "";
  var chars = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = 0; i < 4; i++) {
    id += chars[randomNum(0, chars.length - 1)];
  }
  return id;
}

function initPaymentForm(currentStore) {
  const credentials = getStorefrontCheckoutCred(currentStore);
  // Create and initialize a payment form object
  let paymentForm = new SqPaymentForm({
    // Initialize the payment form elements

    applicationId: "sq0idp-q-NmavFwDX6MRLzzd5q-sg",
    locationId: credentials.locationId,
    inputClass: "sq-input",
    autoBuild: false,
    // Customize the CSS for SqPaymentForm iframe elements
    // inputStyles: [
    //   {
    //     fontFamily: "sans-serif",
    //     fontSize: "16px",
    //     lineHeight: "24px",
    //     padding: "16px",
    //     placeholderColor: "#a0a0a0",
    //     color: getComputedStyle(document.documentElement)
    //       .getPropertyValue("--text-color")
    //       .trim(),
    //     backgroundColor: "transparent",
    //   },
    // ],
    // Initialize the credit card placeholders
    cardNumber: {
      elementId: "sq-card-number",
      placeholder: "card number",
    },
    cvv: {
      elementId: "sq-cvv",
      placeholder: "cvv",
    },
    expirationDate: {
      elementId: "sq-expiration-date",
      placeholder: "mm/yy",
    },
    postalCode: {
      elementId: "sq-postal-code",
      placeholder: "zip",
    },

    // SqPaymentForm callback functions
    callbacks: {
      /*
       * callback function: cardNonceResponseReceived
       * Triggered when: SqPaymentForm completes a card nonce request
       */
      cardNonceResponseReceived: function (errors, nonce, cardData) {
        if (errors) {
          // Log errors from nonce generation to the browser developer console.
          console.error("Encountered errors:");
          errors.forEach(function (error) {
            alert(error.message);
            console.error("  " + error.message);
          });
          submittingPayment = false;
          return;
        }
        //    console.log(`The generated nonce is:\n${nonce}`);

        var tipAmount = getTip();

        var qs = `nonce=${encodeURIComponent(
          nonce
        )}&order_id=${encodeURIComponent(
          order.id
        )}&reference_id=${encodeURIComponent(
          order.reference_id
        )}&order_amount=${order.total_money.amount}&tip_amount=${tipAmount}`;

        fetch(storeLocations[storeLocation].endpoint + "?" + qs, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })
          .catch((err) => {
            alert("Network error: " + err);
            submittingPayment = false;
          })
          .then((response) => {
            if (!response.ok) {
              return response
                .text()
                .then((errorInfo) => Promise.reject(errorInfo));
            }
            return response.text();
          })
          .then((data) => {
            //   console.log(data);
            var obj = JSON.parse(data);
            if (typeof obj.errors != "undefined") {
              var message =
                "Payment failed to complete!\nCheck browser developer console for more details";
              if (obj.errors[0].category == "PAYMENT_METHOD_ERROR") {
                message = "Credit Card declined, please check your entries";
              }
              if (obj.errors[0].code == "CVV_FAILURE") {
                message = "Credit Card declined, please check your CVV";
              }
              if (obj.errors[0].code == "PAN_FAILURE") {
                message = "Credit Card declined, please check your card number";
              }

              if (obj.errors[0].code == "VOICE_FAILURE") {
                message =
                  "Credit Card declined, issuer requires voice authorization, try a different card";
              }

              if (obj.errors[0].code == "TRANSACTION_LIMIT") {
                message = "Credit Card declined, limit exceeded";
              }

              alert(message);
              submittingPayment = false;
            } else {
              // console.log(`initPaymentForm -> obj`, obj);
              displayThanks(obj.payment);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      },
    },
  });

  paymentForm.build();
}

/*==========================================================
INIT
==========================================================*/

window.onload = async (e) => {

  await fetchLabels();

  indexCatalog(); // legacy

  // make page useable
  classify();
  codify();
  setPage();
  buildCheckoutTool(); // needs to be on all the pages
  
  // setup header
  setCartTotal();
  makeCartClickable();
  
  setupHead();
  buildBackToTopBtn();
  updateCopyright();
};

window.onscroll = showBackToTopBtn;
window.onresize = resetCarousels;
