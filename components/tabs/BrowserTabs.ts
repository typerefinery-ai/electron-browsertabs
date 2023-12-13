/* eslint-disable @typescript-eslint/no-explicit-any */
import Draggabilly from 'draggabilly'

export default class BrowserTabs {
  TAB_CONTENT_MARGIN = 10
  TAB_CONTENT_OVERLAP_DISTANCE = 1

  TAB_OVERLAP_DISTANCE = this.TAB_CONTENT_MARGIN * 2 + this.TAB_CONTENT_OVERLAP_DISTANCE

  TAB_CONTENT_MIN_WIDTH = 24
  TAB_CONTENT_MAX_WIDTH = 240

  TAB_SIZE_SMALL = 84
  TAB_SIZE_SMALLER = 60
  TAB_SIZE_MINI = 48
  NEW_TAB_BUTTON_AREA = 90

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  noop: any = (_: any) => {}

  closest: any = (value: number, array: Array<number>) => {
    let closest = Infinity
    let closestIndex = -1

    array.forEach((v, i) => {
      if (Math.abs(value - v) < closest) {
        closest = Math.abs(value - v)
        closestIndex = i
      }
    })

    return closestIndex
  }

  tabTemplate = `
    <div class="chrome-tab">
      <div class="chrome-tab-dividers"></div>
      <div class="chrome-tab-background">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="chrome-tab-geometry-left" viewBox="0 0 214 36"><path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z"/></symbol><symbol id="chrome-tab-geometry-right" viewBox="0 0 214 36"><use xlink:href="#chrome-tab-geometry-left"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="52%" height="100%"><use xlink:href="#chrome-tab-geometry-left" width="214" height="36" class="chrome-tab-geometry"/></svg><g transform="scale(-1, 1)"><svg width="52%" height="100%" x="-100%" y="0"><use xlink:href="#chrome-tab-geometry-right" width="214" height="36" class="chrome-tab-geometry"/></svg></g></svg>
      </div>
      <div class="chrome-tab-content">
        <div class="chrome-tab-favicon"></div>
        <div class="chrome-tab-title"></div>
        <div class="chrome-tab-drag-handle"></div>
        <div class="chrome-tab-close"></div>
      </div>
    </div>
  `

  newTabButtonTemplate = `
    <div class="new-tab-button-wrapper">
      <button class="new-tab-button">✚</button>
    </div>
  `

  defaultTapProperties = {
    title: 'New tab',
    favicon: false
  }

  // instanceId = 0

  draggabillies: any[]
  el: any
  instanceId: number = 0
  styleEl: any
  isDragging: any
  draggabillyDragging: any
  constructor() {
    this.draggabillies = []
  }

  init(el: any): void {
    this.el = el

    this.el.setAttribute('data-chrome-tabs-instance-id', this.instanceId)

    this.setupCustomProperties()
    this.setupStyleEl()
    this.setupEvents()
    this.layoutTabs()
    this.setupNewTabButton()
    this.setupDraggabilly()
  }

  emit(eventName: any, data: any): void {
    this.el.dispatchEvent(new CustomEvent(eventName, { detail: data }))
  }

  setupCustomProperties(): void {
    this.el.style.setProperty('--tab-content-margin', `${this.TAB_CONTENT_MARGIN}px`)
  }

  setupStyleEl(): void {
    this.styleEl = document.createElement('style')
    this.el.appendChild(this.styleEl)
  }

  setupEvents(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    window.addEventListener('resize', (_: any) => {
      this.cleanUpPreviouslyDraggedTabs()
      this.layoutTabs()
    })

    this.el.addEventListener('dblclick', (event: any) => {
      if ([this.el, this.tabContentEl].includes(event.target)) this.addTab(null)
    })

    this.el.addEventListener('click', (event: any) => {
      if (event.target.classList.contains('new-tab-button')) {
        this.addTab(null)
      }
    })

    this.tabEls.forEach((tabEl: any) => this.setTabCloseEventListener(tabEl))
  }

