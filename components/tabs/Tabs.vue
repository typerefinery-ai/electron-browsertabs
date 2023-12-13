<template>
  <div class="surface">
    <div class="browser">
      <div class="chrome-tabs" style="--tab-content-margin: 9px">
        <div class="chrome-tabs-content">
          <div class="chrome-tab">
            <div class="chrome-tab-dividers"></div>
            <div class="chrome-tab-background">
              <TabBackgroundSVG/>
            </div>
            <div class="chrome-tab-content">
              <div class="chrome-tab-favicon" style="background-image: url('/images/google-favicon.ico')"></div>
              <div class="chrome-tab-title">Google</div>
              <div class="chrome-tab-drag-handle"></div>
              <div class="chrome-tab-close"></div>
            </div>
          </div>
          <div class="chrome-tab" active>
            <div class="chrome-tab-dividers"></div>
            <div class="chrome-tab-background">
              <TabBackgroundSVG/>
            </div>
            <div class="chrome-tab-content">
              <div class="chrome-tab-favicon" style="background-image: url('/images/facebook-favicon.ico')"></div>
              <div class="chrome-tab-title">Facebook</div>
              <div class="chrome-tab-drag-handle"></div>
              <div class="chrome-tab-close"></div>
            </div>
          </div>
        </div>
        <div class="chrome-tabs-bottom-bar"></div>
      </div>
      <div class="chrome-tabs-optional-shadow-below-bottom-bar"></div>
      <div class="browser-content">
          <div class="buttons">
            <button data-theme-toggle>Toggle dark theme</button>
            <button data-add-tab>Add new tab</button>
            <button data-add-background-tab>Add tab in the background</button>
            <button data-remove-tab>Remove active tab</button>
          </div>
        </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import draggabilly from 'draggabilly'
import BrowserTabs from './BrowserTabs'
import TabBackgroundSVG from './TabBackgroundSVG.vue'

const observer = new IntersectionObserver((entries, observer) => {
  console.log(entries)
});

var browserTabs = new BrowserTabs()

// Probably optional
onUnmounted(() => {
  observer.disconnect()
})

onMounted(() => {
  const chromeTabs = document.querySelector(".chrome-tabs");
  // const chromeTabsContent = document.querySelector('.chrome-tabs-content');
  console.log([chromeTabs])
  browserTabs.init(chromeTabs)
  // observer.observe(el);

  chromeTabs.addEventListener('activeTabChange', ({ detail }) => console.log('Active tab changed', detail.tabEl))
  chromeTabs.addEventListener('tabAdd', ({ detail }) => console.log('Tab added', detail.tabEl))
  chromeTabs.addEventListener('tabRemove', ({ detail }) => console.log('Tab removed', detail.tabEl))

  document.querySelector('button[data-add-tab]').addEventListener('click', _ => {
    browserTabs.addTab({
      title: 'New Tab',
      favicon: false
    })
  })

  document.querySelector('button[data-add-background-tab]').addEventListener('click', _ => {
    browserTabs.addTab({
      title: 'New Tab',
      favicon: false
    }, {
      background: true
    })
  })

  document.querySelector('button[data-remove-tab]').addEventListener('click', _ => {
    browserTabs.removeTab(browserTabs.activeTabEl)
  })

  document.querySelector('button[data-theme-toggle]').addEventListener('click', _ => {
    if (chromeTabs.classList.contains('chrome-tabs-dark-theme')) {
      document.documentElement.classList.remove('dark-theme')
      chromeTabs.classList.remove('chrome-tabs-dark-theme')
    } else {
      document.documentElement.classList.add('dark-theme')
      chromeTabs.classList.add('chrome-tabs-dark-theme')
    }
  })

  window.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 't') {
      browserTabs.addTab({
        title: 'New Tab',
        favicon: false
      })
    }
  })
})

// console.log(el)
// browserTabs.init(el)


</script>


