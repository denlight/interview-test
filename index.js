const country = 'US'
const language = 'en'

let banner
let hero

const PRODUCTS = {
    PHOTOSHOP: {
        prices: {
            US: {
                symbol: '$',
                code: 'US',
                monthly: 22.99,
                annually: 199.99 // made up price with a deal in case we want to show it
            }
        }
    },
    ILLUSTRATOR: {
        prices: {
            US: {
                symbol: '$',
                code: 'US',
                monthly: 22.99,
                annually: 199.99 // made up price with a deal in case we want to show it
            }
        },
    },
    LIGHTROOM: {
        prices: {
            US: {
                symbol: '$',
                code: 'US',
                monthly: 9.99,
                annually: 99.99 // made up price with a deal in case we want to show it
            }
        },
    },
}

const FAQ = {
    US: { 
        en: [
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
    }
}

const BRICKS = {
    US: {
        en: [
            {
                title: 'Photoshop',
                price: getMonthlyPrice({ product: PRODUCTS.PHOTOSHOP }),
                description: 'With Photoshop and generative AI, you can create gorgeous photos, rich graphics, and incredible art.',
                background: '#ffe4e1'
            },
            {
                title: 'Illustrator',
                price: getMonthlyPrice({ product: PRODUCTS.ILLUSTRATOR }),
                description: 'With Illustrator and generative AI, anyone can create logos, packaging designs, web graphics, and more.',
                className: 'double',
                background: '#f19602'
            },
            {
                title: 'Lightroom',
                price: getMonthlyPrice({ product: PRODUCTS.LIGHTROOM }),
                description: 'Edit, organize, and share your best photos in Lightroom. New Lens Blur lets you instantly create a stunning portrait effect in any photo. And tap into a new streamlined editing experience in Lightroom for mobile.',
                className: 'triple',
                background: '#68f08e'
            }
        ]
    }
}

const CTA = {
    freeTrial: {
        url: 'https://commerce.adobe.com/store/recommendation',
        text: 'Free trial',
        isInsideItalicTag: true,
        query: [
            {
                key: 'items[0][id]',
                value: 'E27CB5D79014ACAB6953B091CEA72228'
            },
            {
                key: 'co',
                value: country,
            },
            {
                key: 'lang',
                value: language,
            },
            {
                key: 'cli',
                value: 'mini_plans'
            }
        ]
    },
    buyNow: {
        url: 'https://www.adobe.com/creativecloud/plans.html',
        text: 'Buy now',
        isInsideBoldTag: true,
        query: [
            {
                key: 'plan',
                value: 'individual'
            },
            {
                key: 'filter',
                value: 'all',
            },
            {
                key: 'promoid',
                value: 'PYPVPZQK',
            },
            {
                key: 'mv',
                value: 'other'
            }
        ]
    },
}

const HERO = {
    US: {
        en: {
            header: 'Do it all with Adobe Creative Cloud.',
            subheader: 'Make anything you can imagine, from gorgeous images, graphics, and art to standout social posts, videos, PDFs, and more. Get 20+ apps in the All Apps plan plus generative AI tools powered by Adobe Firefly.',
            cta: [
                CTA.freeTrial,
                CTA.buyNow
            ]
        }
    }
}

const BANNER = {
    US: {
        en: {
            text: 'Do it all with Adobe Creative Cloud.',
            cta: [
                CTA.buyNow
            ]
        }
    }
}

/**
 * HANDLERS
 */

function handleScroll(event) {
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

/**
 * GETTERS
 */

function getMonthlyPrice({ product }) {
    // default to US dollar if locale pricing is not available
    const price = product.prices[country] ?? product.prices['US']
    return `${price.code}${price.symbol}${price.monthly}`
}

function getCTA({ entity }) {
    let html = ''
    entity.cta.forEach(cta => {
        let url = cta.url
        if(cta.query?.length) {
            url +='?'
            cta.query.forEach((queryPair, index) => {
                url += `${queryPair.key}=${queryPair.value}`
                url +=  index + 1 < cta.query.length
                    ? '&'  
                    : ''
                
            })
        }
        const aTag = `<a href=${url} >${cta.text}</a>`

        if(cta.isInsideItalicTag)  {
            html += `<i>${aTag}</i>`
        } else if (cta.isInsideBoldTag)  {
            html += `<b>${aTag}</b>`
        } else {
            html += aTag
        }
    })
    return html
}

/**
 * PROCESSORS
 */

function processBackgroundColor(el) {
    // assuming first element always has text context per instructions
    const cssColor = el.children[0].innerHTML.replace(/<\/?.+?>/g, '')
    // remove "unwanted child" =(
    el.removeChild(el.children[0])
    el.style.background = cssColor
}

function processHero(el) {
    // default to english if locale us not available
    const hero = HERO[country] && HERO[country][language] 
        ? HERO[country][language] 
        : HERO['US']['en']

    el.innerHTML = `
    <div>
        <div>
            <p>radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)</p>
        </div>
    </div>
    <div>
        <div>
            <h1>${hero.header}</h1>
            <p>${hero.subheader}</p>
            <p class="${hero.cta.length ? 'action-area' : ''}">
                ${getCTA({ entity: hero })}
            </p>
        </div>
    </div>`
    processBackgroundColor(el)
    // now process italic / bold links to append a coresponding class and unwrap it
    const actionArea = document.querySelector('.action-area')
    if(actionArea)
        processItalicOrBoldLink(actionArea)
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

function processMasonry(el) {
    // default to english if locale is not available
    const bricks = BRICKS[country] && BRICKS[country][language]
        ? BRICKS[country][language] 
        : BRICKS['US']['en']

    bricks.forEach(brick => {
        const brickEl = document.createElement('div')
        brickEl.className = `brick ${brick.className ?? ''}`
        brickEl.innerHTML = `
        <div>
            <div>
                <p>${brick.background}</p>
            </div>
        </div>
        <div>
            <div>
                <p class="title">${brick.title}</p>
                <p class="price">${brick.price}/mo</p>
                <p class="description">${brick.description}</p>
            </div>
        </div>`
        el.appendChild(brickEl)
    })
}

function processBrick(el) {
    processBackgroundColor(el)
}

function processFaq(el) {
    // default to english if locale us not available
    const faq = FAQ[country] && FAQ[country][language]
        ? FAQ[country][language] 
        : FAQ['US']['en']

    faq.forEach(faq => {
        // create elements
        const faqSet = document.createElement('div')
        faqSet.className = 'faq-set'
        
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
        el.appendChild(faqSet)
    })
}
function processBanner(el) {
    // default to english if locale us not available
    const banner = BANNER[country] &&  BANNER[country][language]
        ? BANNER[country][language] 
        : BANNER['US']['en']

    el.innerHTML = `
        Do it all with Adobe Creative Cloud.
        ${getCTA({entity: banner})}
    `
    processItalicOrBoldLink(el)
}

document.querySelectorAll('.hero').forEach(processHero)
document.querySelectorAll('.masonry').forEach(processMasonry)
document.querySelectorAll('.brick').forEach(processBrick)
document.querySelectorAll('.faq').forEach(processFaq)
document.querySelectorAll('.banner').forEach(processBanner)

document.addEventListener('scroll', handleScroll)