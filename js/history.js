function hashchange(e) {
	const [link, ...sub] = _getHashParts();

	if (!e || sub.length === 0) {
		const $el = _getListElem(link);
		loadhash($el.attr("id"));
		document.title = decodeURIComponent($el.attr("title")) + " - 5etools";
	}

	if (typeof loadsub === "function" && sub.length > 0)
		loadsub(sub)
}

function initHistory() {
	window.onhashchange = hashchange;
	if (window.location.hash.length) {
		hashchange();
	} else {
		location.replace($("#listcontainer .list a").attr('href'));
	}
}

function getSelectedListElement() {
	const [link, ...sub] = _getHashParts();
	return _getListElem(link);
}

function _getHashParts() {
	return window.location.hash.slice(1).split(',');
}

function _getListElem(link) {
	return $(`#listcontainer a[href='#${link.toLowerCase()}']`);
}