<style id="default-style">
html {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  background: #f1f3f4;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

html.dark-theme {
  background: #1c1c1c;
}

.surface {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100%;
  /* padding-bottom: 3em; */
  flex-direction: column;
  justify-content: center;
}

@media (min-width: 800px) {
  .surface {
    /* padding: 60px; */
  }

  .browser {
    height: 100%;
    width: 100%;
    background: #dee1e6;
    border-radius: 8px;
    flex-shrink: 0;
    overflow: hidden;
  }

  html.dark-theme .browser {
    background: #202123;
  }

  .browser-content {
    position: relative;
    z-index: 1;
    background: #fff;
    /* padding: 3em .5em; */
    margin-top: -1px;
    height: 100%;
  }

  .content-iframe {
    border: none;
    width: 100%;
    height: 100%;
  }

  .chrome-tabs-optional-shadow-below-bottom-bar {
    z-index: 2;
  }

  html.dark-theme .browser-content {
    background: #252729;
  }
}


@media (max-width: 799px) {
  html {
    background: #fff;
  }

  html.dark-theme {
    background: #252729;
  }

  .browser-content {
    padding: 1em .5em;
  }

  .browser .chrome-tabs {
    border-radius: 0;
  }
}

button {
  font-family: inherit;
  display: inline-block;
  cursor: pointer;
  background: #fff;
  font-size: 12px;
  border: 1px solid rgba(139, 141, 157, .4);
  border-radius: 3px;
  padding: .6em 1.5em .7em;
  border-radius: 9999px;
}

@supports (-webkit-overflow-scrolling: touch) {
  /* Prevent double tap to zoom on iOS https://stackoverflow.com/a/47131647 */
  button {
    touch-action: manipulation;
  }
}

button:focus {
  border-color: #a9adb0;
  outline: none;
  box-shadow: 0 0 0 3px #dee1e6;
}

.buttons {
  margin-left: -.5em;
  text-align: center;
}

.buttons button {
  margin: .5em;
}

html.dark-theme button {
  -webkit-font-smoothing: antialiased;
  background: transparent;
  color: #fff;
  border-color: #4a4d51;
}

html.dark-theme button:focus {
  border-color: #858b90;
  box-shadow: 0 0 0 3px #4a4d51;
}




/* Carbon Ads */

.carbonads-wrapper {
  box-sizing: border-box;
  display: inline-block;
  margin-top: 60px;
  margin-bottom: 60px;
}

@media (max-width: 799px) {
  .carbonads-wrapper {
    margin-top: 20px;
    display: block;
  }
}

.carbonads-wrapper * {
  box-sizing: inherit;
}

#carbonads {
  -webkit-font-smoothing: antialiased;
  width: 162px;
  display: block;
  overflow: hidden;
  line-height: 1.33;
  width: 130px;
  max-width: 100%;
  font-size: 12px;
  margin: 0 auto;
}

#carbonads span {
  position: relative;
  display: block;
  overflow: hidden;
}

.carbon-img, .carbon-img img {
  display: block;
  width: 130px;
  height: 100px;
}

.carbon-img {
  margin-bottom: 7px;
  background: #ccc;
}

.carbon-img img {
  background: #fff;
}

.carbon-text {
  color: inherit;
  display: block;
  float: left;
  text-align: left;
  text-decoration: none;
  color: #666;
  line-height: 1.35;
}

.carbon-poweredby {
  color: #b9b9b9;
  text-decoration: none;
  display: block;
  text-align: left;
  font-size: 10px;
  margin-top: 5px;
  margin-bottom: 11px;
}

</style>

