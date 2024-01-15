const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');

addToCartForms.forEach((form) => {
    form.addEventListener("submit", async function (event) {

        //Prevent normal submission
        event.preventDefault();

        //Submit form with ajax
        await fetch("/cart/add", {
            method: "post",
            body: new FormData(form),
        });

        //Get new cart object
        const res = await fetch("/cart.json");
        const cart = await res.json();

        //update cart count
        document.querySelector(".cart_count_number").textContent = `${cart.item_count}`;

        //show cart added successfull message
        form.querySelector(".add_cart").style.backgroundColor = `black`;
        form.querySelector(".add_cart").style.color = `white`;


        
    });
});