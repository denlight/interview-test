const country = 'US'
const language = 'en'

const PRODUCTS = {
    PHOTOSHOP: {
        prices: {
            US: {
                symbol: '$',
                code: 'US',
                monthly: 22.99
            }
        }
    },
    ILLUSTRATOR: {
        prices: {
            US: {
                symbol: '$',
                code: 'US',
                monthly: 22.99
            }
        },
    },
    LIGHTROOM: {
        prices: {
            US: {
                symbol: '$',
                code: 'US',
                monthly: 9.99
            }
        },
    },
}

const FAQ = [
    {
        question: "How much does Photoshop cost?",
        answer: `Plans start at ${getMonthlyPrice({ product: PRODUCTS.PHOTOSHOP })}/mo.`
    },
    {
        question: "Can you use Photoshop to edit videos?",
        answer: "Yes, you can use Photoshop to edit videos."
    },
    {
        question: "Is Photoshop available without a subscription?",
        answer: "Photoshop is only available as part of a Creative Cloud plan, which includes the latest features, updates, fonts, and more."
    }
]

/**
 * HANDLERS
 */

function handleScroll() {
    hero = document.querySelector('.hero')
    heroScrollHeight = hero.scrollHeight
    windowScroll = window.scrollY
    if(windowScroll >= heroScrollHeight) {
        banner = document.querySelector('.footer')
        if(!banner.className.includes('sticky'))
            banner.className =  banner.className + ' sticky'
    } else {
        banner = document.querySelector('.footer')
        banner.className = banner.className.replace(/\s?sticky/g, '')
    }
}

function handleAccordionClick(event) {
    const el = event.currentTarget
    const accordionIsOpened = el.className.includes('opened')

    if(accordionIsOpened) {
        el.className = el.className.replace(/\s?opened/, '')
    } else {
        document.querySelectorAll('.faq-set').forEach(elem => elem.className = elem.className.replace(/\s?opened/, ''))
        el.className = el.className + ' opened'
    }
}

function handleFocusedAccordionKeypress(event) {
    // Enter press
    if(event.keyCode === 13) event.currentTarget.click()
}

/**
 * GETTERS
 */

function getMonthlyPrice({ product }) {
    // default to US dollar if locale pricing is not available
    const price = product.prices[country] ?? product.prices['US']
    return `${price.code}${price.symbol}${price.monthly}`
}

/**
 * PROCESSORS
 */

function processBackgroundColor(el) {
    // assuming first element always has text context per instructions
    const cssColor = el.children[0].innerHTML.replace(/<\/?.+?>/g, '')
    el.style.background = cssColor
    // remove "unwanted child" =(
    el.removeChild(el.children[0])
}

function processHero(el) {
    processBackgroundColor(el)

    let paragraphs = el.querySelectorAll('p')
    paragraphs.forEach(paragraph => {
        if(paragraph.children.length && paragraph.children[0].innerHTML.includes('</a>')) {
            paragraph.className = 'action-area'
            // now process italic / bold links to append a coresponding class and unwrap it
            processItalicOrBoldLink(paragraph)
        }
    })
}

function processItalicOrBoldLink(el) {
    const links = []
    Array.from(el.children).forEach(elem => {
        const link = elem.children[0]
        if(elem.tagName === 'I') {
            link.className = 'con-button'
        } else if (elem.tagName === 'B') {
            link.className = 'con-button blue'
        }
        links.push(link)
        el.removeChild(elem)
    })
    links.forEach(link => el.appendChild(link))    
}

function processBrick(el) {
    processBackgroundColor(el)

    const paragraphs = el.querySelectorAll('p')
    paragraphs.forEach((paragraph, index) => {
        let className = ''
        switch(index) {
            case 0: className = 'title'; break
            case 1: className = 'price'; break
            case 2: className = 'description'; break
        }
        paragraph.className = className
    })
}

function processFaq(el) {
    FAQ.forEach(faq => {
        // create elements
        const faqSet = document.createElement('div')
        faqSet.className = 'faq-set'
        // accessibility
        faqSet.tabIndex = 0
        
        faqSet.innerHTML = `
        <div class="question">
            <div>
                <h3>${faq.question}</h3>
            </div>
        </div>
        <div class="answer">
            <div>
                <p>${faq.answer}</p>
            </div>
        </div>`

        faqSet.addEventListener('click', handleAccordionClick)
        faqSet.addEventListener('keypress', handleFocusedAccordionKeypress)
        el.appendChild(faqSet)
    })
}

function processBanner(el) {
    processItalicOrBoldLink(el)
    // sticky behavior can't happen on banner since it is the only child of its parent
    // so we have to use banner's parent to apply the sticky behavior to
    el.parentNode.className = el.parentNode.className + ' footer'
}

document.querySelectorAll('.hero').forEach(processHero)
document.querySelectorAll('.brick').forEach(processBrick)
document.querySelectorAll('.faq').forEach(processFaq)
document.querySelectorAll('.banner').forEach(processBanner)

// append viewport meta tag for responsivenes
const metaTag = document.createElement('meta')
metaTag.name = 'viewport'
metaTag.content = 'width=device-width, initial-scale=1'
document.head.appendChild(metaTag)

// listen to scroll event
document.addEventListener('scroll', handleScroll)