  get tabEls(): any {
    return Array.prototype.slice.call(this.el.querySelectorAll('.chrome-tab'))
  }

  get tabContentEl(): any {
    return this.el.querySelector('.chrome-tabs-content')
  }

  get tabContentWidths(): Array<number> {
    const numberOfTabs = this.tabEls.length
    const tabsContentWidth = this.el.clientWidth - this.NEW_TAB_BUTTON_AREA
    const tabsCumulativeOverlappedWidth = (numberOfTabs - 1) * this.TAB_CONTENT_OVERLAP_DISTANCE
    const targetWidth =
      (tabsContentWidth - 2 * this.TAB_CONTENT_MARGIN + tabsCumulativeOverlappedWidth) /
      numberOfTabs
    const clampedTargetWidth = Math.max(
      this.TAB_CONTENT_MIN_WIDTH,
      Math.min(this.TAB_CONTENT_MAX_WIDTH, targetWidth)
    )
    const flooredClampedTargetWidth = Math.floor(clampedTargetWidth)
    const totalTabsWidthUsingTarget =
      flooredClampedTargetWidth * numberOfTabs +
      2 * this.TAB_CONTENT_MARGIN -
      tabsCumulativeOverlappedWidth
    const totalExtraWidthDueToFlooring = tabsContentWidth - totalTabsWidthUsingTarget

    // TODO - Support tabs with different widths / e.g. "pinned" tabs
    const widths = []
    let extraWidthRemaining = totalExtraWidthDueToFlooring
    for (let i = 0; i < numberOfTabs; i += 1) {
      const extraWidth =
        flooredClampedTargetWidth < this.TAB_CONTENT_MAX_WIDTH && extraWidthRemaining > 0 ? 1 : 0
      widths.push(flooredClampedTargetWidth + extraWidth)
      if (extraWidthRemaining > 0) extraWidthRemaining -= 1
    }

    return widths
  }

  get tabContentPositions(): Array<number> {
    const positions = Array<number>()
    const tabContentWidths = this.tabContentWidths

    let position = this.TAB_CONTENT_MARGIN
    tabContentWidths.forEach((width, i) => {
      const offset = i * this.TAB_CONTENT_OVERLAP_DISTANCE
      positions.push(position - offset)
      position += width
    })

    return positions
  }

  get tabPositions(): Array<number> {
    const positions = Array<number>()

    this.tabContentPositions.forEach((contentPosition) => {
      positions.push(contentPosition - this.TAB_CONTENT_MARGIN)
    })

    return positions
  }

  layoutTabs(): void {
    const tabContentWidths = this.tabContentWidths
    const tabsLen = this.tabEls.length

    this.tabEls.forEach((tabEl: any, i: number) => {
      if (tabEl == null) {
        return
      }
      const contentWidth = tabContentWidths[i]
      const width = contentWidth + 2 * this.TAB_CONTENT_MARGIN

      tabEl.style.width = width + 'px'
      tabEl.removeAttribute('is-small')
      tabEl.removeAttribute('is-smaller')
      tabEl.removeAttribute('is-mini')

      if (contentWidth < this.TAB_SIZE_SMALL) tabEl.setAttribute('is-small', '')
      if (contentWidth < this.TAB_SIZE_SMALLER) tabEl.setAttribute('is-smaller', '')
      if (contentWidth < this.TAB_SIZE_MINI) tabEl.setAttribute('is-mini', '')
    })

    let styleHTML = ''
    this.tabPositions.forEach((position, i) => {
      styleHTML += `
          .chrome-tabs[data-chrome-tabs-instance-id="${this.instanceId}"] .chrome-tab:nth-child(${
            i + 1
          }) {
            transform: translate3d(${position}px, 0, 0)
          }
        `
    })
    this.styleEl.innerHTML = styleHTML
    console.log([this.el, this.tabContentEl])
    if (
      this.el.offsetWidth - this.tabContentEl.offsetWidth >
        this.NEW_TAB_BUTTON_AREA + this.TAB_CONTENT_MARGIN / 2 ||
      tabsLen < 5
    ) {
      this.tabContentEl.style.width = `${
        (this.tabEls[0] ? this.tabEls[0].offsetWidth * tabsLen : 0) -
        (tabsLen > 0
          ? tabsLen * this.TAB_CONTENT_MARGIN * 2 -
            this.TAB_CONTENT_MIN_WIDTH +
            this.TAB_CONTENT_MARGIN
          : 0)
      }px`
      this.tabContentEl.nextElementSibling.classList.remove('overflow-shadow')
    } else {
      this.tabContentEl.nextElementSibling.classList.add('overflow-shadow')
    }
  }

