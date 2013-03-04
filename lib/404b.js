(function() {
	var id = "_404bresults",
		links = document.links,
		seen = {}, // list of seen URLs so we don't double request
		position = -1,
		timeoutMs = 10000, // 10 seconds?
		div = document.getElementById(id),
		ul = null, // ref for holding the results
		cleanup = [], // <link> nodes to clean up on remove()
		divAttrs = {
			id: id
		},
		divStyles = {
			position: "fixed",
			maxHeight: "300px",
			minWidth: "200px",
			overflowY: "scroll",
			padding: "8px 10px",
			margin: "0",
			right: "10px",
			top: "10px",
			zIndex: 99999, // arbitrarily high z-index
			textAlign: "left",
			lineHeight: 1.5,
			backgroundColor: "rgba(0, 0, 0, 0.7)",
			borderTop: "solid 1px rgba(255, 255, 255, 0.4)",
			borderLeft: "solid 1px rgba(0, 0, 0, 0.8)",
			borderRight: "solid 1px rgba(0, 0, 0, 0.8)",
			borderBottom: "solid 1px #000",
			BorderRadius: "5px",
			MozBorderRadius: "5px",
			WebkitBorderRadius: "5px",
			textShadow: "0 1px 0 #000",
			BoxShadow: "0 -1px 0 #000",
			MozBoxShadow: "0 -1px 0 #000",
			WebkitBoxShadow: "0 -1px 0 #000"
		},
		h2Styles = {
			font: "bold 14px Lucida Grande",
			margin: "0 0 5px 0",
			padding: "0",
			color: "#fff",
			fontWeight: "bold",
			clear: "both"
		},
		closeStyles = {
			font: "normal 11px Lucida Grande",
			cursor: "pointer",
			float: "right"
		},
		ulStyles = {
			margin: "0",
			padding: "0"
		},
		liStyles = {
			listStyleType: "none",
			margin: "0",
			padding: "0"
		},
		aStyles = {
			font: "normal 11px Lucida Grande",
			textDecoration: "underline",
			color: "#fff",
			display: "inline-block",
			width: "300px",
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis"
		},
		spanStyles = {
			font: "bold 11px Lucida Grande",
			color: "#FFCC00"
		},
		spanBadStyles = {
			color: "#CC0000"
		},
		spanGoodStyles = {
			color: "#33CC33"
		},
		spanUnknownStyles = {
			color: "#FF9900"
		};

	// If it exists, just remove it and bail
	if (div) {
		remove();
	}
	else {
		start();
	}

	function start() {
		div = create("div", divStyles, divAttrs);

		// Add a title
		var h2 = create("h2", h2Styles);
		h2.innerHTML = "404b Scan Results";
		div.appendChild(h2);

		var close = create("span", closeStyles, {
			onclick: remove
		});
		close.innerHTML = "close";
		h2.appendChild(close);

		// Add the list container
		ul = create("ul", ulStyles);
		div.appendChild(ul);

		// Add our node and just let the xhr/loads add children
		document.body.appendChild(div);

		get(++position);
	}

	function get(index) {
		if (index < links.length) {
			var node = links[index];
			var link = href(node);
			if (!seen[link]) {
				seen[link] = true;
				if (isXhrable(link)) {
					xhr(link, node);
				}
				else {
					crossDomain(link, node);
				}
			}
			else {
				get(++position);
			}
		}
	}

	function create(type, styles, attrs) {
		var element = document.createElement(type);

		if (styles) {
			style(element, styles);
		}

		// Add any attrs such as id / onclick
		if (attrs) {
			for (var attr in attrs) {
				element[attr] = attrs[attr];
			}
		}

		return element;
	}

	function remove() {
		document.body.removeChild(div);
		for (var i = 0; i < cleanup.length; i++) {
			var element = cleanup[i];
			element.parentNode.removeChild(element);
		}
	}

	// Style a node given a map
	function style(node, styles) {
		for (var s in styles) {
			node.style[s] = styles[s];
		}
	}

	function add(link, status) {
		var li = create("li", liStyles);
		var a = create("a", aStyles);
		var span = create("span", spanStyles);

		span.innerHTML = ": " + (status ? status : " loading...");
		a.innerHTML = a.href = link;
		a.target = "_blank";

		li.appendChild(a);
		li.appendChild(span);
		ul.appendChild(li);

		return span;
	}

	function href(node) {
		return node.href ? node.href : node.src;
	}

	// see if the link is on the same domain
	function isXhrable(link) {
		var host = window.location.hostname;
		var check = link.replace(/^https?:\/\//, "");
		return link.indexOf("/") === 0 || check.indexOf(host) === 0;
	}

	// XHR method for checking a link, will use correct status codes
	function xhr(link, node) {
		var request = new XMLHttpRequest(),
			span = add(link),
			timeout = null,
			abort = function() {
				clearTimeout(timeout);
				request.abort();
				style(span, spanUnknownStyles);
				span.innerHTML = ": timeout (" + timeoutMs + "ms)";
				get(++position);
			},
			onreadystatechange = function() {
				if (request.readyState === 4) {
					clearTimeout(timeout);

					if (request.status !== 200) {
						style(span, spanBadStyles);
						span.innerHTML = ": " + request.status;
						console.dir(node); // print bad nodes out to the console for inspection
					}
					else {
						style(span, spanGoodStyles);
						span.innerHTML = ": OK (" + request.status + ")";
					}

					get(++position);
				}
			};

		request.onreadystatechange = onreadystatechange;
		timeout = setTimeout(abort, timeoutMs);
		request.open("GET", link, true);
		request.send();
	}

	// Through various testing, adding a <link> element will cause the onerror to fire properly for 404s in chrome
	function crossDomain(link, node) {
		var span = add(link),
			l = create("link"),
			head = document.getElementsByTagName("head")[0],
			onload = function() {
				style(span, spanGoodStyles);
				span.innerHTML = ": OK (unknown)";

				get(++position);
			},
			onerror = function() {
				style(span, spanBadStyles);
				span.innerHTML = ": error (unknown xdomain)";
				console.dir(node); // print bad nodes out to the console for inspection

				get(++position);
			};


		l.rel = "stylesheet";
		l.type = "text/css";
		l.href = link;
		l.media = "none";

		l.onload = onload;
		l.onerror = onerror;

		// Save off these nodes for when 'close' is pressed
		cleanup.push(l);

		head.appendChild(l);
	}
})();
