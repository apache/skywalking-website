(function () {
  'use strict';
  var svgNamespace = 'http://www.w3.org/2000/svg';

  function svgElement(name, attributes) {
    var element = document.createElementNS(svgNamespace, name);
    Object.keys(attributes || {}).forEach(function (key) { element.setAttribute(key, attributes[key]); });
    return element;
  }

  function edgeKey(edge) { return edge.from + '>' + edge.to; }

  function clearSegment(start, end, obstacles) {
    return !obstacles.some(function (box) {
      if (start.x === end.x) {
        return start.x > box.left && start.x < box.right && Math.max(start.y, end.y) > box.top && Math.min(start.y, end.y) < box.bottom;
      }
      return start.y > box.top && start.y < box.bottom && Math.max(start.x, end.x) > box.left && Math.min(start.x, end.x) < box.right;
    });
  }

  // Route through the spaces around real cards instead of drawing lines through them.
  function route(start, end, boxes, width, height) {
    var obstacles = boxes.map(function (box) { return {left: box.left - 5, right: box.right + 5, top: box.top - 5, bottom: box.bottom + 5}; });
    var xs = [start.x, end.x, 14, width - 14];
    var ys = [start.y, end.y, 14, height - 14];
    boxes.forEach(function (box) { xs.push(box.left - 12, box.right + 12); ys.push(box.top - 12, box.bottom + 12); });
    xs = Array.from(new Set(xs)).sort(function (a, b) { return a - b; });
    ys = Array.from(new Set(ys)).sort(function (a, b) { return a - b; });
    var initial = {x: xs.indexOf(start.x), y: ys.indexOf(start.y), direction: '', cost: 0, previous: null};
    var pending = [initial];
    var visited = new Map();
    var goal;
    while (pending.length) {
      pending.sort(function (a, b) { return b.cost - a.cost; });
      var current = pending.pop();
      var key = current.x + ':' + current.y + ':' + current.direction;
      if (visited.has(key)) { continue; }
      visited.set(key, current);
      var point = {x: xs[current.x], y: ys[current.y]};
      if (point.x === end.x && point.y === end.y) { goal = current; break; }
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(function (offset) {
        var x = current.x + offset[0];
        var y = current.y + offset[1];
        if (x < 0 || y < 0 || x >= xs.length || y >= ys.length) { return; }
        var next = {x: xs[x], y: ys[y]};
        if (!clearSegment(point, next, obstacles)) { return; }
        var direction = offset[0] ? 'horizontal' : 'vertical';
        var cost = current.cost + Math.abs(next.x - point.x) + Math.abs(next.y - point.y) + (current.direction && current.direction !== direction ? 18 : 0);
        if (!visited.has(x + ':' + y + ':' + direction)) { pending.push({x: x, y: y, direction: direction, cost: cost, previous: current}); }
      });
    }
    if (!goal) { return [start, {x: end.x, y: start.y}, end]; }
    var points = [];
    while (goal) { points.unshift({x: xs[goal.x], y: ys[goal.y]}); goal = goal.previous; }
    return points.filter(function (point, index) {
      if (!index || index === points.length - 1) { return true; }
      var before = points[index - 1];
      var after = points[index + 1];
      return !((before.x === point.x && point.x === after.x) || (before.y === point.y && point.y === after.y));
    });
  }

  function roundedPath(points) {
    var path = 'M' + points[0].x + ' ' + points[0].y;
    for (var i = 1; i < points.length - 1; i++) {
      var before = points[i - 1], current = points[i], after = points[i + 1];
      var incoming = Math.abs(current.x - before.x) + Math.abs(current.y - before.y);
      var outgoing = Math.abs(after.x - current.x) + Math.abs(after.y - current.y);
      var radius = Math.min(7, incoming / 2, outgoing / 2);
      var a = {x: current.x + (before.x - current.x) / incoming * radius, y: current.y + (before.y - current.y) / incoming * radius};
      var b = {x: current.x + (after.x - current.x) / outgoing * radius, y: current.y + (after.y - current.y) / outgoing * radius};
      path += ' L' + a.x + ' ' + a.y + ' Q' + current.x + ' ' + current.y + ' ' + b.x + ' ' + b.y;
    }
    return path + ' L' + points[points.length - 1].x + ' ' + points[points.length - 1].y;
  }

  document.querySelectorAll('[data-showcase-diagram]').forEach(function (root) {
    var model;
    try { model = JSON.parse(root.querySelector('[data-showcase-model]').textContent); } catch (_) { return; }
    if (!model.views || !model.views.length) { return; }
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-sd-tab]'));
    var status = root.querySelector('[data-sd-status]');
    var currentView = model.views[0].id;
    var frame = 0;
    var views = model.views.map(function (view) {
      var panel = root.querySelector('[data-sd-view="' + view.id + '"]');
      var elements = new Map();
      panel.querySelectorAll('[data-sd-node]').forEach(function (element) { elements.set(element.getAttribute('data-sd-node'), element); });
      return {data: view, panel: panel, grid: panel.querySelector('.sd-node-grid'), canvas: panel.querySelector('.sd-canvas'), svg: panel.querySelector('.sd-edges'), inspector: panel.querySelector('.sd-inspector'), elements: elements, selected: '', path: '', drawnEdges: []};
    });

    function isList(view) { return window.getComputedStyle(view.grid).getPropertyValue('--sd-layout').trim() === 'list'; }

    function placeInspector(view) {
      var inspector = view.inspector;
      var inline = isList(view);
      inspector.classList.toggle('is-inline', inline);
      inspector.hidden = inline && !view.selected && !view.path;
      if (inline && view.selected) {
        var node = view.elements.get(view.selected);
        if (node.nextElementSibling !== inspector) { node.insertAdjacentElement('afterend', inspector); }
      } else if (inline && view.path) {
        if (inspector.nextElementSibling !== view.canvas) { view.panel.insertBefore(inspector, view.canvas); }
      } else if (inspector.parentNode !== view.panel || view.panel.lastElementChild !== inspector) {
        view.panel.appendChild(inspector);
      }
    }

    function pathFor(view) { return (view.data.paths || []).find(function (path) { return path.id === view.path; }); }

    function edgeIsActive(view, edge) {
      if (view.selected) { return edge.from === view.selected || edge.to === view.selected; }
      var path = pathFor(view);
      if (!path) { return false; }
      if (path.edges) { return path.edges.some(function (step) { return edgeKey(step) === edgeKey(edge) || (edge.bidirectional && step.from === edge.to && step.to === edge.from); }); }
      return path.nodes.some(function (node, index) { return node === edge.from && path.nodes[index + 1] === edge.to; });
    }

    function highlight(view) {
      var path = pathFor(view);
      var highlighted = !!view.selected || !!path;
      var connected = new Set();
      view.data.edges.forEach(function (edge) { if (edgeIsActive(view, edge)) { connected.add(edge.from); connected.add(edge.to); } });
      if (view.selected) { connected.add(view.selected); }
      if (path) { path.nodes.forEach(function (id) { connected.add(id); }); }
      view.panel.classList.toggle('has-highlight', highlighted);
      view.elements.forEach(function (element, id) {
        element.setAttribute('aria-pressed', String(id === view.selected));
        element.classList.toggle('is-connected', !!view.selected && id !== view.selected && connected.has(id));
        element.classList.toggle('is-on-path', !!path && connected.has(id));
        element.classList.toggle('is-muted', highlighted && !connected.has(id));
      });
      view.drawnEdges.forEach(function (drawing) {
        var active = edgeIsActive(view, drawing.edge);
        [drawing.line, drawing.label].forEach(function (element) {
          if (!element) { return; }
          element.classList.toggle('is-active', active);
          element.classList.toggle('is-muted', highlighted && !active);
        });
        var marker = 'url(#sd-arrow-' + view.data.id + (active ? '-active)' : '-base)');
        drawing.line.setAttribute('marker-end', marker);
        if (drawing.edge.bidirectional) { drawing.line.setAttribute('marker-start', marker); }
      });
      view.panel.querySelectorAll('[data-sd-path]').forEach(function (button) { button.setAttribute('aria-pressed', String(button.getAttribute('data-sd-path') === view.path && !view.selected)); });
    }

    function showInspector(view) {
      var selected = view.data.nodes.find(function (node) { return node.id === view.selected; });
      var path = pathFor(view);
      var inspector = view.inspector;
      var title = inspector.querySelector('[data-sd-inspector-title]');
      var description = inspector.querySelector('[data-sd-inspector-description]');
      var kind = inspector.querySelector('[data-sd-inspector-kind]');
      var links = inspector.querySelector('[data-sd-inspector-links]');
      var label = inspector.querySelector('[data-sd-connections-label]');
      links.textContent = '';
      title.textContent = selected ? selected.title : path ? path.label : 'Select a component';
      kind.textContent = selected ? selected.subtitle : path ? 'FOLLOWING A REQUEST' : 'EXPLORE THE CONNECTIONS';
      description.textContent = selected ? selected.description : path ? 'The highlighted connections show this request through the music application. Select any component to explore its role.' : 'See its role and follow its connections through the Showcase.';
      label.textContent = path ? 'Components on this path' : 'Connected components';
      var connections = selected ? view.data.edges.filter(function (edge) { return edge.from === selected.id || edge.to === selected.id; }).map(function (edge) {
        var outgoing = edge.from === selected.id;
        return {id: outgoing ? edge.to : edge.from, direction: edge.bidirectional ? '↔' : outgoing ? '→' : '←', label: edge.label || '', meaning: edge.bidirectional ? 'Communicates with' : outgoing ? 'Connects to' : 'Receives from'};
      }) : path ? path.nodes.map(function (id) { return {id: id, direction: '', label: '', meaning: 'Explore'}; }) : [];
      connections.forEach(function (connection) {
        var node = view.data.nodes.find(function (item) { return item.id === connection.id; });
        if (!node) { return; }
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'sd-connection';
        button.setAttribute('aria-label', connection.meaning + ' ' + node.title + (connection.label ? ': ' + connection.label : ''));
        if (connection.direction) {
          var arrow = document.createElement('span');
          arrow.className = 'sd-connection-arrow-label';
          arrow.setAttribute('aria-hidden', 'true');
          arrow.textContent = connection.direction;
          button.appendChild(arrow);
        }
        var text = document.createElement('span');
        text.textContent = node.title;
        button.appendChild(text);
        if (connection.label) {
          var detail = document.createElement('span');
          detail.className = 'sd-connection-label';
          detail.textContent = connection.label;
          button.appendChild(detail);
        }
        button.addEventListener('click', function () { selectNode(view, node.id, true); });
        links.appendChild(button);
      });
      if (!connections.length) {
        var empty = document.createElement('span');
        empty.className = 'sd-inspector-empty';
        empty.textContent = selected ? 'No other connections in this view.' : 'Choose any card in the diagram.';
        links.appendChild(empty);
      }
      placeInspector(view);
      if (selected) { status.textContent = selected.title + '. ' + selected.description; }
      else if (path) { status.textContent = path.label + ' highlighted. ' + path.nodes.length + ' components.'; }
    }

    function selectNode(view, id, focus) {
      view.selected = id;
      view.path = '';
      highlight(view);
      showInspector(view);
      if (focus) { view.elements.get(id).focus({preventScroll: true}); view.elements.get(id).scrollIntoView({block: 'nearest'}); }
    }

    function draw(view) {
      placeInspector(view);
      if (isList(view)) { return; }
      var bounds = view.canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) { return; }
      var boxes = new Map();
      view.elements.forEach(function (element, id) {
        var rect = element.getBoundingClientRect();
        boxes.set(id, {left: rect.left - bounds.left, right: rect.right - bounds.left, top: rect.top - bounds.top, bottom: rect.bottom - bounds.top, width: rect.width, height: rect.height});
      });
      view.svg.textContent = '';
      view.svg.setAttribute('viewBox', '0 0 ' + bounds.width + ' ' + bounds.height);
      var definitions = svgElement('defs');
      ['base', 'active'].forEach(function (state) {
        var marker = svgElement('marker', {id: 'sd-arrow-' + view.data.id + '-' + state, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse', markerUnits: 'userSpaceOnUse'});
        marker.appendChild(svgElement('path', {d: 'M1 1L8 5L1 9', fill: 'none', stroke: state === 'active' ? '#2875b9' : '#a8bdd0', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'}));
        definitions.appendChild(marker);
      });
      view.svg.appendChild(definitions);
      view.drawnEdges = [];
      function anchor(id, edge, horizontal, direction) {
        var box = boxes.get(id);
        var point = horizontal ? {x: direction > 0 ? box.right + 7 : box.left - 7, y: (box.top + box.bottom) / 2} : {x: (box.left + box.right) / 2, y: direction > 0 ? box.bottom + 7 : box.top - 7};
        if (view.data.id !== 'telemetry' || !horizontal) { return point; }
        // Separate inputs at the collector so each source keeps a distinct arrow.
        var connections = view.data.edges.filter(function (candidate) {
          if (candidate.from !== id && candidate.to !== id) { return false; }
          var other = boxes.get(candidate.from === id ? candidate.to : candidate.from);
          return other && ((other.left + other.right > box.left + box.right) ? 1 : -1) === direction;
        }).sort(function (a, b) {
          var first = boxes.get(a.from === id ? a.to : a.from);
          var second = boxes.get(b.from === id ? b.to : b.from);
          return first.top + first.bottom - second.top - second.bottom;
        });
        point.y = box.top + box.height * (connections.indexOf(edge) + 1) / (connections.length + 1);
        return point;
      }
      view.data.edges.forEach(function (edge) {
        var from = boxes.get(edge.from), to = boxes.get(edge.to);
        if (!from || !to) { return; }
        var fromCenter = {x: (from.left + from.right) / 2, y: (from.top + from.bottom) / 2};
        var toCenter = {x: (to.left + to.right) / 2, y: (to.top + to.bottom) / 2};
        var dx = toCenter.x - fromCenter.x, dy = toCenter.y - fromCenter.y;
        var horizontal = Math.abs(dx) > from.width * .65;
        var start = anchor(edge.from, edge, horizontal, (horizontal ? dx : dy) > 0 ? 1 : -1);
        var end = anchor(edge.to, edge, horizontal, (horizontal ? dx : dy) > 0 ? -1 : 1);
        // Short ports keep both arrowheads perpendicular to the card edges.
        var direction = horizontal ? {x: dx > 0 ? 1 : -1, y: 0} : {x: 0, y: dy > 0 ? 1 : -1};
        var startPort = {x: start.x + direction.x * 7, y: start.y + direction.y * 7};
        var endPort = {x: end.x - direction.x * 7, y: end.y - direction.y * 7};
        var routeBoxes = Array.from(boxes.values());
        var preferred = [startPort, {x: endPort.x, y: startPort.y}, endPort];
        var routed = view.data.id === 'telemetry' && horizontal && clearSegment(preferred[0], preferred[1], routeBoxes) && clearSegment(preferred[1], preferred[2], routeBoxes) ? preferred : route(startPort, endPort, routeBoxes, bounds.width, bounds.height);
        var points = [start].concat(routed, [end]);
        points = points.filter(function (point, index) { return !index || point.x !== points[index - 1].x || point.y !== points[index - 1].y; });
        var line = svgElement('path', {class: 'sd-edge', d: roundedPath(points), 'data-from': edge.from, 'data-to': edge.to});
        var title = svgElement('title');
        title.textContent = edge.from + (edge.bidirectional ? ' ↔ ' : ' → ') + edge.to + (edge.label ? ': ' + edge.label : '');
        line.appendChild(title);
        view.svg.appendChild(line);
        var label;
        if (edge.label) {
          var longest = {length: 0, horizontal: false};
          points.slice(1).forEach(function (point, index) {
            var previous = points[index];
            var length = Math.abs(point.x - previous.x) + Math.abs(point.y - previous.y);
            var horizontalSegment = point.y === previous.y && length > 20;
            if ((horizontalSegment && !longest.horizontal) || (horizontalSegment === longest.horizontal && length > longest.length)) { longest = {length: length, horizontal: horizontalSegment, x: (point.x + previous.x) / 2, y: (point.y + previous.y) / 2}; }
          });
          label = svgElement('g', {class: 'sd-edge-label', transform: 'translate(' + longest.x + ' ' + longest.y + ')'});
          var labelWidth = edge.label.length * 5.5 + 12;
          label.appendChild(svgElement('rect', {x: -labelWidth / 2, y: -9, width: labelWidth, height: 18, rx: 5}));
          var labelText = svgElement('text');
          labelText.textContent = edge.label;
          label.appendChild(labelText);
          view.svg.appendChild(label);
        }
        view.drawnEdges.push({edge: edge, line: line, label: label});
      });
      highlight(view);
    }

    function schedule() {
      if (frame) { return; }
      frame = window.requestAnimationFrame(function () {
        frame = 0;
        views.forEach(function (view) { if (view.data.id === currentView) { draw(view); } });
      });
    }

    function selectTab(tab, focus) {
      currentView = tab.getAttribute('data-sd-tab');
      tabs.forEach(function (button) { var active = button === tab; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; });
      views.forEach(function (view) { view.panel.hidden = view.data.id !== currentView; });
      if (focus) { tab.focus(); }
      schedule();
    }

    views.forEach(function (view) {
      view.panel.setAttribute('role', 'tabpanel');
      view.panel.setAttribute('aria-labelledby', 'sd-tab-' + view.data.id);
      view.panel.removeAttribute('aria-label');
      view.elements.forEach(function (element, id) { element.addEventListener('click', function () { selectNode(view, view.selected === id ? '' : id, false); }); });
      view.panel.querySelectorAll('[data-sd-path]').forEach(function (button) {
        button.addEventListener('click', function () {
          view.path = button.getAttribute('data-sd-path');
          view.selected = '';
          highlight(view);
          showInspector(view);
        });
      });
      view.panel.querySelectorAll('.sd-paths, .sd-interaction-hint').forEach(function (element) { element.hidden = false; });
      view.inspector.hidden = false;
      if (window.ResizeObserver) { new ResizeObserver(schedule).observe(view.canvas); }
    });
    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { selectTab(tab, false); });
      tab.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowRight') { next = tabs[(index + 1) % tabs.length]; }
        if (event.key === 'ArrowLeft') { next = tabs[(index - 1 + tabs.length) % tabs.length]; }
        if (event.key === 'Home') { next = tabs[0]; }
        if (event.key === 'End') { next = tabs[tabs.length - 1]; }
        if (!next) { return; }
        event.preventDefault();
        selectTab(next, true);
      });
    });
    root.classList.add('is-enhanced');
    root.querySelector('.sd-tabs').hidden = false;
    selectTab(tabs[0], false);
    window.addEventListener('resize', schedule);
    if (document.fonts) { document.fonts.ready.then(schedule); }
  });
}());
