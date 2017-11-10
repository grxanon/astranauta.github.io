const STR_JOIN_MODE_LIST = ",";
const STR_JOIN_MODE_TITLE_BRACKET_PART_LIST = "; ";
const STR_JOIN_MODE_TITLE = " ";
const STR_ABV_TYPE_TALENT = "T";
const STR_ABV_TYPE_DISCIPLINE = "D";
const STR_TYPE_TALENT = "Talent";
const STR_TYPE_DISCIPLINE = "Discipline";
const STR_ORDER_NONE = "None";

const TMP_HIDDEN_MODE = `"{0}"`;

const ID_PSIONICS_LIST = "psionicsList";
const ID_STATS_NAME = "name";
const ID_STATS_ORDER_AND_TYPE = "orderAndType";
const ID_STATS_DURATION = "duration";
const ID_TEXT = "text";

const JSON_ITEM_NAME = "name";
const JSON_ITEM_SOURCE = "source";
const JSON_ITEM_TYPE = "type";
const JSON_ITEM_ORDER = "order";
const JSON_ITEM_TEXT = "text";
const JSON_ITEM_DURATION = "duration";
const JSON_ITEM_DESCRIPTION = "description";
const JSON_ITEM_FOCUS = "focus";
const JSON_ITEM_MODES = "modes";
const JSON_ITEM_SUBMODES = "submodes";
const JSON_ITEM_MODE_TITLE = "title";
const JSON_ITEM_MODE_TEXT = "text";
const JSON_ITEM_MODE_COST = "cost";
const JSON_ITEM_MODE_COST_MIN = "min";
const JSON_ITEM_MODE_COST_MAX = "max";
const JSON_ITEM_MODE_CONCENTRATION = "concentration";
const JSON_ITEM_MODE_CONCENTRATION_DURATION = "duration";
const JSON_ITEM_MODE_CONCENTRATION_UNIT = "unit";

const CLS_PSIONICS = "psionics";
const CLS_ROW = "row";
const CLS_COL1 = "col-xs-5";
const CLS_COL2 = "col-xs-2";
const CLS_COL3 = "col-xs-2";
const CLS_COL4 = "col-xs-2";
const CLS_HIDDEN = "hidden";
const CLS_LI_NONE = "list-entry-none";

const LIST_NAME = "name";
const LIST_SOURCE = "source";
const LIST_TYPE = "type";
const LIST_ORDER = "order";
const LIST_MODE_LIST = "mode-list";

