'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content')
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


////////////////////////////////////////

// ********** First way to scrooling smoothly into a section **************** //

// btnScrollTo.addEventListener('click', function(e){
  //   const s1Coords = section1.getBoundingClientRect();
//   console.log(s1Coords);
//   // console.log(e.target.getBoundingClientRect())

//   console.log(`current scroll (X/Y) : ${window.pageXOffset} / ${window.pageYOffset}`)
//   console.log('coords of section 1 :', s1Coords.left, s1Coords.top)
//  // To go to the section target you shoud add current scroll to the coords of section
//   // window.scrollTo(s1Coords.left + window.pageXOffset, s1Coords.top + window.pageYOffset)

//   // console.log('height/width viewport : ', document.documentElement.clientHeight, document.documentElement.clientWidth)

//   window.scrollTo({
  //     left: s1Coords.left + window.pageXOffset,
  //     top: s1Coords.top + window.pageYOffset,
  //     behavior: 'smooth'
  //   })
  // })
  

  // ************ the second way to scroll into a section ******** //

  btnScrollTo.addEventListener('click', function (e) {
    section1.scrollIntoView({ behavior: 'smooth' })
  })

////////////////////////////////////////////

// document.querySelectorAll('.nav__link').forEach
// (function(el){
  //   el.addEventListener('click', function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id)
//     document.querySelector(id)
//     .scrollIntoView({behavior: 'smooth'});
//   })
// })

// 1. Add event listener to common parent element 
// 2. Determine what element originated the envent


document.querySelector('.nav__links')
.addEventListener('click', function(e){
  e.preventDefault()
  if(e.target.classList.contains('nav__link')){
    // e.preventDefault();
        const id = e.target.getAttribute('href');
        console.log(id)
        document.querySelector(id)
        .scrollIntoView({behavior: 'smooth'});
      }
    });
    

    // Tabbed component 
// tabs.forEach(tab => tab.addEventListener('click', ()=> console.log('clicked')))

tabsContainer.addEventListener('click', (e)=>{
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  
  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t=>t.classList
    .remove('operations__tab--active'))
  tabsContent.forEach(t=>t.classList
    .remove('operations__content--active'))
    
    // Active tab
    clicked.classList.add('operations__tab--active')
    // Activate content area
    document
  .querySelector(`.operations__content--${clicked.dataset.tab}`)
  .classList.add('operations__content--active');

});


// Menu fade animation
const handleHover = (e, opacity) =>{
  if (e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img')    
    // console.log(link)

    siblings.forEach(el=> {
      if(el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
}

nav.addEventListener('mouseover', function(e){
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function(e){
  handleHover(e, 1)
});

// Sticky navigation

// ****** methode one ***** //
// const initialCoords = section1.getBoundingClientRect()
// console.log(initialCoords.top)

// window.addEventListener('scroll', function(e){
//   console.log(window.scrollY)
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky') 
//   else nav.classList.remove('sticky')

//   // (window.scrollY > initialCoords.top) ? nav.classList.add('sticky') : nav.classList.remove('sticky')

// })


// Sticky navigation : The intersection Observer API

// const obsCallback = function (entries, observer){
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// }

// const obsOptions = {
//   root: null,
//   threshold: 0.1
// }

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

// ****** methode two ***** //

const header = document.querySelector('.header');

const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight)

const stickyNav = function(entries) {
  const [entry] = entries;
  // console.log(entry)

  if(!entry.isIntersecting){
    nav.classList.add('sticky')
  }else{
    nav.classList.remove('sticky')
  }
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);



// Reveal sections
const allSelections = document.querySelectorAll('.section')
const revealSection = (entries, observer) =>{
  const [entry] = entries;
  // console.log(entry)

  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden')
}

const options = {
  root: null,
  threshold: 0.15
}
const sectionObserver = new IntersectionObserver(revealSection, options)

allSelections.forEach(function (section){
  sectionObserver.observe(section);
  // section.classList.add('section--hidden')
})

// Lazy loading images
const imgTargets = document.querySelectorAll('.features__img')
// console.log(imgTargets)

const loadImg = function (entries, obserser){
  const [entry] = entries;
  // console.log(entry)

  if(!entry.isIntersecting)return;

  // Replase scr with data-scr
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img')
  });

  obserser.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0
})

imgTargets.forEach(img => imgObserver.observe(img))


// Slides 

const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots')


let curSlide = 0;
const curMax = slides.length - 1;

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots()

const goToSlide = (slide) =>{
  slides.forEach((s, i)=>{
    s.style.transform = `translateX(${100 * (i - slide)}%)`
  })
}


goToSlide(0);

const nextSlide = () => {
  if(curSlide === curMax){
    curSlide = 0
  }else{
    curSlide++
  }

  goToSlide(curSlide)
}

const prevSlide = () =>{
  if(curSlide === 0){
    curSlide = curMax;
  }else{
    curSlide--
  }

  goToSlide(curSlide)
}

btnRight.addEventListener('click', nextSlide)

btnLeft.addEventListener('click', prevSlide)



document.addEventListener('keydown', function (e){
  // console.log(e.key)
  if(e.key === 'ArrowRight')nextSlide()
  if(e.key === 'ArrowLeft') prevSlide()
  
})









///////////////////////////////////////////

// // Selecting elements
// console.log(document.documentElement)
// console.log(document.head)
// console.log(document.body)

// const header = document.querySelector('.header');
// // const allSelections = document.querySelectorAll('.section');
// // console.log(allSelections)
// // document.getElementById('section--1');
// // const allButtons = document.getElementsByTagName('button')
// // console.log(allButtons)
// // console.log(document.getElementsByClassName('btn'))

// // // Creating and inserting elements
// // // insertAjacentHTML


// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 
// message.innerHTML = 'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// // prepend method is adding element 
// // as a first child in the parent element 
// // header.prepend(message);
// // append method is adding element 
// // as a last child in the parent element 
// header.append(message);
// // header.append(message.cloneNode(true))

// // NOTE ✅:
// // We can use the prepends and appends not only to insert elements 
// // but also to move them


// // Delete elements
// document
// .querySelector('.btn--close-cookie')
// .addEventListener('click',function(){
//   message.remove();
// })

// // // Styles
// // message.style.backgroundColor = '#37283d';
// // message.style.width = '120%'

// // console.log(message.style.color)
// // console.log(message.style.backgroundColor)

// // console.log(getComputedStyle(message).height);

// // message.style.height = Number.parseFloat(getComputedStyle(message).height) + 30 + 'px'
// // console.log(getComputedStyle(message).height)

// // document.documentElement.style.setProperty('--color-primary', 'orangered')

// // // Attributes

// // const logo = document.querySelector('.nav__logo');
// // console.log(logo.alt)
// // console.log(logo.src)


// Event 

// const h1 = document.querySelector('h1');

// const alertH1 = function () {
//   alert('addEventListener: Great! You are reading the heading :D');
//   h1.removeEventListener('mouseenter', alertH1);
// }

// h1.addEventListener('mouseenter', alertH1)


// h1.onmouseenter = function () {
//   alert('addEventListener: Great! You are reading the heading :D')
// };

// const h1 = document.querySelector('h1');

// // Going downwards: child

// console.log(h1.querySelectorAll('.highlight'))
// console.log(h1.childNodes);
// console.log(h1.children);
// console.log(h1.firstElementChild)
// h1.firstElementChild.style.color = 'white'
// h1.lastElementChild.style.color = 'red'

// // Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement)

// h1.closest('.header').style.background = 'var(--gradient-secondary)'