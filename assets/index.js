// GLOBAL VARIABLES
let storeLocation;

const setPage = () => {
  const path = window.location.pathname;
  if (path.includes("lab")) {
    console.log("lab");
  } else if (path.includes("delivery")) {
    console.log("delivery");
  } else if (path.includes("merch")) {
    console.log("merch");
  } else if (path.includes("pint-club")) {
    console.log("pint-club");
  } else { // default location is store
    console.log("store");
  }
}

const classify = () => {
  const $h1s = document.querySelectorAll("h1");
  const $h2s = document.querySelectorAll("h2");
  const $h3s = document.querySelectorAll("h3");
  if ($h1s) {
    $h1s.forEach((h1) => {
      let text = cleanName(h1.textContent);
      h1.setAttribute("class", text);
      h1.parentNode.setAttribute("id", text);
    })
  }
  if ($h2s) {
    $h2s.forEach((h2) => {
      let text = cleanName(h2.textContent);
      h2.setAttribute("class", text);
      h2.parentNode.setAttribute("id", text);
    })
  }
  if ($h3s) {
    $h3s.forEach((h3) => {
      let text = cleanName(h3.textContent);
      h3.setAttribute("class", text);
      h3.parentNode.setAttribute("id", text);
    })
  }
  
}

const cleanName = (str) => {
  const clean = str.split(" ").join("") // remove spaces
    .toLowerCase()
    .replace(/[^0-9a-z]/gi, ''); // replace non alpha-numeric
  return clean;
}

updateCopyright = () => {
  // update copyright year in footer
  const date = new Date; 
  const year = date.getFullYear();
  const $footer = document.querySelector("footer > div");
  if (year > 2021) {
    console.log(year);
    $footer.textContent += ` - ${year}`;
  }
}

window.onload = (event) => {
  console.log("page is fully loaded");

  setPage();
  classify();
  updateCopyright();
};
