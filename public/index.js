/*
 * Name: Zichao Chen, Sheng-Hao Chen
 * Date: Dec 11, 2021
 * Course: CSE 154
 *
 * This is an E-commerce webpage written by JS.
 * It can show a list of products including informations.
 * The users can apply for an account to log in, buy product and share reviews.
 */
"use strict";

(function() {

  let currentProductId;
  let currentConfirmationNumber;
  let purchaseDate;

  window.addEventListener("load", init);

  /**
   * Initializing function: when the webpage is loaded,
   * it enables the home button, search bar, log in/out button, orders button.
   * In addition, it initializes function of filtering different categories and leave reviews
   * Above functions will relate to some functions to request the product info.
   */
  function init() {
    getProducts();
    id("home-btn").addEventListener("click", home);
    id("search-bar").addEventListener("input", enableSearchBtn);
    id("search-btn").addEventListener("click", getProducts);
    id("login-btn").addEventListener("click", function() {
      switchView(id("login-view"), id("signup-view"), id("order"), id("home"),
                 id("product-detail"), id("purchase-view"));
    });
    id("login-form").addEventListener("submit", function(e) {
      e.preventDefault();
      login();
    });
    id("logout-btn").addEventListener("click", logout);
    id("order-btn").addEventListener("click", getOrders);
    id("grid-btn").addEventListener("click", switchToGrid);
    id("list-btn").addEventListener("click", switchToList);
    id("signup-btn").addEventListener("click", function() {
      switchView(id("signup-view"), id("home"), id("order"), id("login-view"),
                 id("purchase-view"), id("product-detail"));
    });
    id("signup-form").addEventListener("submit", function(e) {
      e.preventDefault();
      signUp();
    });
    id("purchase-form").addEventListener("submit", function(e) {
      e.preventDefault();
      confirm();
    })
    id("confirm-btn").addEventListener("click", finish);
    id("laptop").addEventListener("click", function() {
      if (id("laptop").checked === true) {
        checkFilter(id("laptop"), id("smartphone"), id("smartwatch"),
                    id("gameconsole"), id("tv"), id("tablet"));
      } else {
        uncheckFilter(id("laptop"), id("smartphone"), id("smartwatch"),
                      id("gameconsole"), id("tv"), id("tablet"));
      }
      filter(id("laptop"));
    });
    id("smartphone").addEventListener("click", function() {
      if (id("smartphone").checked === true) {
        checkFilter(id("smartphone"), id("laptop"), id("smartwatch"),
                    id("gameconsole"), id("tv"), id("tablet"));
      } else {
        uncheckFilter(id("laptop"), id("smartphone"), id("smartwatch"),
                      id("gameconsole"), id("tv"), id("tablet"));
      }
      filter(id("smartphone"));
    });
    id("smartwatch").addEventListener("click", function() {
      if (id("smartwatch").checked === true) {
        checkFilter(id("smartwatch"), id("laptop"), id("smartphone"),
                    id("gameconsole"), id("tv"), id("tablet"));
      } else {
        uncheckFilter(id("laptop"), id("smartphone"), id("smartwatch"),
                      id("gameconsole"), id("tv"), id("tablet"));
      }
      filter(id("smartwatch"));
    });
    id("gameconsole").addEventListener("click", function() {
      if (id("gameconsole").checked === true) {
        checkFilter(id("gameconsole"), id("laptop"), id("smartphone"),
                    id("smartwatch"), id("tv"), id("tablet"));
      } else {
        uncheckFilter(id("laptop"), id("smartphone"), id("smartwatch"),
                      id("gameconsole"), id("tv"), id("tablet"));
      }
      filter(id("gameconsole"));
    });
    id("tv").addEventListener("click", function() {
      if (id("tv").checked === true) {
        checkFilter(id("tv"), id("laptop"), id("smartphone"),
                    id("smartwatch"), id("gameconsole"), id("tablet"));
      } else {
        uncheckFilter(id("laptop"), id("smartphone"), id("smartwatch"),
                      id("gameconsole"), id("tv"), id("tablet"));
      }
      filter(id("tv"));
    });
    id("tablet").addEventListener("click", function() {
      if (id("tablet").checked === true) {
        checkFilter(id("tablet"), id("laptop"), id("smartphone"),
                    id("smartwatch"), id("tv"), id("gameconsole"));
      } else {
        uncheckFilter(id("laptop"), id("smartphone"), id("smartwatch"),
                      id("gameconsole"), id("tv"), id("tablet"));
      }
      filter(id("tablet"));
    });
    id("feedback-form").addEventListener("submit", function(e) {
      e.preventDefault();
      feedback();
    })
  }

  /**
   * Returns an url of the endpoint that corrsponds to the input status of the search bar.
   * @returns {String} - the url of the endpoint that corresponds to the input status
   *                     of the search bar
   */
  function getUrl() {
    if (id("search-bar").value.trim().length > 0) {
      return "/products?search=" + id("search-bar").value.trim();
    }
    return "/products";
  }

  /**
   * Send request to get all the product info or only the ones that matched the search result.
   */
  function getProducts() {
    fetch(getUrl())
      .then(statusCheck)
      .then(resp => resp.json())
      .then(processData)
      .catch(handleError);

    /**
     * Checks the status of the request to the server to see if it is successful or not.
     * @param {object} response - contains the information of the request to the server
     * @returns {object} returns information about the request if it is successful
     */
    async function statusCheck(response) {
      if (!response.ok) {
        throw new Error(await response.json());
      }
      return response;
    }

    /**
     * Processes the data sent back from the server and display all the products info
     * or only the ones that matched the search result
     * @param {object} responseData - contains the data sent back from the server in JSON format
     */
    function processData(responseData) {
      if (id("search-bar").value.trim().length > 0) {
        displaySearchedProducts(responseData);
      } else {
        displayAllProducts(responseData);
      }
      id("search-btn").disabled = true;
    }
  }

  /**
   * Filter the products displayed based on the user's choice.
   * @param {string} category - the category which the user selected.
   */
  function filter(category) {
    if (category.checked === true) {
      fetch("/filters/" + category.value)
        .then(statusCheck)
        .then(resp => resp.json())
        .then(processData)
        .catch(handleError);
    } else {
      let cards = document.querySelectorAll("#home article");
      for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("hidden");
      }
    }

    /**
     * Checks the status of the request to the server to see if it is successful or not.
     * @param {object} response - contains the information of the request to the server
     * @returns {object} returns information about the request if it is successful
     */
    async function statusCheck(response) {
      if (!response.ok) {
        throw new Error(await response.json());
      }
      return response;
    }

    /**
     * Processes the data from the server and only shows the category is user selected.
     * @param {object} responseData - contains the data sent back from the server in JSON format
     */
    function processData(responseData) {
      let cards = document.querySelectorAll("#home article");
      for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("hidden");
      }
      displaySearchedProducts(responseData);
    }
  }

  /**
   * Disable all the other filters once one of the filter is selected
   * @param {object} filter1 - the category1.
   * @param {object} filter2 - the category2.
   * @param {object} filter3 - the category3.
   * @param {object} filter4 - the category4.
   * @param {object} filter5 - the category5.
   * @param {object} filter6 - the category6.
   */
  function checkFilter(filter1, filter2, filter3, filter4, filter5, filter6) {
    filter1.disabled = false;
    filter2.disabled = true;
    filter3.disabled = true;
    filter4.disabled = true;
    filter5.disabled = true;
    filter6.disabled = true;
  }

  /**
   * Enable all the filter options once the user toggles off the selected filter.
   * @param {object} filter1 - the category1.
   * @param {object} filter2 - the category2.
   * @param {object} filter3 - the category3.
   * @param {object} filter4 - the category4.
   * @param {object} filter5 - the category5.
   * @param {object} filter6 - the category6.
   */
  function uncheckFilter(filter1, filter2, filter3, filter4, filter5, filter6) {
    filter1.disabled = false;
    filter2.disabled = false;
    filter3.disabled = false;
    filter4.disabled = false;
    filter5.disabled = false;
    filter6.disabled = false;
  }

  /**
   * Allows the user to login in with their username and password
   */
  function login() {
    let data = new FormData();
    data.append("username", id("username").value.trim());
    data.append("password", id("password").value.trim());
    fetch("/login", {method: "POST", body: data})
      .then(statusCheck)
      .then(resp => resp.text())
      .then(processData)
      .catch(handleError);

    /**
     * Checks the status of the request to the server to see if it is successful or not.
     * @param {object} response - contains the information of the request to the server
     * @returns {object} returns information about the request if it is successful
     */
    async function statusCheck(response) {
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response;
    }

    /**
     * Changes the display components once the user is logged in.
     * @param {object} responseData - contains the data sent back from the server in text format
     */
    function processData(responseData) {
      window.localStorage.setItem("username", id("username").value.trim());
      id("login-btn").classList.add("hidden");
      id("logout-btn").classList.remove("hidden");
      id("order-btn").classList.remove("hidden");
      id("signup-btn").classList.add("hidden");
      switchView(id("home"), id("signup-view"), id("order"), id("login-view"),
                 id("purchase-view"), id("product-detail"));
    }
  }

  /**
   * Allows the user to log out
   */
  function logout() {
    let data = new FormData();
    // data.append("username", document.cookie);
    fetch("/logout", {method: "POST", body: data})
      .then(statusCheck)
      .then(resp => resp.text())
      .then(processData)
      .catch(handleError);

    /**
     * Checks the status of the request to the server to see if it is successful or not.
     * @param {object} response - contains the information of the request to the server
     * @returns {object} returns information about the request if it is successful
     */
    async function statusCheck(response) {
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response;
    }

    /**
     * Changes the display components once the user is logged out.
     * @param {object} responseData - contains the data sent back from the server in text format
     */
    function processData(responseData) {
      id("login-btn").classList.remove("hidden");
      id("logout-btn").classList.add("hidden");
      id("order-btn").classList.add("hidden");
      id("signup-btn").classList.remove("hidden");
      switchView(id("home"), id("signup-view"), id("order"), id("login-view"),
                 id("purchase-view"), id("product-detail"));
      id("username").value = "";
      id("password").value = "";
    }
  }

  /**
   * Allows the user to sign up for an account
   */
  function signUp() {
    let data = new FormData();
    data.append("email", id("email").value);
    data.append("username", id("signup-username").value.trim());
    data.append("password", id("signup-password").value.trim());
    fetch("/signup", {method: "POST", body: data})
      .then(statusCheck)
      .then(resp => resp.text())
      .then(processData)
      .catch(handleError);

    /**
     * Checks the status of the request to the server to see if it is successful or not.
     * @param {object} response - contains the information of the request to the server
     * @returns {object} returns information about the request if it is successful
     */
    async function statusCheck(response) {
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response;
    }

    /**
     * Changes the display components once the user has signed up for an account
     * @param {object} responseData - contains the data sent back from the server in JSON format
     */
    function processData(responseData) {
      id("email").value = "";
      id("signup-username").value = "";
      id("signup-password").value = "";
      switchView(id("home"), id("signup-view"), id("order"), id("login-view"),
                 id("purchase-view"), id("product-detail"));
    }
  }

  /**
   * Allows the user to see their previous orders if they are logged in
   */
  function getOrders() {
    let username = window.localStorage.getItem("username");
    fetch("/orders/" + username)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(processData)
      .catch(handleError);

    /**
     * Checks the status of the request to the server to see if it is successful or not.
     * @param {object} response - contains the information of the request to the server
     * @returns {object} returns information about the request if it is successful
     */
    async function statusCheck(response) {
      if (!response.ok) {
        throw new Error(await response.json());
      }
      return response;
    }

    /**
     * Processes the data from the server and displays the previous transactions of the user
     * @param {object} responseData - contains the data sent back from the server in JSON format
     */
    function processData(responseData) {
      while (id("transactions").firstChild) {
        id("transactions").removeChild(id("transactions").firstChild);
      }
      switchView(id("order"), id("signup-view"), id("home"), id("login-view"),
                 id("purchase-view"), id("product-detail"));
      for (let i = 0; i < responseData.length; i++) {
        let card = createAndAppend("article", id("transactions"));
        card.classList.add("card-list");
        let image = createAndAppend("img", card);
        image.src = "img/" + responseData[i].name.toLowerCase().replaceAll(" ", "-") + ".png";
        image.alt = "image of " + responseData[i].name;
        let content = createAndAppend("div", card);
        let name = createAndAppend("p", content);
        name.textContent = "Product: " + responseData[i].name;
        name.classList.add("product-name");
        name.classList.add("bold");
        let confirmatioNumber = createAndAppend("p", content);
        confirmatioNumber.textContent = "Confirmation Number: " + responseData[i].confirmation_number;
        let date = createAndAppend("p", content);
        date.textContent = "Purchase date: " + responseData[i].date;
    }
  }
  }
  /**
   * Handles and reports to the client any error that occurs during the fetch process
   */
  function handleError() {
    id("error-message").classList.remove("hidden");
    let buttons = id("grid-container").querySelectorAll("button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
    let inputs = id("grid-container").querySelectorAll("input");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
  }

  /**
   * Enables the search button if there is a valid input to the search bar.
   * @param {Object} e - the input status of the search bar
   */
  function enableSearchBtn(e) {
    if (e.target.value.trim().length > 0) {
      id("search-btn").disabled = false;
    } else {
      id("search-btn").disabled = true;
    }
  }

  /**
   * Displays only the products info that matched the search result
   * @param {object} responseData - contains the data sent back from the server in JSON format
   */
  function displaySearchedProducts(responseData) {
    switchView(id("home"), id("product-detail"), id("order"), id("login-view"),
               id("purchase-view"), id("signup-view"));
    let matchedID = [];
    for (let i = 0; i < responseData.length; i++) {
      matchedID.push(responseData[i].product_id);
    }
    let cards = document.querySelectorAll("#home article");
    for (let i = 0; i < cards.length; i++) {
      if (!matchedID.includes(parseInt(cards[i].id))) {
        cards[i].classList.add("hidden");
      } else {
        cards[i].classList.remove("hidden");
      }
    }
  }

  /**
   * Displays all the products info
   * @param {object} responseData - contains the data sent back from the server in JSON format
   */
  function displayAllProducts(responseData) {
    for (let i = 0; i < responseData.length; i++) {
      let card = createAndAppend("article", id("home"));
      card.classList.add("card-list");
      card.id = responseData[i].product_id;
      singleProductList(responseData[i], card);
      card.addEventListener("click", function() {
        getProductDetail(responseData[i].product_id);
      });
    }
  }

  /**
   * Displays the info of a single product in list view
   * @param {object} responseData - contains the data sent back from the server in JSON format
   * @param {object} card - the DOM object that consists of info of a single product
   */
  function singleProductList(responseData, card) {
    let image = createAndAppend("img", card);
    image.src = "img/" + responseData.name.toLowerCase().replaceAll(" ", "-") + ".png";
    image.alt = "image of " + responseData.name;
    let content = createAndAppend("div", card);
    let name = createAndAppend("p", content);
    name.textContent = responseData.name;
    name.classList.add("product-name");
    name.classList.add("bold");
    let description = createAndAppend("p", content);
    description.textContent = responseData.descriptions;
    let price = createAndAppend("p", content);
    price.classList.add("bold");
    price.textContent = "$" + responseData.price;
    let availability = createAndAppend("p", content);
    availability.textContent = responseData.availability;
    if (availability.textContent === "In Stock") {
      availability.classList.add("green");
    } else {
      availability.classList.add("red");
    }
    let rating = createAndAppend("p", content);
    if (responseData.rating != undefined) {
      rating.textContent = "rating: " + responseData.rating;
    }
  }

  /**
   * Retrives the detail of the product selected by the user
   * @param {Integer} productId - the id of the product selected
   */
  function getProductDetail(productId) {
    switchView(id("product-detail"), id("home"), id("order"), id("login-view"),
               id("purchase-view"), id("signup-view"));
    fetch("/products/" + productId)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(processData)
      .catch(handleError);

    /**
     * Checks the status of the request to the server to see if it is successful or not.
     * @param {object} response - contains the information of the request to the server
     * @returns {object} returns information about the request if it is successful
     */
    async function statusCheck(response) {
      if (!response.ok) {
        throw new Error(await response.json());
      }
      return response;
    }

    /**
     * Processes the data and displays the detail of the product selected by the user
     * @param {object} responseData - contains the data sent back from the server in JSON format
     */
    function processData(responseData) {
      currentProductId = productId;
      switchView(id("product-detail"), id("home"), id("order"), id("login-view"),
                 id("purchase-view"), id("signup-view"));
      id("product-detail").removeChild(id("product-detail").firstChild);
      let card = document.createElement("article");
      id("product-detail").prepend(card);
      card.classList.add("card-list");
      singleProductList(responseData, card);
      let buyBtn = createAndAppend("button", card);
      buyBtn.textContent = "Buy";
      buyBtn.addEventListener("click", buy);
      let rateBtn = createAndAppend("button", card);
      rateBtn.textContent = "Rate product";
      rateBtn.addEventListener("click", function() {
        id("feedback-form").classList.remove("hidden");
      });
    }
  }

  /**
   * Allows the user to buy a product
   */
  function buy() {
    let data = new FormData();
    data.append("productId", currentProductId);
    fetch("/buy", {method: "POST", body: data})
      .then(statusCheck)
      .then(resp => resp.json())
      .then(processData)
      .catch(handleError);

    /**
     * Checks the status of the request to the server to see if it is successful or not.
     * @param {object} response - contains the information of the request to the server
     * @returns {object} returns information about the request if it is successful
     */
    async function statusCheck(response) {
      if (!response.ok) {
        throw new Error(await response.json());
      }
      return response;
    }

    /**
     * Processes the data and allows the user to buy the product selected if the user is logged in
     * @param {object} responseData - contains the data sent back from the server in JSON format
     */
    function processData(responseData) {
      switchView(id("purchase-view"), id("home"), id("order"), id("login-view"),
                 id("product-detail"), id("signup-view"));
      id("success-heading").classList.add("hidden");
      if (id("orderInfo-card")) {
        id("purchase-view").removeChild(id("orderInfo-card"));
      }
      let card = document.createElement("article");
      id("purchase-view").prepend(card);
      card.classList.add("card-list");
      card.id = "product-card";
      let image = createAndAppend("img", card);
      image.src = "img/" + responseData.name.toLowerCase().replaceAll(" ", "-") + ".png";
      image.alt = "image of " + responseData.name;
      let content = createAndAppend("div", card);
      let name = createAndAppend("p", content);
      name.textContent = responseData.name;
      name.classList.add("product-name");
      let description = createAndAppend("p", content);
      description.textContent = responseData.descriptions;
      let price = createAndAppend("p", content);
      price.textContent = "$" + responseData.price;
      id("purchase-form").classList.remove("hidden");
    }
  }

  /**
   * Displays the product info and payment info to allow the user to confirm that
   * they are the correct info
   */
  function confirm() {
    let data = new FormData();
    data.append("productId", currentProductId);
    data.append("creditCardNumber", id("credit-card-number").value);
    data.append("securityCode", id("security-code").value);
    fetch("/confirm", {method: "POST", body: data})
      .then(statusCheck)
      .then(resp => resp.json())
      .then(processData)
      .catch(handleError);

    /**
     * Checks the status of the request to the server to see if it is successful or not.
     * @param {object} response - contains the information of the request to the server
     * @returns {object} returns information about the request if it is successful
     */
    async function statusCheck(response) {
      if (!response.ok) {
        throw new Error(await response.json());
      }
      return response;
    }

    /**
     * Displays the product and payment info for the user to confirm their correctness
     * @param {object} responseData - contains the data sent back from the server in JSON format
     */
    function processData(responseData) {
      id("confirm-heading").classList.remove("hidden");
      id("purchase-form").classList.add("hidden");
      let paymentInfo = createAndAppend("article", id("purchase-view"));
      paymentInfo.classList.add("card-list");
      paymentInfo.id = "paymentInfo-card";
      let content = createAndAppend("div", paymentInfo);
      let cardNumber = createAndAppend("p", content);
      cardNumber.textContent = "Credit Card Number: " + id("credit-card-number").value;
      let securityCode = createAndAppend("p", content);
      securityCode.textContent = "Security Code: " + id("security-code").value;
      id("confirm-btn").classList.remove("hidden");
      currentConfirmationNumber = responseData.confirmation_number;
      purchaseDate = responseData.date;
    }
  }

  /**
   * Displays to the user that the transaction is successful
   */
  function finish() {
    id("credit-card-number").value = "";
    id("security-code").value = "";
    id("purchase-view").removeChild(id("product-card"));
    id("purchase-view").removeChild(id("paymentInfo-card"));
    id("confirm-heading").classList.add("hidden");
    id("success-heading").classList.remove("hidden");
    let orderInfo = createAndAppend("article", id("purchase-view"));
    orderInfo.classList.add("card-list");
    orderInfo.id = "orderInfo-card";
    let content = createAndAppend("div", orderInfo);
    let confirmationNumber = createAndAppend("p", content);
    confirmationNumber.textContent = "Confirmation Number: " + currentConfirmationNumber;
    let date = createAndAppend("p", content);
    date.textContent = "Purchase date: " + purchaseDate;
    id("confirm-btn").classList.add("hidden");
  }

  /**
   * Allows the user to rate and provide feedback to a product if they are logged in
   */
  function feedback() {
    let data = new FormData();
    data.append("productId", currentProductId);
    data.append("rating", id("rating").value);
    data.append("comment", id("comment").value);
    fetch("/feedback", {method: "POST", body: data})
      .then(statusCheck)
      .then(resp => resp.json())
      .then(processData)
      .catch(handleError);

    /**
     * Checks the status of the request to the server to see if it is successful or not.
     * @param {object} response - contains the information of the request to the server
     * @returns {object} returns information about the request if it is successful
     */
    async function statusCheck(response) {
      if (!response.ok) {
        throw new Error(await response.json());
      }
      return response;
    }

    /**
     * Allows the user to rate and provide comment to a selected product
     * @param {object} responseData - contains the data sent back from the server in JSON format
     */
    function processData(responseData) {
      id("feedback-form").classList.add("hidden");
      let card = document.createElement("article");
      id("product-detail").insertBefore(card, id("feedback-form"));
      card.classList.add("card-list");
      let content = createAndAppend("div", card);
      let username = createAndAppend("p", content);
      username.textContent = "user: " + responseData.username;
      username.classList.add("product-name");
      username.classList.add("bold");
      let rating = createAndAppend("p", content);
      rating.textContent = "Rating: " + responseData.rating;
      let comment = createAndAppend("p", content);
      comment.textContent = "Comment: " + responseData.comment;
    }
  }

  /**
   * Allows the user to switch the display to a list view
   */
  function switchToList() {
    let cards = document.querySelectorAll("#home article");
    id("home").classList.add("list-view");
    id("home").classList.remove("grid-view");
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.add("card-list");
      cards[i].classList.remove("card-grid");
    }
  }

  /**
   * Allows the user to switch the display to a grid view
   */
  function switchToGrid() {
    let cards = document.querySelectorAll("#home article");
    id("home").classList.add("grid-view");
    id("home").classList.remove("list-view");
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.add("card-grid");
      cards[i].classList.remove("card-list");
    }
  }

  /**
   * Creates a new DOM object and appends it to the given parent object.
   * @param {String} tag - the tag of a DOM object
   * @param {Object} parent - DOM object represents the parent of the created element
   * @returns {Object} - DOM object of a newly created element
   */
  function createAndAppend(tag, parent) {
    let element = document.createElement(tag);
    parent.appendChild(element);
    return element;
  }

  /**
   * Only shows one of the views and hide the rest
   * @param {object} show - the view that we want to show
   * @param {object} hide1 - first view we want to hide
   * @param {object} hide2 - second view we want to hide
   * @param {object} hide3 - third view we want to hide
   * @param {object} hide4 - fourth view we want to hide
   * @param {object} hide5 - fifth view we want to hide
   */
  function switchView(show, hide1, hide2, hide3, hide4, hide5) {
    show.classList.remove("hidden");
    hide1.classList.add("hidden");
    hide2.classList.add("hidden");
    hide3.classList.add("hidden");
    hide4.classList.add("hidden");
    hide5.classList.add("hidden");
  }

  /**
   * Switch the display to the home view and redisplays all the products
   */
  function home() {
    switchView(id("home"), id("product-detail"), id("order"), id("login-view"),
               id("purchase-view"), id("signup-view"));
    let cards = document.querySelectorAll("#home article");
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.remove("hidden");
    }
  }

  /**
   * Returns the element with the given id.
   * @param {String} id - id of a DOM object
   * @returns {object} - DOM object with the given id
   */
  function id(id) {
    return document.getElementById(id);
  }
})();
