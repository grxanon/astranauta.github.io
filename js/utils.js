// STRING ==============================================================================================================
function utils_joinPhraseArray(array, joiner, lastJoiner) {
	if (array.length === 0) return "";
	if (array.length === 1) return array[0];
	if (array.length === 2) return array.join(lastJoiner);
	else {
		let outStr = "";
		for (let i = 0; i < array.length; ++i) {
			outStr += array[i];
			if (i < array.length-2) outStr += joiner;
			else if (i === array.length-2) outStr += lastJoiner
		}
		return outStr;
	}
}

String.prototype.uppercaseFirst = String.prototype.uppercaseFirst ||
	function () {
		let str = this.toString();
		if (str.length === 0) return str;
		if (str.length === 1) return str.charAt(0).toUpperCase();
		return str.charAt(0).toUpperCase() + str.slice(1);;
	};

// TEXT COMBINING ======================================================================================================
function utils_combineText(textList, tagPerItem, textBlockInlineTitle) {
	tagPerItem = tagPerItem === undefined ? null : tagPerItem;
	textBlockInlineTitle = textBlockInlineTitle === undefined ? null : textBlockInlineTitle;
	let textStack = "";
	for (let i = 0; i < textList.length; ++i) {
		if (typeof textList[i] === 'object') {
            if (textList[i].islist === "YES") {
                textStack += utils_makeList(textList[i]);
			}
			if (textList[i].hassubtitle === "YES") {
				textStack += utils_combineText(textList[i].text, tagPerItem, utils_makeSubHeader(textList[i].title));
			}
			if (textList[i].istable === "YES") {
				textStack += utils_makeTable(textList[i]);
			}
			if (textList[i].hassavedc === "YES") {
				textStack += utils_makeAttDc(textList[i]);
			}
			if (textList[i].hasattackmod === "YES") {
				textStack += utils_makeAttAttackMod(textList[i]);
			}
		} else {
			let openTag = tagPerItem === null ? "" : "<" + tagPerItem + ">";
			let closeTag = tagPerItem === null ? "" : "</" + tagPerItem + ">";
			let inlineTitle = textBlockInlineTitle !== null && i === 0 ? textBlockInlineTitle : "";
			textStack += openTag + inlineTitle + textList[i] + closeTag;
		}
	}
	return textStack;
}

function utils_makeTable(tableObject) {
	let tableStack = "<table>";
	if (tableObject.caption !== undefined) {
		tableStack += "<caption>" + tableObject.caption + "</caption>";
	}
	tableStack += "<thead><tr>";

	for (let i = 0; i < tableObject.thead.length; ++i) {
		tableStack += "<th" + makeTableThClassText(tableObject, i) + ">" + tableObject.thead[i] + "</th>"
	}

	tableStack += "</tr></thead><tbody>";
	for (let i = 0; i < tableObject.tbody.length; ++i) {
		tableStack += "<tr>";
		for (let j = 0; j < tableObject.tbody[i].length; ++j) {
			tableStack += "<td" + makeTableTdClassText(tableObject, j) + ">" + tableObject.tbody[i][j] + "</td>";
		}
		tableStack += "</tr>";
	}
	tableStack += "</tbody></table>";
	return tableStack;
}

function utils_makeAttDc(attDcObj) {
	return "<p class='spellabilitysubtext'><span>" + attDcObj.name + " save DC</span> = 8 + your proficiency bonus + your " + utils_makeAttChoose(attDcObj.attributes) + "</p>"

}
function utils_makeAttAttackMod(attAtkObj) {
	return "<p class='spellabilitysubtext'><span>" + attAtkObj.name + " attack modifier</span> = your proficiency bonus + your " + utils_makeAttChoose(attAtkObj.attributes) + "</p>"
}
function utils_makeList(listObj) {
	let outStack = "<ul>";
	for (let i = 0; i < listObj.items.length; ++i) {
		let cur = listObj.items[i];
		outStack += "<li>";
		for (let j = 0; j < cur.text.length; ++j) {
			if (cur.text[j].hassubtitle === "YES") {
				outStack += "<br>" + utils_makeListSubHeader(cur.text[j].title) + cur.text[j].text;
			} else {
				outStack += cur.text[j];
			}
		}
		outStack += "</li>";
	}
	return outStack + "</ul>";
}
function utils_makeSubHeader(text) {
	return "<span class='stats-sub-header'>" + text + ".</span> "
}
function utils_makeListSubHeader(text) {
	return "<span class='stats-list-sub-header'>" + text + ".</span> "
}
function utils_makeAttChoose(attList) {
	if (attList.length === 1) {
		return parse_attAbvToFull(attList[0]) + " modifier";
	} else {
		let attsTemp = [];
		for (let i = 0; i < attList.length; ++i) {
			attsTemp.push(parse_attAbvToFull(attList[i]));
		}
		return attsTemp.join(" or ") + " modifier (your choice)";
	}
}