window.onload = function load() {
	const TABLE_VIEW = document.getElementById(ID_PSIONICS_LIST);

	const PSIONIC_LIST = psionicdata.compendium.psionic;
	populateListView();
	const listView = initListLibrary();
	initFiltersAndSearch(listView);
	selectInitialPsionic();

	function populateListView() {
		for (let i = 0; i < PSIONIC_LIST.length; ++i) {
			const psionic = PSIONIC_LIST[i];

			const link = document.createElement(ELE_A);
			link.setAttribute(ATB_ID, String(i));
			link.setAttribute(ATB_HREF, `#${utils_nameToDataLink(psionic[JSON_ITEM_NAME])}`);
			link.setAttribute(ATB_TITLE, psionic[JSON_ITEM_NAME]);
			link.appendChild(getNameSpan(psionic));
			link.appendChild(getSourceSpan(psionic));
			link.appendChild(getTypeSpan(psionic));
			link.appendChild(getOrderSpan(psionic));
			link.appendChild(getHiddenModeSpan(psionic));

			const listItem = getListItem(psionic);
			listItem.appendChild(link);
			TABLE_VIEW.appendChild(listItem);
		}

		function getListItem(psionic) {
			const listItem = document.createElement(ELE_LI);
			listItem.setAttribute(ATB_CLASS, CLS_ROW);
			listItem.setAttribute(ATB_TITLE, psionic[JSON_ITEM_NAME]);
			listItem.setAttribute(FLTR_SOURCE, psionic[JSON_ITEM_SOURCE]);
			listItem.setAttribute(FLTR_TYPE, psionic[JSON_ITEM_TYPE]);
			const order = psionic[JSON_ITEM_ORDER] === undefined ? STR_ORDER_NONE : psionic[JSON_ITEM_ORDER];
			listItem.setAttribute(FLTR_ORDER, order);
			return listItem;
		}
		function getNameSpan(psionic) {
			const span = document.createElement(ELE_SPAN);
			span.classList.add(LIST_NAME);
			span.classList.add(CLS_COL1);
			span.innerHTML = psionic[JSON_ITEM_NAME];
			return span;
		}
		function getSourceSpan(psionic) {
			const span = document.createElement(ELE_SPAN);
			span.classList.add(LIST_SOURCE);
			span.classList.add(CLS_COL2);
			span.setAttribute(ATB_TITLE, parse_sourceJsonToFull(psionic[JSON_ITEM_SOURCE]));
			span.innerHTML = parse_sourceJsonToAbv(psionic[JSON_ITEM_SOURCE]);
			return span;
		}
		function getTypeSpan(psionic) {
			const span = document.createElement(ELE_SPAN);
			span.classList.add(LIST_TYPE);
			span.classList.add(CLS_COL3);
			span.innerHTML = parse_psionicTypeToFull(psionic[JSON_ITEM_TYPE]);
			return span;
		}
		function getOrderSpan(psionic) {
			const span = document.createElement(ELE_SPAN);
			span.classList.add(LIST_ORDER);
			span.classList.add(CLS_COL4);
			const spanText = parse_psionicOrderToFull(psionic[JSON_ITEM_ORDER]);
			if (spanText === STR_ORDER_NONE) {
				span.classList.add(CLS_LI_NONE);
			}
			span.innerHTML = spanText;
			return span;
		}
		function getHiddenModeSpan(psionic) {
			const span = document.createElement(ELE_SPAN);
			span.classList.add(LIST_MODE_LIST);
			span.classList.add(CLS_HIDDEN);
			span.innerHTML = getHiddenModeList(psionic);
			return span;
		}
		function getHiddenModeList(psionic) {
			const modeList = psionic[JSON_ITEM_MODES];
			if (modeList === undefined) return STR_EMPTY;
			const outArray = [];
			for (let i = 0; i < modeList.length; ++i) {
				outArray.push(TMP_HIDDEN_MODE.formatUnicorn(modeList[i][JSON_ITEM_MODE_TITLE]));
				if (modeList[i][JSON_ITEM_SUBMODES] !== undefined) {
					const subModes = modeList[i][JSON_ITEM_SUBMODES];
					for (let j = 0; j < subModes.length; ++j) {
						outArray.push(TMP_HIDDEN_MODE.formatUnicorn(subModes[j][JSON_ITEM_MODE_TITLE]))
					}
				}
			}
			return outArray.join(STR_JOIN_MODE_LIST);
		}
	}

	function initFiltersAndSearch(listView) {
		const HDR_SOURCE = "Source";
		const HDR_TYPE = "Type";
		const HDR_ORDER = "Order";

		const filters = {};
		filters[HDR_SOURCE] = {item: JSON_ITEM_SOURCE, list: [], renderer: function(str) { return parse_sourceJsonToFull(str); }};
		filters[HDR_TYPE] = {item: JSON_ITEM_TYPE, list: [], renderer: function(str) { return parse_psionicTypeToFull(str); }};
		filters[HDR_ORDER] = {item: JSON_ITEM_ORDER, list: [], renderer: function(str) { return parse_psionicOrderToFull(str); }};

		populateFilterSets();
		sortFilterSets();
		const filterBox = initFilters();
		initResetButton(filterBox);

		function populateFilterSets() {
			for (let i = 0; i < PSIONIC_LIST.length; ++i) {
				const psionic = PSIONIC_LIST[i];
				for (const id in filters) {
					if (filters.hasOwnProperty(id)) {
						const filterObj = filters[id];

						if (psionic[filterObj.item] !== undefined && filterObj.list.indexOf(psionic[filterObj.item]) === -1) {
							filterObj.list.push(psionic[filterObj.item]);
						}
					}
				}
			}
		}
		function sortFilterSets() {
			for (const id in filters) {
				if (filters.hasOwnProperty(id)) {
					sortStrings(filters[id].list);
				}
			}

			// add this after sorting, as the last element
			filters[HDR_ORDER].list.push(STR_ORDER_NONE);

			function sortStrings(toSort) {
				toSort.sort(sortStringsComparator);
			}
			function sortStringsComparator(a, b) {
				a = a.toLowerCase();
				b = b.toLowerCase();
				if (a === b) return 0;
				else if (b < a) return 1;
				else if (a > b) return -1;
			}
		}

		function initFilters() {
			const filterAndSearchBar = document.getElementById(ID_SEARCH_BAR);
			const filterList = [];
			for (const title in filters) {
				if (filters.hasOwnProperty(title)) {
					filterList.push(new Filter(title, filters[title].item, filters[title].list, filters[title].renderer, parse_stringToSlug));
				}
			}
			const filterBox = new FilterBox(filterAndSearchBar, filterList);
			filterBox.render();

			filterBox.addEventListener(
				FilterBox.EVNT_VALCHANGE,
				function () {
					listView.filter(function(item) {
						const f = filterBox.getValues();

						return filterMatches(HDR_SOURCE, FLTR_SOURCE) && filterMatches(HDR_TYPE, FLTR_TYPE) && filterMatches(HDR_ORDER, FLTR_ORDER);

						function filterMatches(header, filterProperty) {
							for (const t in f[header]) {
								if (!f[header].hasOwnProperty(t)) continue;
								if (t === FilterBox.VAL_SELECT_ALL && f[header][t]) return true;
								if (!f[header][t]) continue;


								if (f[header][parse_stringToSlug(item.elm.getAttribute(filterProperty))] && parse_stringToSlug(item.elm.getAttribute(filterProperty)) === t) return true;
							}
							return false;
						}
					});
				}
			);

			return filterBox;
		}
	}

	function initResetButton(filterBox) {
		const RESET_BUTTON = document.getElementById(ID_RESET_BUTTON);
		RESET_BUTTON.addEventListener(EVNT_CLICK, resetButtonClick, false);

		function resetButtonClick() {
			filterBox.reset();
		}
	}

	function initListLibrary() {
		return search({
			valueNames: [LIST_NAME, LIST_SOURCE, LIST_TYPE, LIST_ORDER, LIST_MODE_LIST],
			listClass: CLS_PSIONICS,
			sortFunction: listSort
		});

		function listSort(itemA, itemB, options) {
			if (options.valueName === LIST_NAME) return compareBy(LIST_NAME);
			else return compareByOrDefault(options.valueName, LIST_NAME);

			function compareBy(valueName) {
				const aValue = itemA.values()[valueName].toLowerCase();
				const bValue = itemB.values()[valueName].toLowerCase();
				if (aValue === bValue) return 0;
				return (aValue > bValue) ? 1 : -1;
			}
			function compareByOrDefault(valueName, defaultValueName) {
				const initialCompare = compareBy(valueName);
				return initialCompare === 0 ? compareBy(defaultValueName) : initialCompare;
			}
		}
	}

	function selectInitialPsionic() {
		initHistory();
	}
};

