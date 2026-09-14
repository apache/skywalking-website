/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
$(function () {
  $('.dropdown-title').on('click', function () {
    $(this).next('.nav-dropdown').toggle()
  })
  var sidebarButton = $('.sidebar-button')
  var sidebar = $('#site-navigation-drawer')
  var sidebarMask = $('.sidebar-mask')

  function focusableSidebarItems() {
    return sidebar.find('a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])').filter(':visible').filter(function () {
      // jQuery's visibility check can include links inside closed native details.
      var item = this
      return !$(this).parents('details:not([open])').filter(function () {
        return $(this).children('summary').first()[0] !== item
      }).length
    })
  }

  function setSidebarOpen(open, restoreFocus) {
    sidebar.toggleClass('show', open).attr('aria-hidden', String(!open))
    sidebarButton.attr('aria-expanded', String(open))
    sidebarMask.toggle(open)
    document.documentElement.classList.toggle('sw-menu-open', open)
    if (open) {
      var closeButton = sidebar.find('.sidebar-close').filter(':visible').first()
      if (closeButton.length) closeButton.trigger('focus')
      else focusableSidebarItems().first().trigger('focus')
    } else if (restoreFocus) {
      sidebarButton.filter(':visible').first().trigger('focus')
    }
  }

  sidebarButton.on('click', function () {
    setSidebarOpen(!sidebar.hasClass('show'), true)
  })
  sidebar.on('click', '.sidebar-close', function () {
    setSidebarOpen(false, true)
  })
  sidebar.on('click', 'a[href]', function () {
    // Category links can stay on the same page; close the drawer for those too.
    setSidebarOpen(false, true)
  })
  sidebarMask.on('click', function () {
    setSidebarOpen(false, true)
  })
  $(document).on('keydown', function (event) {
    if (!sidebar.hasClass('show')) return
    if (event.key === 'Escape') {
      event.preventDefault()
      setSidebarOpen(false, true)
      return
    }
    if (event.key === 'Tab') {
      var items = focusableSidebarItems()
      var first = items.first()[0]
      var last = items.last()[0]
      var focused = document.activeElement
      if (!items.length) {
        event.preventDefault()
      } else if (!sidebar[0].contains(focused) || (event.shiftKey ? focused === first : focused === last)) {
        event.preventDefault()
        $(event.shiftKey ? last : first).trigger('focus')
      }
    }
  })
  window.matchMedia('(min-width: 1200px)').addEventListener('change', function (event) {
    if (event.matches) setSidebarOpen(false)
  })
})