function makeTableThClassText(tableObject, i) {
	return (tableObject.thstyleclass === undefined || i >= tableObject.thstyleclass.length ? "" : " class=\"" + tableObject.thstyleclass[i] + "\"")
}
function makeTableTdClassText(tableObject, i) {
	if (tableObject.tdstyleclass !== undefined) {
		return (tableObject.tdstyleclass === undefined || i >= tableObject.tdstyleclass.length ? "" : " class=\"" + tableObject.tdstyleclass[i] + "\"")
	} else {
		return makeTableThClassText(tableObject, i);
	}
}

function utils_makePrerequisite(prereqList, shorthand, makeAsArray) {
	shorthand = shorthand === undefined || shorthand === null ? false : shorthand;
	makeAsArray = makeAsArray === undefined || makeAsArray === null ? false : makeAsArray;
    let outStack = [];
    if (prereqList === undefined || prereqList === null) return "";
	for (let i = 0; i < prereqList.length; ++i) {
        let pre = prereqList[i];
        if (pre.race !== undefined) {
			for (let j = 0; j < pre.race.length; ++j) {
				if (shorthand) {
					const DASH = "-";
					let raceNameParts = pre.race[j].name.split(DASH);
					let raceName = [];
					for (let k = 0; k < raceNameParts.length; ++k) {
						raceName.push(raceNameParts[k].uppercaseFirst());
					}
					raceName = raceName.join(DASH);
					outStack.push(raceName + (pre.race[j].subrace !== undefined ? " (" + pre.race[j].subrace + ")" : ""))
				} else {
					let raceName = j === 0 ? pre.race[j].name.uppercaseFirst() : pre.race[j].name;
					outStack.push(raceName + (pre.race[j].subrace !== undefined ? " (" + pre.race[j].subrace + ")" : ""))
				}
			}
		}
		if (pre.ability !== undefined) {
        	// this assumes all ability requirements are the same (13), correct as of 2017-10-06
        	let attCount = 0;
            for (let j = 0; j < pre.ability.length; ++j) {
                for (let att in pre.ability[j]) {
                    if (!pre.ability[j].hasOwnProperty(att)) continue;
                    if (shorthand) {
						outStack.push(att.uppercaseFirst() + (attCount === pre.ability.length -1 ? " 13+" : ""));
					} else {
						outStack.push(parse_attAbvToFull(att) + (attCount === pre.ability.length -1 ? " 13 or higher" : ""));
					}
                    attCount++;
                }
            }
		}
		if (pre.proficiency !== undefined) {
        	// only handles armor proficiency requirements,
            for (let j = 0; j < pre.proficiency.length; ++j) {
                for (let type in pre.proficiency[j]) { // type is armor/weapon/etc.
                    if (!pre.proficiency[j].hasOwnProperty(type)) continue;
                    if (type === "armor") {
                    	if (shorthand) {
							outStack.push("prof " + parse_abbreviateArmor(pre.proficiency[j][type]) + " armor");
						} else {
							outStack.push("Proficiency with " + pre.proficiency[j][type] + " armor");
						}
					}
					else console.log("unimplemented proficiency type in utils_makePrerequisite")
                }
            }
		}
		if (pre.spellcasting === "YES") {
        	if (shorthand) {
				outStack.push("Spellcasting");
			} else {
				outStack.push("The ability to cast at least one spell");
			}
		}
	}
	if (makeAsArray) {
		return outStack;
	} else {
		if (shorthand) return outStack.join("/");
		else return utils_joinPhraseArray(outStack, ", ", " or ");
	}
}