function loadhash (jsonIndex) {
	const STATS_NAME = document.getElementById(ID_STATS_NAME);
	const STATS_ORDER_AND_TYPE = document.getElementById(ID_STATS_ORDER_AND_TYPE);
	const STATS_DURATION = document.getElementById(ID_STATS_DURATION);
	const STATS_TEXT = document.getElementById(ID_TEXT);

	const selectedPsionic = psionicdata.compendium.psionic[jsonIndex];

	STATS_NAME.innerHTML = selectedPsionic[JSON_ITEM_NAME];
	if (selectedPsionic[JSON_ITEM_TYPE] === STR_ABV_TYPE_TALENT) loadTalent();
	else if (selectedPsionic[JSON_ITEM_TYPE] === STR_ABV_TYPE_DISCIPLINE) loadDiscipline();

	function loadTalent() {
		STATS_ORDER_AND_TYPE.innerHTML = parse_psionicTypeToFull(selectedPsionic[JSON_ITEM_TYPE]);
		STATS_TEXT.innerHTML = utils_combineText(selectedPsionic[JSON_ITEM_TEXT], ELE_P);
		STATS_DURATION.innerHTML = STR_EMPTY;
	}
	function loadDiscipline() {
		STATS_ORDER_AND_TYPE.innerHTML = `${selectedPsionic[JSON_ITEM_ORDER]} ${parse_psionicTypeToFull(selectedPsionic[JSON_ITEM_TYPE])}`;
		STATS_TEXT.innerHTML = getTextString();
		STATS_DURATION.innerHTML = getDurationString();

		function getTextString() {
			const modeStringArray = [];
			for (let i = 0; i < selectedPsionic[JSON_ITEM_MODES].length; ++i) {
				modeStringArray.push(getModeString(i));
			}

			return `${getDescriptionString()}${getFocusString()}${modeStringArray.join(STR_EMPTY)}`;
		}
		function getDescriptionString() {
			return `<p>${selectedPsionic[JSON_ITEM_DESCRIPTION]}</p>`;
		}
		function getFocusString() {
			return `<p><span class='psi-focus-title'>Psycic Focus.</span> ${selectedPsionic[JSON_ITEM_FOCUS]}</p>`;
		}
		function getModeString(modeIndex) {
			const modeString = utils_combineText(selectedPsionic[JSON_ITEM_MODES][modeIndex][JSON_ITEM_MODE_TEXT], ELE_P, getModeTitle(selectedPsionic[JSON_ITEM_MODES][modeIndex]));
			if (selectedPsionic[JSON_ITEM_MODES][modeIndex][JSON_ITEM_SUBMODES] === undefined) return modeString;
			const subModeString = getSubModeString();
			return `${modeString}${subModeString}`;

			function getSubModeString() {
				const modeStrings = [];
				const subModes = selectedPsionic[JSON_ITEM_MODES][modeIndex][JSON_ITEM_SUBMODES];
				for (let i = 0; i < subModes.length; ++i) {
					modeStrings.push(utils_combineText(subModes[i][JSON_ITEM_MODE_TEXT], ELE_P, getModeTitle(subModes[i], true)));
				}
				return modeStrings.join(STR_EMPTY);
			}

			function getModeTitle(mode, subMode) {
				subMode = subMode === undefined || subMode === null ? false : subMode;
				const modeTitleArray = [];
				modeTitleArray.push(mode[JSON_ITEM_MODE_TITLE]);
				const bracketPart = getModeTitleBracketPart();
				if (bracketPart !== null) modeTitleArray.push(bracketPart);
				if (subMode) return `<span class='psi-mode-sub-title'>${modeTitleArray.join(STR_JOIN_MODE_TITLE)}.</span> `;
				else return `<span class='psi-mode-title'>${modeTitleArray.join(STR_JOIN_MODE_TITLE)}.</span> `;

				function getModeTitleBracketPart() {
					const modeTitleBracketArray = [];

					if (mode[JSON_ITEM_MODE_COST]) modeTitleBracketArray.push(getModeTitleCost());
					if (mode[JSON_ITEM_MODE_CONCENTRATION]) modeTitleBracketArray.push(getModeTitleConcentration());

					if (modeTitleBracketArray.length === 0) return null;
					return `(${modeTitleBracketArray.join(STR_JOIN_MODE_TITLE_BRACKET_PART_LIST)})`;

					function getModeTitleCost() {
						const costMin = mode[JSON_ITEM_MODE_COST][JSON_ITEM_MODE_COST_MIN];
						const costMax = mode[JSON_ITEM_MODE_COST][JSON_ITEM_MODE_COST_MAX];
						const costString = costMin === costMax ? costMin : `${costMin}-${costMax}`;
						return `${costString} psi`;
					}
					function getModeTitleConcentration() {
						return `conc., ${mode[JSON_ITEM_MODE_CONCENTRATION][JSON_ITEM_MODE_CONCENTRATION_DURATION]} ${mode[JSON_ITEM_MODE_CONCENTRATION][JSON_ITEM_MODE_CONCENTRATION_UNIT]}.`
					}
				}
			}
		}
	}
	function getDurationString() {
		const duration = selectedPsionic[JSON_ITEM_DURATION];
		if (duration === undefined) return STR_EMPTY;
		else return getDurationElement();

		function getDurationElement() {

		}
	}
}

function parse_psionicTypeToFull(type) {
	if (type === STR_ABV_TYPE_TALENT) return STR_TYPE_TALENT;
	else if (type === STR_ABV_TYPE_DISCIPLINE) return STR_TYPE_DISCIPLINE;
	else return type;
}
function parse_psionicOrderToFull(order) {
	return order === undefined ? STR_ORDER_NONE : order;
}