  createNewTabEl(): any {
    const div = document.createElement('div')
    div.innerHTML = this.tabTemplate
    return div.firstElementChild
  }

  addTab(tabProperties: any, { animate = true, background = false } = {}): void {
    const tabEl = this.createNewTabEl()

    if (animate) {
      tabEl.classList.add('chrome-tab-was-just-added')
      setTimeout(() => tabEl.classList.remove('chrome-tab-was-just-added'), 500)
    }

    tabProperties = Object.assign({}, this.defaultTapProperties, tabProperties)
    this.tabContentEl.appendChild(tabEl)
    this.setTabCloseEventListener(tabEl)
    this.updateTab(tabEl, tabProperties)
    this.emit('tabAdd', { tabEl })
    if (!background) this.setCurrentTab(tabEl)
    this.cleanUpPreviouslyDraggedTabs()
    this.layoutTabs()
    this.setupDraggabilly()
  }

  setTabCloseEventListener(tabEl: any): void {
    tabEl
      .querySelector('.chrome-tab-close')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .addEventListener('click', (event: any) => {
        this.removeTab(tabEl)
      })
    //close tab on mouse middle click
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tabEl.addEventListener('mousedown', (event: any) => {
      let mouseButtonDown = (event.buttons & 1) > 0 ? 'MB1' : ''
      mouseButtonDown = (event.buttons & 2) > 0 ? 'MB2' : mouseButtonDown
      mouseButtonDown = (event.buttons & 4) > 0 ? 'MB3' : mouseButtonDown
      mouseButtonDown = (event.buttons & 8) > 0 ? 'MB4' : mouseButtonDown
      mouseButtonDown = (event.buttons & 16) > 0 ? 'MB5' : mouseButtonDown

      tabEl.setAttribute('mouseButtonDown', mouseButtonDown)
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tabEl.addEventListener('mouseup', (event: any) => {
      if (tabEl.getAttribute('mouseButtonDown') === 'MB3') {
        this.removeTab(tabEl)
      }
    })
  }

  get activeTabEl(): any {
    return this.el.querySelector('.chrome-tab[active]')
  }

  hasActiveTab(): any {
    return !!this.activeTabEl
  }

  setCurrentTab(tabEl: any): void {
    const activeTabEl = this.activeTabEl
    if (activeTabEl === tabEl) return
    if (activeTabEl) activeTabEl.removeAttribute('active')
    tabEl.setAttribute('active', '')
    this.emit('activeTabChange', { tabEl })
  }

  removeTab(tabEl: any): void {
    if (tabEl === this.activeTabEl) {
      if (tabEl.nextElementSibling) {
        this.setCurrentTab(tabEl.nextElementSibling)
      } else if (tabEl.previousElementSibling) {
        this.setCurrentTab(tabEl.previousElementSibling)
      }
    }
    tabEl.parentNode.removeChild(tabEl)
    this.emit('tabRemove', { tabEl })
    this.cleanUpPreviouslyDraggedTabs()
    this.layoutTabs()
    this.setupDraggabilly()
  }

  updateTab(tabEl: any, tabProperties: any): void {
    tabEl.querySelector('.chrome-tab-title').textContent = tabProperties.title

    const faviconEl = tabEl.querySelector('.chrome-tab-favicon')
    if (tabProperties.favicon) {
      faviconEl.style.backgroundImage = `url('${tabProperties.favicon}')`
      faviconEl.removeAttribute('hidden', '')
    } else {
      faviconEl.setAttribute('hidden', '')
      faviconEl.removeAttribute('style')
    }

    if (tabProperties.id) {
      tabEl.setAttribute('data-tab-id', tabProperties.id)
    }
  }

  cleanUpPreviouslyDraggedTabs(): void {
    this.tabEls.forEach((tabEl: any) => tabEl.classList.remove('chrome-tab-was-just-dragged'))
  }

  setupDraggabilly(): void {
    const tabEls = this.tabEls
    const tabPositions = this.tabPositions

    if (this.isDragging) {
      this.isDragging = false
      this.el.classList.remove('chrome-tabs-is-sorting')
      this.draggabillyDragging.element.classList.remove('chrome-tab-is-dragging')
      this.draggabillyDragging.element.style.transform = ''
      this.draggabillyDragging.dragEnd()
      this.draggabillyDragging.isDragging = false
      this.draggabillyDragging.positionDrag = this.noop // Prevent Draggabilly from updating tabEl.style.transform in later frames
      this.draggabillyDragging.destroy()
      this.draggabillyDragging = null
    }

    this.draggabillies.forEach((d) => d.destroy())

    tabEls.forEach((tabEl: any, originalIndex: number) => {
      const originalTabPositionX = tabPositions[originalIndex]
      const draggabilly = new Draggabilly(tabEl, {
        axis: 'x',
        handle: '.chrome-tab-drag-handle',
        containment: this.tabContentEl
      })

      this.draggabillies.push(draggabilly)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      draggabilly.on('pointerDown', (_: any) => {
        this.setCurrentTab(tabEl)
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      draggabilly.on('dragStart', (_: any) => {
        this.isDragging = true
        this.draggabillyDragging = draggabilly
        tabEl.classList.add('chrome-tab-is-dragging')
        this.el.classList.add('chrome-tabs-is-sorting')
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      draggabilly.on('dragEnd', (_: any) => {
        this.isDragging = false
        //const finalTranslateX = parseFloat(tabEl.style.left, 10)
        const finalTranslateX = parseFloat(tabEl.style.left)
        tabEl.style.transform = `translate3d(0, 0, 0)`

        // Animate dragged tab back into its place
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        requestAnimationFrame((_: any) => {
          tabEl.style.left = '0'
          tabEl.style.transform = `translate3d(${finalTranslateX}px, 0, 0)`

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          requestAnimationFrame((_: any) => {
            tabEl.classList.remove('chrome-tab-is-dragging')
            this.el.classList.remove('chrome-tabs-is-sorting')

            tabEl.classList.add('chrome-tab-was-just-dragged')

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            requestAnimationFrame((_: any) => {
              tabEl.style.transform = ''

              this.layoutTabs()
              this.setupDraggabilly()
            })
          })
        })
      })

      draggabilly.on('dragMove', (event: Event, pointer: MouseEvent | Touch, moveVector: any) => {
        // Current index be computed within the event since it can change during the dragMove
        const tabEls = this.tabEls
        const currentIndex = tabEls.indexOf(tabEl)

        const currentTabPositionX = originalTabPositionX + moveVector.x
        const destinationIndexTarget = this.closest(currentTabPositionX, tabPositions)
        const destinationIndex = Math.max(0, Math.min(tabEls.length, destinationIndexTarget))

        if (currentIndex !== destinationIndex) {
          this.animateTabMove(tabEl, currentIndex, destinationIndex)
        }
      })
    })
  }

  animateTabMove(tabEl: HTMLElement, originIndex: number, destinationIndex: number): void {
    if (destinationIndex < originIndex) {
      tabEl.parentNode?.insertBefore(tabEl, this.tabEls[destinationIndex])
    } else {
      tabEl.parentNode?.insertBefore(tabEl, this.tabEls[destinationIndex + 1])
    }
    this.emit('tabReorder', { tabEl, originIndex, destinationIndex })
    this.layoutTabs()
  }

  setupNewTabButton(): void {
    this.tabContentEl.insertAdjacentHTML('afterend', this.newTabButtonTemplate)
    this.layoutTabs()
  }
}
