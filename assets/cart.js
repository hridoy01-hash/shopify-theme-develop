// money format
let formatMoney = function (cents, format) {
    if (typeof cents == 'string') { cents = cents.replace('.', ''); }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || this.money_format);

    function defaultOption(opt, def) {
        return (typeof opt == 'undefined' ? def : opt);
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = defaultOption(precision, 2);
        thousands = defaultOption(thousands, ',');
        decimal = defaultOption(decimal, '.');

        if (isNaN(number) || number == null) { return 0; }

        number = (number / 100.0).toFixed(precision);

        var parts = number.split('.'),
            dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
            cents = parts[1] ? (decimal + parts[1]) : '';

        return dollars + cents;
    }

    switch (formatString.match(placeholderRegex)[1]) {
        case 'amount':
            value = formatWithDelimiters(cents, 2);
            break;
        case 'amount_no_decimals':
            value = formatWithDelimiters(cents, 0);
            break;
        case 'amount_with_comma_separator':
            value = formatWithDelimiters(cents, 2, '.', ',');
            break;
        case 'amount_no_decimals_with_comma_separator':
            value = formatWithDelimiters(cents, 0, '.', ',');
            break;
    }

    return formatString.replace(placeholderRegex, value);
};

// js debaounce function
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// pass item quantity and data key
document.querySelectorAll(".qunty_wraperr .icon_wrapper").forEach((button) => {
    button.addEventListener("click", function () {
        // get input quantity
        const input = button.parentElement.querySelector("input");
        const value = Number(input.value);

        // increase qnty
        const isPlus = button.classList.contains("plus_button");
        const key = button.closest(".cart_item").getAttribute("data-key")
        if (isPlus) {
            let newValue = value + 1;
            input.value = newValue;
            changeItemQuantity(key, newValue);
        } else if (value > 1) {
            let newValue = value - 1;
            input.value = newValue;
            changeItemQuantity(key, newValue);
        }
    });
});

// remove single item from cart
document.querySelectorAll(".remove_line_item").forEach((remove) => {
    remove.addEventListener("click", function (e) {
        e.preventDefault();

        const item = remove.closest(".cart_item");
        const key = item.getAttribute("data-key");

        axios.post("/cart/change.js", {
            id: key,
            quantity: 0,
        })
            .then((res) => {
                const updateCart = res.data;
                if (updateCart.item_count == 0) {
                    document.querySelector("#cart_form").remove();
                    const cartHeading = document.createElement("div");
                    cartHeading.innerHTML = `
                    <div class="cart_heading">
                      <div class="cart_empty_content text-center">
                        <h3>Your cart is empty.</h3><br>
                        <a class="btn btn-primary text-center" href="{{ routes.root_url  }}">Keep Shopping</a>
                      </div>
                  </div>
                    `;
                    document.querySelector(".cart_main_container").appendChild(cartHeading);
                    document.querySelector(".cart_count_number").textContent = `${updateCart.item_count}`;
                } else {
                    item.remove();
                    document.querySelector(".cart_count_number").textContent = `${updateCart.item_count}`;
                }

            });
    });
});

// update cart note
document.querySelector('[name="note"]').addEventListener("keyup", debounce((e) => {
    console.log("e.target.value", e.target.value);

    axios.post('cart/update.js', {
        note: e.target.value
    })
}, 500));

// update cart object
function changeItemQuantity(key, quantity) {
    console.log({ quantity, key });

    axios.post("/cart/change.js", {
        id: key,
        quantity
    })
        .then((res) => {
            const format = document.querySelector('[data-money-format]').getAttribute('data-money-format')
            let cart = res.data;
            console.log("cart", cart);
            const item = cart.items.find((item) => item.key == key);
            console.log("item", item);
            const finalLinePrice = item.final_line_price
            document.querySelector(`[data-key="${key}"] .line_total_price`).textContent = formatMoney(finalLinePrice, format);

            document.querySelector(".total_item_final_price").textContent = formatMoney(`${cart.total_price}`, format);

            // update header cart item count number
            document.querySelector(".cart_count_number").textContent = `${cart.item_count}`;
        });

}

