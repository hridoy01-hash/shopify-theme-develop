// money format
let CurrencyFormat = function (cents, format) {
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

// popup product content

window.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.quick_view_btn').forEach((btn) => {
        btn.addEventListener('click', function () {
            const quickViewProduct = btn.getAttribute('data-quickView-handle');
            // const moneyFormat = btn.getAttribute('data-money-format');
            const format = document.querySelector('[data-money-format]').getAttribute('data-money-format')
            console.log("moneyFormat" , format);
            document.querySelector(".quick_view_wrapper").classList.add("active_popup");
            document.querySelector(".quick_view_wrapper").style.display = `flex`;
            singleProduct(quickViewProduct);
            async function singleProduct(item) {
                try {
                    const response = await fetch(`/products/${item}.js`);
                    const product = await response.json();
                    console.log("product quick", product);

                    // product image
                    document.querySelector(".product_display_image").src = `${product.featured_image}`;

                    const Images = product.images;
                    for (let i = 0; i < Images.length; i++) {
                        const image = Images[i];

                        const li = elementMaker("li", ["single_image_wrapper"]);
                        const Image = elementMaker("img", ["single_galary_image"]);
                        li.appendChild(Image);
                        Image.setAttribute("src", `${image}`);
                        document.querySelector(".product_galary_item").appendChild(li);
                    }

                    document.querySelector(".vendor_name").textContent = `${product.vendor}`;
                    document.querySelector(".product_name").textContent = `${product.title}`;
                    const price = `${product.price}`
                    document.querySelector(".selling_price").textContent = `BDT ${price} Tk`;
                    document.querySelector(".product_desciption").textContent = `${product.description}`;



                } catch (error) {
                    console.log("Error", error);
                }
            }
        });
    });


    // popup close
    document.querySelector(".close_btn").addEventListener("click", function () {
        document.querySelector(".quick_view_wrapper").classList.remove("active_popup");

        document.querySelector(".product_display_image").src = ``;
        document.querySelector(".product_galary_item").textContent = " ";
        document.querySelector(".quick_view_wrapper").style.display = `none`;
    })

    // create element fucntion
    function elementMaker(name, className, id) {
        try {
            let element = document.createElement(name);
            className && (element.className = className.join(' '));
            id && (element.id = id);
            return element;
        } catch (err) {
            console.log(err.message);
        }
    }

    function setAttributes(elementName, allAttributes) {
        for (let key in allAttributes) {
            elementName.setAttribute(key, allAttributes[key]);
        }
    }
})