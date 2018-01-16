"use strict";

const JSON_URL = "data/deities.json";
const STR_REPRINTED = "reprinted";

window.onload = function load () {
	DataUtil.loadJSON(JSON_URL, onJsonLoad);
};

function parseAlignmentToFull (alignment) {
	alignment = alignment.toUpperCase();
	switch (alignment) {
		case "L":
			return "Lawful";
		case "N":
			return "Neutral";
		case "C":
			return "Chaotic";
		case "G":
			return "Good";
		case "E":
			return "Evil";
	}
	return alignment;
}

function alignSort (a, b) {
	const first = ["L", "C"];
	const last = ["G", "E"];
	if (a === b) return 0;
	if (first.includes(a)) return -1;
	if (last.includes(b)) return 1;
	return 1;
}

let deitiesList;

function onJsonLoad (data) {
	deitiesList = data.deity;

	const alignmentFilter = new Filter({
		header: "Alignment",
		items: ["C", "E", "G", "L", "N"],
		displayFn: parseAlignmentToFull
	});
	const pantheonFilter = new Filter({
		header: "Pantheon",
		items: [
			"Celtic",
			"Dawn War",
			"Dragonlance",
			"Drow",
			"Dwarven",
			"Eberron",
			"Egyptian",
			"Elven",
			"Faerûnian",
			"Forgotten Realms",
			"Gnomish",
			"Greek",
			"Greyhawk",
			"Halfling",
			"Nonhuman",
			"Norse",
			"Orc"
		]
	});
	const categoryFilter = new Filter({
		header: "Category",
		items: [
			STR_NONE,
			"Other Faiths of Eberron",
			"The Dark Six",
			"The Gods of Evil",
			"The Gods of Good",
			"The Gods of Neutrality",
			"The Sovereign Host"
		]
	});
	const domainFilter = new Filter({
		header: "Domain",
		items: ["Arcana", "Death", "Forge", "Grave", "Knowledge", "Life", "Light", "Nature", STR_NONE, "Tempest", "Trickery", "War"]
	});
	const miscFilter = new Filter({
		header: "Miscellaneous",
		items: [STR_REPRINTED],
		displayFn: StrUtil.uppercaseFirst,
		deselFn: (it) => { return it === STR_REPRINTED }
	});

	const filterBox = initFilterBox(alignmentFilter, pantheonFilter, categoryFilter, domainFilter, miscFilter);

	let tempString = "";
	deitiesList.forEach((g, i) => {
		const abvSource = Parser.sourceJsonToAbv(g.source);

		g.alignment.sort(alignSort);
		if (!g.category) g.category = STR_NONE;
		if (!g.domains) g.domains = [STR_NONE];
		g.domains.sort(ascSort);

		g._fReprinted = g.reprinted ? STR_REPRINTED : "";

		tempString += `
			<li class="row" ${FLTR_ID}="${i}">
				<a id="${i}" href="#${UrlUtil.autoEncodeHash(g)}" title="${g.name}">
					<span class="name col-xs-3">${g.name}</span>
					<span class="pantheon col-xs-2 text-align-center">${g.pantheon}</span>
					<span class="alignment col-xs-2 text-align-center">${g.alignment.join("")}</span>
					<span class="domains col-xs-3 ${g.domains[0] === STR_NONE ? `list-entry-none` : ""}">${g.domains.join(", ")}</span>
					<span class="source col-xs-2 source${abvSource}" title="${Parser.sourceJsonToFull(g.source)}">${abvSource}</span>
				</a>
			</li>
		`;

		categoryFilter.addIfAbsent(g.category);
	});
	$(`#deitiesList`).append(tempString);
	// sort filters
	categoryFilter.items.sort();

	const list = search({
		valueNames: ["name", "pantheon", "alignment", "domains", "symbol", "source"],
		listClass: "deities",
		sortFunction: listSort
	});

	filterBox.render();

	// filtering function
	$(filterBox).on(
		FilterBox.EVNT_VALCHANGE,
		handleFilterChange
	);

	function handleFilterChange () {
		const f = filterBox.getValues();
		list.filter(function (item) {
			const g = deitiesList[$(item.elm).attr(FLTR_ID)];

			const rightAlignment = alignmentFilter.toDisplay(f, g.alignment);
			const rightPantheon = pantheonFilter.toDisplay(f, g.pantheon);
			const rightCategory = categoryFilter.toDisplay(f, g.category);
			const rightDomain = domainFilter.toDisplay(f, g.domains);
			const rightMisc = miscFilter.toDisplay(f, g._fReprinted);
			return rightAlignment && rightPantheon && rightCategory && rightDomain && rightMisc;
		});
	}

	initHistory();
	handleFilterChange();
	RollerUtil.addListRollButton();
	addListShowHide();
}

const renderer = new EntryRenderer();
function loadhash (jsonIndex) {
	const deity = deitiesList[jsonIndex];

	const renderStack = [];
	if (deity.entries) renderer.recursiveEntryRender({entries: deity.entries}, renderStack);

	const $content = $(`#pagecontent`);
	$content.html(`
		${EntryRenderer.utils.getBorderTr()}
		${EntryRenderer.utils.getNameTr(deity)}
		<tr><td colspan="6"><span class="bold">Title: </span>${deity.title}</td></tr>
		<tr><td colspan="6"><span class="bold">Pantheon: </span>${deity.pantheon}</td></tr>
		${deity.category ? `<tr><td colspan="6"><span class="bold">Category: </span>${deity.category}</td></tr>` : ""}
		<tr><td colspan="6"><span class="bold">Alignment: </span>${deity.alignment.map(a => parseAlignmentToFull(a)).join(" ")}</td></tr>
		<tr><td colspan="6"><span class="bold">Domains: </span>${deity.domains.join(", ")}</td></tr>
		<tr><td colspan="6"><span class="bold">Symbol: </span>${deity.symbol}</td></tr>
		${renderStack.length ? `<tr class="text"><td colspan="6">${renderStack.join("")}</td></tr>` : ""}
		${EntryRenderer.utils.getPageTr(deity)}
		${EntryRenderer.utils.getBorderTr()}
	`);
}
