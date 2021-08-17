let petIcon = require("~/images/icons/pet.svg");
let toxicIcon = require("~/images/icons/toxic.svg");
let sunNoIcon = require("~/images/icons/no-sun.svg");
let sunLowIcon = require("~/images/icons/low-sun.svg");
let sunHighIcon = require("~/images/icons/high-sun.svg");
let waterRarelyIcon = require("~/images/icons/1-drop.svg");
let waterDailyIcon = require("~/images/icons/2-drops.svg");
let waterRegularlyIcon = require("~/images/icons/3-drops.svg");

const page = {
  functions: {
    handleSubmit: () => {
        let params = "?";
        let requestPath = `${document.querySelectorAll(".page-greenthumb form")[0].getAttribute("action")}`;

        document.querySelectorAll(".page-greenthumb form select").forEach(e => {
            e.addEventListener("change", e => {
                const formData = new FormData(document.querySelector('.page-greenthumb form'));
                let iterations = formData.entries().length;
                let params = "?";

                for (var selectVal of formData.entries()) {
                    if(selectVal[1] != "null") {
                        params += `${selectVal[0]}=${selectVal[1]}${!--iterations?'&':''}`;
                    }
                }
                page.functions.xmlHttpHandler(`${requestPath}${params}`);
            });
        });
    },
    xmlHttpHandler: function(requestPath) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    page.functions.handleUpdateComponent(JSON.parse(xhr.responseText))
                } else if(xhr.status == 422) {
                    console.log(`Error: ${JSON.parse(xhr.responseText).error}`);
                    page.functions.noResult(true);
                } else {
                    console.log('Something went wrong, please try again in few minutes.');
                    page.functions.noResult(true);
                }
            }
        }
        xhr.open('GET', requestPath, true);
        xhr.send();
    },
    handleUpdateComponent: function(data) {
        if(data.length) {
            page.functions.noResult(false);
            if(document.querySelectorAll(".product-tile-container").length) {
                document.querySelectorAll(".product-tile-container")[0].remove();
            }
            
            let domElement = document.createElement('div');
            
            let template = "", hasStaffFavorite = false;
            data.map(e => {
                template += `<div class="product-tile-box ${
                  e.staff_favorite && !hasStaffFavorite
                    ? "staff-favorite"
                    : "standart-tile"
                }">
                    <div class=staff-favorite--tag ${
                      e.staff_favorite && !hasStaffFavorite
                        ? ""
                        : "hidden"
                    }>
                        <span>✨ Staff favorite</span>
                    </div>
                    <div class="image-container">
                        <img src="${e.url}" alt="${e.name}-greenthumb">
                    </div>
                    <div class="column-container">
                        <div class="title"><span>${e.name}</span></div>
                        <div class="attributes">
                            <div class="price">
                                <span>$${e.price}</span>
                            </div>
                            <div class="icons-container">
                                <img src="${petIcon}" alt="pick-greenthumb">
                                ${
                                  e.toxicity
                                    ? `<img src="${toxicIcon}" alt="pick-greenthumb">`
                                    : ""
                                }
                                ${
                                  e.sun == "no"
                                    ? `<img src="${sunNoIcon}" alt="pick-greenthumb">`
                                    : e.sun == "low"
                                    ? `<img src="${sunLowIcon}" alt="pick-greenthumb">`
                                    : e.sun == "high"
                                    ? `<img src="${sunHighIcon}" alt="pick-greenthumb">`
                                    : ""
                                }
                                ${
                                  e.water == "rarely"
                                    ? `<img src="${waterRarelyIcon}" alt="pick-greenthumb">`
                                    : e.water == "daily"
                                    ? `<img src="${waterDailyIcon}" alt="pick-greenthumb">`
                                    : e.water == "regularly"
                                    ? `<img src="${waterRegularlyIcon}" alt="pick-greenthumb">`
                                    : ""
                                }
                            </div>
                        </div>
                    </div>
                </div>`;

                hasStaffFavorite = e.staff_favorite ? true : hasStaffFavorite;
            });

            domElement.classList.add('product-tile-container');

            domElement.innerHTML = template;
            document.querySelectorAll('.results-container .wrapper .products-list-container')[0].insertBefore(domElement, null);
            document.querySelectorAll(".back-to-top")[0].classList.remove("hidden");
        } else {
            document.querySelectorAll(".back-to-top")[0].classList.add("hidden");
        }
    },
    noResult: function(isNoResult) {
        if(isNoResult) {
            document.querySelectorAll(".no-results-container")[0].classList.remove('hidden');
            document.querySelectorAll(".products-list-container")[0].classList.add('hidden');
        } else {
            document.querySelectorAll(".no-results-container")[0].classList.add('hidden');
            document.querySelectorAll(".products-list-container")[0].classList.remove('hidden');
        }
    },
    scrollTop: function() {
        document.querySelectorAll(".back-to-top")[0].addEventListener("click", () => {
            if (document.scrollingElement.scrollTop === 0) return;
      
            const totalScrollDistance = document.scrollingElement.scrollTop;
            let scrollY = totalScrollDistance,
              oldTimestamp = null;
      
            function step(newTimestamp) {
              if (oldTimestamp !== null) {
                scrollY -=
                  (totalScrollDistance * (newTimestamp - oldTimestamp)) / 400;
                if (scrollY <= 0) return (document.scrollingElement.scrollTop = 0);
                document.scrollingElement.scrollTop = scrollY;
              }
              oldTimestamp = newTimestamp;
              window.requestAnimationFrame(step);
            }
            window.requestAnimationFrame(step);
        });
    }
  },
  events: {
    Initialize: function (window) {
      page.functions.handleSubmit();
      page.functions.scrollTop();
    },
  },
};

window.onload = page.events.Initialize(this);
