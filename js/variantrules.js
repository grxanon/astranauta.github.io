const JSON_URL = "data/variantrules.json";

window.onload = function load() {
	loadJSON(JSON_URL, onJsonLoad);
};

let rulesList;
let tableDefault;

const entryRenderer = new EntryRenderer();

function onJsonLoad(data) {
	rulesList = data;
	tableDefault = $("#stats").html();

	const filterAndSearchBar = document.getElementById(ID_SEARCH_BAR);
	const filterList = [];
	const sourceFilter = new Filter("Source", FLTR_SOURCE, [], parse_sourceJsonToFull, parse_stringToSlug);
	filterList.push(sourceFilter);
	const filterBox = new FilterBox(filterAndSearchBar, filterList);

	for (let i = 0; i < rulesList.length; i++) {
		const curRule = rulesList[i];
		// populate table
		$("ul.variantRules").append(`<li ${FLTR_SOURCE}='${curRule.source}'><a id='${i}' href='#${encodeForHash(curRule.name)}_${encodeForHash(curRule.source)}' title='${curRule.name}'><span class='name col-xs-10'>${curRule.name}</span><span class='source col-xs-2' title='${parse_sourceJsonToFull(curRule.source)}'>${parse_sourceJsonToAbv(curRule.source)}</span></a></li>`);

		// populate filters
		if ($.inArray(curRule.source, sourceFilter.items) === -1) {
			sourceFilter.items.push(curRule.source);
		}
	}

	const list = search({
		valueNames: ['name', 'source'],
		listClass: "variantRules"
	});

	sourceFilter.items.sort(ascSort);

	// filtering function
	$(filterBox).on(
		FilterBox.EVNT_VALCHANGE,
		function () {
			list.filter(function(item) {
				const f = filterBox.getValues();
				return f[sourceFilter.header][FilterBox.VAL_SELECT_ALL] || f[sourceFilter.header][sourceFilter.valueFunction($(item.elm).attr(sourceFilter.storageAttribute))];
			});
		}
	);

	// add filter reset to reset button
	document.getElementById(ID_RESET_BUTTON).addEventListener(EVNT_CLICK, function() {filterBox.reset();}, false);

	filterBox.render();
	initHistory()
}

function loadhash (id) {
	// reset details pane to initial HTML
	$("#stats").html(tableDefault);

	const curRule = rulesList[id];

	$("th#name").html(curRule.name);

	// build text list and display
	$("tr.text").remove();
	const textStack = [];
	entryRenderer.recursiveEntryRender(curRule, textStack);
	$("tr#text").after("<tr class='text'><td colspan='6'>" + textStack.join("") + "</td></tr>");
}