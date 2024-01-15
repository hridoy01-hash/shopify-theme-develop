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
        });

}