<style id="chrometabs-theme">
@-moz-keyframes chrome-tab-was-just-added {
  to {
    top: 0;
  }
}
@-webkit-keyframes chrome-tab-was-just-added {
  to {
    top: 0;
  }
}
@-o-keyframes chrome-tab-was-just-added {
  to {
    top: 0;
  }
}
@keyframes chrome-tab-was-just-added {
  to {
    top: 0;
  }
}
.chrome-tabs {
  box-sizing: border-box;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 12px;
  height: 46px;
  padding: 8px 3px 4px 3px;
  background: #dee1e6;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
  display: flex;
}
.chrome-tabs * {
  box-sizing: inherit;
  font: inherit;
}
.chrome-tabs .new-tab-button-wrapper {
  display: inline-flex;
  align-items: center;
  background: inherit;
  pointer-events: auto;
  height: 100%;
  width: 80px;
  position: relative;
  z-index: 5;
  border-radius: 17px;
  pointer-events: auto;
  transition: padding 0.35s;
}
.chrome-tabs .new-tab-button-wrapper .new-tab-button {
  height: 28px;
  width: 28px;
  line-height: 0;
  border-radius: 50%;
  font-weight: 100;
  font-size: 16px;
  padding: 0;
  border: none;
  background: none;
  color: #555;
  box-shadow: none;
  transition: background 0.35s;
  cursor: default;
}
.chrome-tabs .new-tab-button-wrapper .new-tab-button:hover {
  background: rgba(150, 150, 150, 0.25);
}
.chrome-tabs .new-tab-button-wrapper.overflow-shadow {
  box-shadow: -5px 1px 5px #ccc, 20px 0 0 #dee1e6;
  padding-left: 4px;
}
.chrome-tabs .chrome-tabs-content {
  position: relative;
  width: auto;
  height: 100%;
  transition: width 0.1s;
  margin-right: 5px;
}
.chrome-tabs .chrome-tab {
  position: absolute;
  left: 0;
  height: 36px;
  width: 240px;
  border: 0;
  margin: 0;
  z-index: 1;
  pointer-events: none;
  user-select: none;
  cursor: default;
}
.chrome-tabs .chrome-tab * {
  user-select: none;
  cursor: default;
}
.chrome-tabs .chrome-tab .chrome-tab-dividers {
  position: absolute;
  top: 7px;
  bottom: 7px;
  left: var(--tab-content-margin);
  right: var(--tab-content-margin);
  pointer-events: none;
}
.chrome-tabs .chrome-tab .chrome-tab-dividers::before {
  pointer-events: none;
  content: "";
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #a9adb0;
  opacity: 1;
  transition: opacity 0.2s ease;
  left: 0;
}
.chrome-tabs .chrome-tab .chrome-tab-dividers::after {
  pointer-events: none;
  content: "";
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #a9adb0;
  opacity: 1;
  transition: opacity 0.2s ease;
  right: 0;
}
.chrome-tabs .chrome-tab:first-child .chrome-tab-dividers::before {
  opacity: 0;
}
.chrome-tabs .chrome-tab:last-child .chrome-tab-dividers::after {
  opacity: 0;
}
.chrome-tabs .chrome-tab .chrome-tab-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}
.chrome-tabs .chrome-tab .chrome-tab-background > svg {
  width: 100%;
  height: 100%;
}
.chrome-tabs .chrome-tab .chrome-tab-background > svg .chrome-tab-geometry {
  fill: #f4f5f6;
}
.chrome-tabs .chrome-tab:not([active]) .chrome-tab-background {
  transition: opacity 0.2s ease;
  opacity: 0;
}
.chrome-tabs .chrome-tab .chrome-tab-content {
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  left: var(--tab-content-margin);
  right: var(--tab-content-margin);
  padding: 9px 8px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
  pointer-events: all;
}
.chrome-tabs .chrome-tab .chrome-tab-favicon {
  position: relative;
  flex-shrink: 0;
  flex-grow: 0;
  height: 16px;
  width: 16px;
  background-size: 16px;
  margin-left: 4px;
}
.chrome-tabs .chrome-tab .chrome-tab-favicon + .chrome-tab-title {
  margin-left: 8px;
}
.chrome-tabs .chrome-tab .chrome-tab-title {
  flex: 1;
  vertical-align: top;
  overflow: hidden;
  white-space: nowrap;
  margin-left: 4px;
  color: #5f6368;
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent);
  mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent);
}
.chrome-tabs .chrome-tab .chrome-tab-drag-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.chrome-tabs .chrome-tab .chrome-tab-close {
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><path stroke='rgba(0, 0, 0, .65)' stroke-linecap='square' stroke-width='1.5' d='M0 0 L8 8 M8 0 L0 8'></path></svg>");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 8px 8px;
}
.chrome-tabs .chrome-tab[active] {
  z-index: 5;
}
.chrome-tabs .chrome-tab[active] .chrome-tab-background > svg .chrome-tab-geometry {
  fill: #fff;
}
.chrome-tabs .chrome-tab[active] .chrome-tab-title {
  color: #45474a;
}
.chrome-tabs .chrome-tab.chrome-tab-was-just-added {
  top: 10px;
  animation: chrome-tab-was-just-added 120ms forwards ease-in-out;
}
.chrome-tabs .chrome-tab[is-mini] .chrome-tab-content {
  padding-left: 2px;
  padding-right: 2px;
}
.chrome-tabs .chrome-tab[is-mini]:not([active]) .chrome-tab-favicon {
  margin-left: auto;
  margin-right: auto;
}
.chrome-tabs .chrome-tab[is-mini]:not([active]) .chrome-tab-close {
  display: none;
}
.chrome-tabs .chrome-tab[is-mini] .chrome-tab-title {
  display: none;
}
.chrome-tabs .chrome-tab[is-small] .chrome-tab-favicon {
  margin-left: 0;
}
.chrome-tabs .chrome-tab[is-small] .chrome-tab-favicon + .chrome-tab-title {
  margin-left: 8px;
}
.chrome-tabs .chrome-tab[is-small] .chrome-tab-title {
  margin-left: 0;
}
.chrome-tabs .chrome-tab[is-mini][active] .chrome-tab-favicon {
  display: none;
}
.chrome-tabs .chrome-tab[is-mini][active] .chrome-tab-close {
  margin-left: auto;
  margin-right: auto;
}
.chrome-tabs .chrome-tab[is-smaller] .chrome-tab-favicon + .chrome-tab-title {
  display: none;
}
.chrome-tabs .chrome-tab[is-smaller] .chrome-tab-close {
  margin-left: auto;
}
.chrome-tabs:not(.chrome-tabs-is-sorting) .chrome-tab.chrome-tab-was-just-dragged {
  transition: transform 120ms ease-in-out;
}
.chrome-tabs .chrome-tabs-bottom-bar {
  position: absolute;
  bottom: 0;
  height: 4px;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 10;
}

