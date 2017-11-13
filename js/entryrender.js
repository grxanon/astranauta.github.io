// ENTRY RENDERING =====================================================================================================
/*
 * // EXAMPLE USAGE //
 *
 * const entryRenderer = new EntryRenderer();
 *
 * const topLevelEntry = mydata[0];
 * // prepare an array to hold the string we collect while recursing
 * const textStack = [];
 *
 * // recurse through the entry tree
 * entryRenderer.renderEntries(topLevelEntry, textStack);
 *
 * // render the final product by joining together all the collected strings
 * $("#myElement").html(toDisplay.join(""));
 */
class EntryRenderer {

	static getEntryDice(entry) {
		// TODO make droll integration optional
		const toAdd = String(entry.number) + "d" + entry.faces;
		if (typeof droll !== "undefined" && entry.rollable === true) {
			// TODO output this somewhere nice
			// TODO make this less revolting
			return `<span class='roller unselectable' onclick="if (this.rolled) { this.innerHTML = this.innerHTML.split('=')[0].trim()+' = '+droll.roll('${toAdd}').total; } else { this.rolled = true; this.innerHTML += ' = '+droll.roll('${toAdd}').total; }">${toAdd}</span>`;
		} else {
			return toAdd;
		}
	}

	/**
	 * Recursively walk down a tree of "entry" JSON items, adding to a stack of strings to be finally rendered to the
	 * page. Note that this function does _not_ actually do the rendering, see the example code above for how to display
	 * the result.
	 *
	 * @param entry An "entry" usually defined in JSON. A schema is available in tests/schema
	 * @param textStack A reference to an array, which will hold all our strings as we recurse
	 * @param depth The current recursion depth. Optional; default 0, or -1 for type "section" entries
	 * @param prefix The (optional) prefix to be added to the textStack before whatever is added by the current call
	 * @param suffix The (optional) suffix to be added to the textStack after whatever is added by the current call
	 * @param forcePrefixSuffix force the prefix and suffix to be added (useful for the first call from external code)
	 */
	recursiveEntryRender(entry, textStack, depth, prefix, suffix, forcePrefixSuffix) {
		depth = depth === undefined || depth === null ? entry.type === "section" ? -1 : 0 : depth;
		prefix = prefix === undefined || prefix === null ? null : prefix;
		suffix = suffix === undefined || suffix === null ? null : suffix;
		forcePrefixSuffix = forcePrefixSuffix === undefined || forcePrefixSuffix === null ? false : forcePrefixSuffix;

		if (forcePrefixSuffix) renderPrefix();
		if (typeof entry === "object") {
			// the root entry (e.g. "Rage" in barbarian "classFeatures") is assumed to be of type "entries"
			const type = entry.type === undefined || entry.type === "section" ? "entries" : entry.type;
			switch (type) {
				// TODO add an "insert box" type

				// recursive
				case "entries":
					handleEntries(this);
					break;
				case "options":
					handleOptions(this);
					break;
				case "list":
					textStack.push("<ul>");
					for (let i = 0; i < entry.items.length; i++) {
						this.recursiveEntryRender(entry.items[i], textStack, depth + 1, `<li ${isNonstandardSource(entry.items[i].source) ? `class="${CLSS_NON_STANDARD_SOURCE}"` : ""}>`, "</li>");
					}
					textStack.push("</ul>");
					break;
				case "table":
					renderTable(this);
					break;
				case "invocation":
					handleInvocation(this);
					break;
				case "patron":
					handlePatron(this);
					break;

				// block
				case "abilityDc":
					renderPrefix();
					textStack.push(`<span class='spell-ability'><span>${entry.name} save DC</span> = 8 + your proficiency bonus + your ${utils_makeAttChoose(entry.attributes)}</span>`);
					renderSuffix();
					break;
				case "abilityAttackMod":
					if (prefix !== null) textStack.push(prefix);
					textStack.push(`<span class='spell-ability'><span>${entry.name} attack modifier</span> = your proficiency bonus + your ${utils_makeAttChoose(entry.attributes)}</span>`);
					if (suffix !== null) textStack.push(suffix);
					break;

				// inline
				case "inline":
					for (let i = 0; i < entry.entries.length; i++) {
						this.recursiveEntryRender(entry.entries[i], textStack, depth);
					}
					break;
				case "bonus":
					textStack.push((entry.value < 0 ? "" : "+") + entry.value);
					break;
				case "bonusSpeed":
					textStack.push((entry.value < 0 ? "" : "+") + entry.value + "ft.");
					break;
				case "dice":
					textStack.push(EntryRenderer.getEntryDice(entry));
					break;
				case "link":
					renderLink(entry);
					break;
			}
		} else if (typeof entry === "string") { // block
			renderPrefix();
			renderString(this);
			renderSuffix();
		} else { // block
			// for ints or any other types which do not require specific rendering
			renderPrefix();
			textStack.push(entry);
			renderSuffix();
		}
		if (forcePrefixSuffix) renderSuffix();

		function renderPrefix() {
			if (prefix !== null) {
				textStack.push(prefix);
			}
		}
		function renderSuffix() {
			if (suffix !== null) {
				textStack.push(suffix);
			}
		}

		function renderTable(self) {
			// TODO add handling for rowLabel property

			textStack.push("<table>");

			if (entry.caption !== undefined) {
				textStack.push(`<caption>${entry.caption}</caption>`);
			}
			textStack.push("<thead>");
			textStack.push("<tr>");

			for (let i = 0; i < entry.colLabels.length; ++i) {
				textStack.push(`<th ${getTableThClassText(i)}>${entry.colLabels[i]}</th>`);
			}

			textStack.push("</tr>");
			textStack.push("</thead>");
			textStack.push("<tbody>");

			for (let i = 0; i < entry.rows.length; ++i) {
				textStack.push("<tr>");
				for (let j = 0; j < entry.rows[i].length; ++j) {
					textStack.push(`<td ${makeTableTdClassText(j)}>`);
					self.recursiveEntryRender(entry.rows[i][j], textStack, depth + 1);
					textStack.push("</td>");
				}
				textStack.push("</tr>");
			}

			textStack.push("</tbody>");
			textStack.push("</table>");

			function getTableThClassText(i) {
				return entry.colStyles === undefined || i >= entry.colStyles.length ? "" :  `class="${entry.colStyles[i]}"`;
			}

			function makeTableTdClassText(i) {
				if (entry.rowStyles !== undefined) {
					return entry.rowStyles === undefined || i >= entry.rowStyles.length ? "" : `class="${entry.rowStyles[i]}"`;
				} else {
					return getTableThClassText(i);
				}
			}
		}


		function handleEntries(self) {
			handleEntriesOptionsInvocationPatron(self, true);
		}

		function handleOptions(self) {
			entry.entries = entry.entries.sort((a, b) => a.name && b.name ? ascSort(a.name, b.name) : a.name ? -1 : b.name ? 1 : 0);
			handleEntriesOptionsInvocationPatron(self, false);
		}

		function handleInvocation(self) {
			handleEntriesOptionsInvocationPatron(self, true);
		}

		function handlePatron(self) {
			handleEntriesOptionsInvocationPatron(self, false);
		}

		function handleEntriesOptionsInvocationPatron(self, incDepth) {
			const inlineTitle = depth >= 2;
			const nextDepth = incDepth ? depth+1 : depth;
			const styleString = getStyleString();
			const dataString = getDataString();
			const preReqText = getPreReqText();
			const headerSpan = entry.name !== undefined ? `<span class="entry-title">${entry.name}${inlineTitle ? "." : ""}</span> ` : "";

			textStack.push(`<div ${dataString} ${styleString}>${headerSpan}${preReqText}`);
			for (let i = 0; i < entry.entries.length; i++) {
				self.recursiveEntryRender(entry.entries[i], textStack, nextDepth, "<p>", "</p>");
			}
			textStack.push("</div>");

			function getStyleString() {
				const styleClasses = [];
				if (isNonstandardSource(entry.source)) styleClasses.push(CLSS_NON_STANDARD_SOURCE);
				if (inlineTitle && entry.name !== undefined) styleClasses.push(EntryRenderer.HEAD_2);
				else styleClasses.push(depth === -1 ? EntryRenderer.HEAD_NEG_1 : depth === 0 ? EntryRenderer.HEAD_0 : EntryRenderer.HEAD_1);
				if ((entry.type === "invocation" || entry.type === "patron") && entry.subclass !== undefined) styleClasses.push(CLSS_SUBCLASS_FEATURE);
				return styleClasses.length > 0 ? `class="${styleClasses.join(" ")}"` : "";
			}

			function getDataString() {
				let dataString = "";
				if (entry.type === "invocation" || entry.type === "patron") {
					const titleString = entry.source ? `title="Source: ${parse_sourceJsonToFull(entry.source)}"` : "";
					if (entry.subclass !== undefined) dataString = `${ATB_DATA_SC}="${entry.subclass.name}" ${ATB_DATA_SRC}="${entry.subclass.source}" ${titleString}`;
					else dataString = `${ATB_DATA_SC}="${EntryRenderer.DATA_NONE}" ${ATB_DATA_SRC}="${EntryRenderer.DATA_NONE}" ${titleString}`;
				}
				return dataString;
			}

			function getPreReqText() {
				if (entry.prerequisite) return `<span class="prerequisite">Prerequisite: ${entry.prerequisite}</span>`;
				return "";
			}
		}

		function renderLink(entry) {
			let href;
			if (entry.href.type === "internal") {
				href = `${entry.href.path}#`;
				if (entry.href.hash !== undefined) {
					href += encodeForHash(entry.href.hash);
					if (entry.href.subhashes !== undefined) {
						for (let i = 0; i < entry.href.subhashes.length; i++) {
							const subHash = entry.href.subhashes[i];
							href += `,${encodeForHash(subHash.key)}:${encodeForHash(subHash.value)}`
						}
					}
				}
			} else if (entry.href.type === "external") {
				href = entry.href.url;
			}
			textStack.push(`<a href='${href}' target='_blank'>${entry.text}</a>`);
		}

		function renderString(self) {
			const tagSplit = entry.split(EntryRenderer.RE_INLINE);
			if (tagSplit.length > 1) {
				for (let i = 0; i < tagSplit.length; i++) {
					const s = tagSplit[i];
					if (s === undefined || s === null || s === "") continue;
					if (s.charAt(0) === "@") {
						const [tag, text] = splitFirstSpace(s);
						const fauxEntry = {
							"type": "link",
							"href": {
								"type": "internal",
								"hash": text
							},
							"text": text
						};
						switch (tag) {
							case "@spell":
								fauxEntry.href.path = "spells.html";
								fauxEntry.href.hash = fauxEntry.href.hash += "_phb"; // TODO pass this in
								self.recursiveEntryRender(fauxEntry, textStack, depth);
								break;
							case "@item":
								fauxEntry.href.path = "items.html";
								// TODO add source
								self.recursiveEntryRender(fauxEntry, textStack, depth);
								break;
							case "@class":
								const classMatch = EntryRenderer.RE_INLINE_CLASS.exec(text);
								if (classMatch) {
									fauxEntry.href.hash = classMatch[1].trim(); // TODO pass this in
									fauxEntry.href.subhashes = [{"key": "subclass", "value": classMatch[2].trim()}]
								}
								fauxEntry.href.path = "classes.html";
								fauxEntry.href.hash = fauxEntry.href.hash += "_phb"; // TODO pass this in
								self.recursiveEntryRender(fauxEntry, textStack, depth);
								break;
							case "@creature":
								fauxEntry.href.path = "bestiary.html";
								fauxEntry.href.hash = fauxEntry.href.hash += "_mm"; // TODO pass this in
								self.recursiveEntryRender(fauxEntry, textStack, depth);
								break;
							case "@bold":
								textStack.push(`<b>${text}</b>`);
								break;
						}
					} else {
						textStack.push(s);
					}
				}
			} else {
				textStack.push(entry);
			}

			function splitFirstSpace(string) {
				return [
					string.substr(0, string.indexOf(' ')),
					string.substr(string.indexOf(' ')+1)
				]
			}
		}
	}
}
EntryRenderer.RE_INLINE = /{(@.*? .*?)}/g;
EntryRenderer.RE_INLINE_CLASS = /(.*?) \((.*?)\)/;
EntryRenderer.HEAD_NEG_1 = "statsBlockSectionHead";
EntryRenderer.HEAD_0 = "statsBlockHead";
EntryRenderer.HEAD_1 = "statsBlockSubHead";
EntryRenderer.HEAD_2 = "statsInlineHead";
EntryRenderer.DATA_NONE = "data-none";