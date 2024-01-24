const textSlide = document.querySelector(".text-slide");
const text = textSlide.querySelectorAll("p");

const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

let counter = 1;
const size = text[0].clientWidth;

//to set the slide one as the first slide instead of the clone
textSlide.style.transform = `translateX(-${size * counter}px)`;

//looping the slider every 2s
setInterval(() => {
    if (counter >= text.length - 1) return;

    textSlide.style.transition = `transform 0.8s ease`;
    counter++;
    textSlide.style.transform = `translateX(-${size * counter}px)`;

}, 3000);

textSlide.addEventListener('transitionend', () => {
    if (text[counter].id === 'lastClone') {
        textSlide.style.transition = `none`;
        counter = text.length - 2;
        textSlide.style.transform = `translateX(-${size * counter}px)`;
    }

    if (text[counter].id === 'firstClone') {
        textSlide.style.transition = `none`;
        counter = text.length - counter;
        textSlide.style.transform = `translateX(-${size * counter}px)`;
    }
});


next.addEventListener('click', () => {
    if (counter >= text.length - 1) return;
    textSlide.style.transition = `transform 0.5s `;
    counter++;
    textSlide.style.transform = `translateX(-${size * counter}px)`;
});

prev.addEventListener('click', () => {
    if (counter <= 0) return;
    textSlide.style.transition = `transform 0.5s ease`;
    counter--;
    textSlide.style.transform = `translateX(-${size * counter}px)`;
});