function utils_getAttributeText(attObj) {
	const ATTRIBUTES = ["Str", "Dex", "Con", "Int", "Wis", "Cha"];
	let mainAtts = [];
	let atts = [];
	if (attObj !== undefined) {
		handleAllAttributes(attObj);
		handleAttributesChoose();
		return atts.join("; ");
	}
	return "";

	function handleAllAttributes(abilityList) {
		for (let a = 0; a < ATTRIBUTES.length; ++a) {
			handleAttribute(abilityList, ATTRIBUTES[a])
		}
	}

	function handleAttribute(parent, att) {
		if (parent[att.toLowerCase()] !== undefined) {
			atts.push(att + " " + (parent[att.toLowerCase()] < 0 ? "" : "+") + parent[att.toLowerCase()]);
			mainAtts.push(att);
		}
	}

	function handleAttributesChoose() {
		if (attObj.choose !== undefined) {
			for (let i = 0; i < attObj.choose.length; ++i) {
				let item = attObj.choose[i];
				let outStack = "Choose ";
				if (item.predefined !== undefined) {
					for (let j = 0; j < item.predefined.length; ++j) {
						let subAtts = [];
						handleAllAttributes(subAtts, item.predefined[j]);
						outStack += subAtts.join(", ") + (j === item.predefined.length - 1 ? "" : " or ");
					}
				} else {
					let allAttributes = item.from.length === 6;
					let allAttributesWithParent = isAllAttributesWithParent(item);
					let amount = item.amount === undefined ? 1 : item.amount;
					amount = (amount < 0 ? "" : "+") + amount;
					if (allAttributes) {
						outStack += "any ";
					} else if (allAttributesWithParent) {
						outStack += "any other ";
					}
					if (item.count !== undefined && item.count > 1) {
						outStack += getNumberString(item.count) + " ";
					}
					if (allAttributes || allAttributesWithParent) {
						outStack += amount;
					} else {
						for (let j = 0; j < item.from.length; ++j) {
							let suffix = "";
							if (item.from.length > 1) {
								if (j === item.from.length-2) {
									suffix = " or ";
								} else if (j < item.from.length-2) {
									suffix = ", "
								}
							}
							let thsAmount = " " + amount;
							if (item.from.length > 1) {
								if (j !== item.from.length-1) {
									thsAmount = "";
								}
							}
							outStack += item.from[j].uppercaseFirst() + thsAmount + suffix;
						}
					}
				}
				atts.push(outStack)
			}

			function isAllAttributesWithParent(item) {
				let tempAttributes = [];
				for (let i = 0; i < mainAtts.length; ++i) {
					tempAttributes.push(mainAtts[i].toLowerCase());
				}
				for (let i = 0; i < item.from.length; ++i) {
					let attb = item.from[i].toLowerCase();
					if (!tempAttributes.includes(attb)) {
						tempAttributes.push(attb)
					}
				}
				return tempAttributes.length === 6;
			}
		}
	}

	function getNumberString(amount) {
		if (amount === 1) return "one";
		if (amount === 2) return "two";
		if (amount === 3) return "three";
		else return amount;
	}
}

// PARSING FUNCTIONS ===================================================================================================
function parse_attAbvToFull(attribute) {
	const ABV_TO_FULL = {
		"str": "Strength",
		"dex": "Dexterity",
		"con": "Constitution",
		"int": "Intelligence",
		"wis": "Wisdom",
		"cha": "Charisma"
	};
	return ABV_TO_FULL[attribute.toLowerCase()];
}

const ARMR_LIGHT = "light";
const ARMR_MEDIUM = "medium";
const ARMR_HEAVY = "heavy";
const ARMR_LIGHT_ABBV = "l.";
const ARMR_MEDIUM_ABBV = "m.";
const ARMR_HEAVY_ABBV = "h.";
function parse_abbreviateArmor(armor) {
	if (armor === ARMR_LIGHT) armor = ARMR_LIGHT_ABBV;
	if (armor === ARMR_MEDIUM) armor = ARMR_MEDIUM_ABBV;
	if (armor === ARMR_HEAVY) armor = ARMR_HEAVY_ABBV;
	return armor;
}

const SRC_PHB = "PHB";
const SRC_EEPC = "EEPC";
const SRC_SCAG = "SCAG";
const SRC_UAMystic = "UAMystic";
const SRC_UAStarterSpells = "UAStarterSpells";
const SRC_UAModern = "UAModern";
const SRC_UATOBM = "UATOBM";
const SRC_UAEBB = "UAEB";
const SRC_UAFT = "UAFT";
const SRC_UAFFS = "UAFFS";
const SRC_UAFFR = "UAFFR";
const SRC_PSK = "PSK";
const SRC_BOLS_3PP = "BoLS 3pp";
const SRC_DM01_3PP = "DM-01 3pp";
const SRC_DM02_3PP = "DM-02 3pp";
const SRC_DM03_3PP = "DM-03 3pp";
const SRC_DM04_3PP = "DM-04 3pp";
const SRC_DM05_3PP = "DM-05 3pp";
const SRC_DM06_3PP = "DM-06 3pp";
const SRC_DM07_3PP = "DM-07 3pp";
const SRC_DM08_3PP = "DM-08 3pp";
const SRC_DM09_3PP = "DM-09 3pp";
const SRC_DM10_3PP = "DM-10 3pp";
const SRC_DM11_3PP = "DM-11 3pp";
const SRC_DM12_3PP = "DM-12 3pp";
const SRC_DM13_3PP = "DM-13 3pp";