.chrome-tabs.chrome-tabs-is-sorting .chrome-tab:not(.chrome-tab-is-dragging) {
  transition: transform 120ms ease-in-out;
}

.chrome-tabs-optional-shadow-below-bottom-bar {
  position: relative;
  height: 1px;
  width: 100%;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1' viewBox='0 0 1 1'><rect x='0' y='0' width='1' height='1' fill='rgba(0, 0, 0, .17)'></rect></svg>");
  background-size: 1px 1px;
  background-repeat: repeat-x;
  background-position: 0% 0%;
}

@media (hover: hover) {
  .chrome-tabs .chrome-tab:not([active]):hover {
    z-index: 2;
  }
  .chrome-tabs .chrome-tab:not([active]):hover .chrome-tab-background {
    opacity: 1;
  }
  .chrome-tabs .chrome-tab:not([active]) .chrome-tab-close:not(:hover):not(:active) {
    opacity: 0.8;
  }
  .chrome-tabs .chrome-tab .chrome-tab-close:hover {
    background-color: #e8eaed;
  }
  .chrome-tabs .chrome-tab .chrome-tab-close:hover:active {
    background-color: #dadce0;
  }
}
@media not all and (hover: hover) {
  .chrome-tabs .chrome-tab .chrome-tab-close:active {
    background-color: #dadce0;
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .chrome-tabs-optional-shadow-below-bottom-bar {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='2' height='2' viewBox='0 0 2 2'><rect x='0' y='0' width='2' height='1' fill='rgba(0, 0, 0, .27)'></rect></svg>");
  }
}
@media only screen and (min--moz-device-pixel-ratio: 2) {
  .chrome-tabs-optional-shadow-below-bottom-bar {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='2' height='2' viewBox='0 0 2 2'><rect x='0' y='0' width='2' height='1' fill='rgba(0, 0, 0, .27)'></rect></svg>");
  }
}
@media only screen and (-o-min-device-pixel-ratio: 2/1) {
  .chrome-tabs-optional-shadow-below-bottom-bar {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='2' height='2' viewBox='0 0 2 2'><rect x='0' y='0' width='2' height='1' fill='rgba(0, 0, 0, .27)'></rect></svg>");
  }
}
@media only screen and (min-device-pixel-ratio: 2) {
  .chrome-tabs-optional-shadow-below-bottom-bar {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='2' height='2' viewBox='0 0 2 2'><rect x='0' y='0' width='2' height='1' fill='rgba(0, 0, 0, .27)'></rect></svg>");
  }
}
@media only screen and (min-resolution: 192dpi) {
  .chrome-tabs-optional-shadow-below-bottom-bar {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='2' height='2' viewBox='0 0 2 2'><rect x='0' y='0' width='2' height='1' fill='rgba(0, 0, 0, .27)'></rect></svg>");
  }
}
@media only screen and (min-resolution: 2dppx) {
  .chrome-tabs-optional-shadow-below-bottom-bar {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='2' height='2' viewBox='0 0 2 2'><rect x='0' y='0' width='2' height='1' fill='rgba(0, 0, 0, .27)'></rect></svg>");
  }
}

/*# sourceMappingURL=chrome-tabs.css.map */

</style>


<style id="chrometabs-theme-dark">

.chrome-tabs.chrome-tabs-dark-theme {
  background: #202124;
}
.chrome-tabs.chrome-tabs-dark-theme .new-tab-button-wrapper.overflow-shadow {
  box-shadow: -5px 1px 5px rgba(22, 23, 26, 0.5), 20px 0 0 #202124;
  padding-left: 4px;
}
.chrome-tabs.chrome-tabs-dark-theme .new-tab-button-wrapper .new-tab-button {
  color: rgba(200, 200, 200, 0.5);
}
.chrome-tabs.chrome-tabs-dark-theme .new-tab-button-wrapper .new-tab-button:hover {
  background: rgba(154, 160, 166, 0.25);
}
.chrome-tabs.chrome-tabs-dark-theme .chrome-tab .chrome-tab-dividers::before {
  background: #4a4d51;
}
.chrome-tabs.chrome-tabs-dark-theme .chrome-tab .chrome-tab-dividers::after {
  background: #4a4d51;
}
.chrome-tabs.chrome-tabs-dark-theme .chrome-tab .chrome-tab-background > svg .chrome-tab-geometry {
  fill: #292b2e;
}
.chrome-tabs.chrome-tabs-dark-theme .chrome-tab .chrome-tab-title {
  color: #9ca1a7;
}
.chrome-tabs.chrome-tabs-dark-theme .chrome-tab .chrome-tab-close {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><path stroke='rgba(154, 160, 166, .8)' stroke-linecap='square' stroke-width='1.5' d='M0 0 L8 8 M8 0 L0 8'></path></svg>");
}
.chrome-tabs.chrome-tabs-dark-theme .chrome-tab .chrome-tab-close:hover {
  background-color: #5f6368;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><path stroke='rgba(255, 255, 255, .7)' stroke-linecap='square' stroke-width='1.5' d='M0 0 L8 8 M8 0 L0 8'></path></svg>");
}
.chrome-tabs.chrome-tabs-dark-theme .chrome-tab .chrome-tab-close:hover:active {
  background-color: #80868b;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><path stroke='rgba(255, 255, 255, .9)' stroke-linecap='square' stroke-width='1.5' d='M0 0 L8 8 M8 0 L0 8'></path></svg>");
}
.chrome-tabs.chrome-tabs-dark-theme .chrome-tab[active] .chrome-tab-background > svg .chrome-tab-geometry {
  fill: #323639;
}
.chrome-tabs.chrome-tabs-dark-theme .chrome-tab[active] .chrome-tab-title {
  color: #f1f3f4;
}
.chrome-tabs.chrome-tabs-dark-theme .chrome-tabs-bottom-bar {
  background: #323639;
}

/*# sourceMappingURL=chrome-tabs-dark-theme.css.map */


</style>

<style>
  /* body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    background: red;
  } */

  .chrome-tabs .chrome-tab {
    width: 258px
  }

  .chrome-tabs .chrome-tab:nth-child(1) {
    transform: translate3d(0px, 0, 0)
  }

  .chrome-tabs .chrome-tab:nth-child(2) {
    transform: translate3d(239px, 0, 0)
  }
</style>