const UA_PREFIX = "Unearthed Arcana: ";
const PS_PREFIX = "Plane Shift: ";
const DM_PREFIX = "Deep Magic: ";
function parse_sourceToFull (source) {
    if (source === SRC_PHB) source = "Player's Handbook";
    if (source === SRC_EEPC) source = "Elemental Evil Player's Companion";
    if (source === SRC_SCAG) source = "Sword Coast Adventurer's Guide";
    if (source === SRC_UAMystic) source = UA_PREFIX + "The Mystic Class";
    if (source === SRC_UAStarterSpells) source = UA_PREFIX + "Starter Spells";
    if (source === SRC_UAModern) source = UA_PREFIX + "Modern Magic";
    if (source === SRC_UATOBM) source = UA_PREFIX + "That Old Black Magic";
    if (source === SRC_UAEBB) source = UA_PREFIX + "Eberron";
    if (source === SRC_UAFT) source = UA_PREFIX + "Feats";
    if (source === SRC_UAFFS) source = UA_PREFIX + "Feats for Skills";
    if (source === SRC_UAFFR) source = UA_PREFIX + "Feats for Races";
    if (source === SRC_PSK) source = PS_PREFIX + "Kaladesh";
    if (source === SRC_BOLS_3PP) source = "Book of Lost Spells (3pp)";
    if (source === SRC_DM01_3PP) source = DM_PREFIX + "#01 - Clockwork (3pp)";
    if (source === SRC_DM02_3PP) source = DM_PREFIX + "#02 - Rune Magic (3pp)";
    if (source === SRC_DM03_3PP) source = DM_PREFIX + "#03 - Void Magic (3pp)";
    if (source === SRC_DM04_3PP) source = DM_PREFIX + "#04 - Illumination Magic (3pp)";
    if (source === SRC_DM05_3PP) source = DM_PREFIX + "#05 - Ley Lines (3pp)";
    if (source === SRC_DM06_3PP) source = DM_PREFIX + "#06 - Angelic Seals (3pp)";
    if (source === SRC_DM07_3PP) source = DM_PREFIX + "#07 - Chaos Magic (3pp)";
    if (source === SRC_DM08_3PP) source = DM_PREFIX + "#08 - Battle Magic (3pp)";
    if (source === SRC_DM09_3PP) source = DM_PREFIX + "#09 - Ring Magic (3pp)";
    if (source === SRC_DM10_3PP) source = DM_PREFIX + "#10 - Shadow Magic (3pp)";
    if (source === SRC_DM11_3PP) source = DM_PREFIX + "#11 - Elven High Magic (3pp)";
    if (source === SRC_DM12_3PP) source = DM_PREFIX + "#12 - Blood and Doom (3pp)";
    if (source === SRC_DM13_3PP) source = DM_PREFIX + "#13 - Dragon Magic (3pp)";
    return source;
}
function parse_abbreviateSource(source) {
    if (source === SRC_PHB) source = "PHB";
    if (source === SRC_EEPC) source = "EEPC";
    if (source === SRC_SCAG) source = "SCAG";
    if (source === SRC_UAMystic) source = "UAM";
    if (source === SRC_UAStarterSpells) source = "UASS";
    if (source === SRC_UAModern) source = "UAMM";
    if (source === SRC_UATOBM) source = "UAOBM";
    if (source === SRC_UAEBB) source = "UAEB";
    if (source === SRC_UAFT) source = "UAFT";
    if (source === SRC_UAFFS) source = "UAFFS";
    if (source === SRC_UAFFR) source = "UAFFR";
    if (source === SRC_PSK) source = "PSK";
    if (source === SRC_BOLS_3PP) source = "BLS";
    if (source === SRC_DM01_3PP) source = "DM01";
    if (source === SRC_DM02_3PP) source = "DM02";
    if (source === SRC_DM03_3PP) source = "DM03";
    if (source === SRC_DM04_3PP) source = "DM04";
    if (source === SRC_DM05_3PP) source = "DM05";
    if (source === SRC_DM06_3PP) source = "DM06";
    if (source === SRC_DM07_3PP) source = "DM07";
    if (source === SRC_DM08_3PP) source = "DM08";
    if (source === SRC_DM09_3PP) source = "DM09";
    if (source === SRC_DM10_3PP) source = "DM10";
    if (source === SRC_DM11_3PP) source = "DM11";
    if (source === SRC_DM12_3PP) source = "DM12";
    if (source === SRC_DM13_3PP) source = "DM13";
    return source;
}