// ideas :
// add crown icon for #1

// todo tommorow : create a class field for all CSS classes
/**
 * @author GameCraft | RadoRado | http://game-craft.com/
 * @version 0.1
 * jQuery UI widget for displaying a leaderboard with names and points
 * Based on jQuery UI methods : _create, _setOption, destroy
 * Initialization method is _create
 * The following options can be provided to the constructor
 * @param {string} title - The title of the leaderboard
 * @param {array} data - Array of objects that is being displayed on the leaderboard. displayField, labelFunction, pointsField and pointsFunction are cruicial for the component to work
 * @param {string} defaultDisplayField - The default field that is used in the labelFunction if non provided. It's a good practice to provide your own labelFunction
 * @param {function} labelFunction - this is a callback, that is used to create the label for each item in the ranklist. Has default value which uses the defaultDisplayField.
 * The function should take two arguments - the item and the current place in the raking. i.e  function(item, place) {return place + " : " + item.name}
 * @param {string} labelPlacement - should be center, left or right - this value is used for the text-align css property for each row of the ranklist
 * @param {string} pointsField - If provided, it will sort the data array by this field in descending order. If the pointsFunction is provided, this field is ignored
 * @param {function} pointsFunction - A sorting function that is used to sort the data array. The functions takes two arguments - the items to be compared.
 * if we have function(item1, item2), the function should return -1 if item1 < item2, 0 if item1 === item2 and 1 if item1 > item2
 * @param {integer} topPlayers - The number of displayed players in the ranklist. if localTo is provided (Local Leaderboard), this field is ignored. If negative value is provided, it is turned into positive.
 * @param {object} localTo
 * @param {integer} width - The width of the leaderboard component. Default value is 500. If negative value is provided, it is turned into positive
 * @param {integer} height - The heightt of the leaderboard component.Default value is 300. If negative value is provided, it is turned into positive
 */
(function($) {
	$.widget("ui.leaderboard", {
		options : {
			title : "Default Leaderboard Title",
			data : [],
			defaultDisplayField : "label",
			labelPlacement : "center",
			labelFunction : function(item/*object*/, place /*integer*/) {
				return "#" + place + ": " + item[this.defaultDisplayField] + " : " + item[this.pointsField] + "<br />";
			},
			pointsField : "points",
			pointsFunction : null,
			topPlayers : 10,
			localTo : {
				uniqueField : null,
				fieldValue : null,
				filterFunction : function(constantItem, item) {
					return true;
				},
				interval : -1,
				paint : false
			},
			width : 500,
			height : 300
		},
		/**
		 * Called by jQuery when the component is created
		 */
		_create : function() {
			var self = this, o = self.options, el = self.element, _sortFunction = o.pointsFunction;
			if(_sortFunction === null) {
				// we have points field provided
				_sortFunction = self._helper.sortBy(o.pointsField, true);
			}

			var _sortedData = o.data.sort(_sortFunction);

			// trigger event and pass the sorted data
			self._trigger("data_sorted", null, _sortedData);

			self._sortedData = _sortedData;
			self._render(self, o, el);
		},
		_setOption : function(option, value) {
			var self = this;
			$.Widget.prototype._setOption.apply(self, arguments);

			if(option === "localTo") {
				self._setupDataForRender(self, self.options);
				self._renderRanklist(self, self.options);
				return;
			}

			if(option === "width") {
				value = Math.abs(value);
				$(self.element).css({
					width : self._helper.pixels(value)
				})
				return;
			}

			if(option === "height") {
				value = Math.abs(value);
				$(self.element).css({
					height : self._helper.pixels(value)
				})
				var calculatedHeight = value - self._helper.headerElement.height();
				self._helper.ranklistElement.css({
					height : calculatedHeight
				})
				return;
			}
		},
		_render : function(self, options, element) {
			$(element).css({
				width : self._helper.pixels(Math.abs(options.width)),
				height : self._helper.pixels(Math.abs(options.height)),
				overflow : "hidden"
			}).addClass("ui-widget").addClass(self._helper.cssStyleClasses.leaderboard_body);

			/**
			 * Render the header where the title is put
			 */
			var header = $(document.createElement("div")).append(options.title).addClass(self._helper.cssStyleClasses.leaderboard_title);
			$(element).append(header);

			if( typeof self._sortedData === "undefined" || self._sortedData.length === 0) {
				return;
			}

			var ranking = $(document.createElement("div")).css({
				overflow : "scroll",
				width : "100%",
				height : self._helper.pixels(options.height - $(header).height()),
			}).addClass(self._helper.cssStyleClasses.leaderboard_ranklist);
			$(element).append(ranking);

			self._helper.ranklistElement = $(ranking);
			self._helper.headerElement = $(header);

			self._setupDataForRender(self, options);
			self._renderRanklist(self, options);
		},
		_setupDataForRender : function(self, options) {
			var local = options.localTo, startIndex = self._startIndex, endIndex = self._sortedData.length, foundItemIndex = self._foundItemIndex, localFlag = self._localFlag;

			// array indexes
			var j, i, len;
			if(local.uniqueField !== null && local.fieldValue !== null && local.interval > 0) {
				localFlag = true;
				for( j = 0, len = self._sortedData.length; j < len; ++j) {
					if(self._sortedData[j][local.uniqueField] === local.fieldValue) {
						foundItemIndex = j;
						startIndex = j - local.interval;
						startIndex = startIndex <= 0 ? 0 : startIndex;
						endIndex = j + 1 + local.interval;
						endIndex = endIndex >= len ? len : endIndex;
						break;
					}
				}

				if( typeof local.filterFunction !== "undefined") {
					for( i = 0, len = self._sortedData.length; i != foundItemIndex && i < len; ++i) {
						if(local.filterFunction(self._sortedData[foundItemIndex], self._sortedData[i])) {
							self._filteredData.push(self._sortedData[foundItemIndex]);
						}
					}
				}
			} // end of local if

			self._startIndex = startIndex;
			self._endIndex = endIndex;
			self._localFlag = localFlag;
			self._foundItemIndex = foundItemIndex;
			console.log(startIndex, endIndex);

			if(local.filterFunction !== null) {
				// we have filtering function O_O
				var foundItem = self._sortedData[foundItemIndex];

			} else {

			}
		},
		_renderRanklist : function(self, options) {
			var startIndex = self._startIndex, endIndex = self._endIndex, localFlag = self._localFlag, foundItemIndex = self._foundItemIndex, $element = self._helper.ranklistElement;
			$element.html("");
			options.topPlayers = Math.abs(options.topPlayers);

			for(var i = startIndex, top = options.topPlayers; i < endIndex; ++i) {
				if(localFlag === false && i >= top) {
					break;
				}
				var place = i + 1;
				var row = $(document.createElement("div")).css({
					"width" : "100%",
					"text-align" : options.labelPlacement
				}).append(options.labelFunction(self._sortedData[i], place)).addClass(self._helper.cssStyleClasses.leaderboard_ranklist_item);

				// attach click handler to each rank element
				$(row).bind("click", {
					context : self,
					item : self._sortedData[i],
					selectedIndex : i,
					place : place
				}, function(event) {
					var widget = event.data.context, itemWrapper = {
						item : event.data.item,
						selectedIndex : event.data.selectedIndex,
						place : event.data.place
					};
					widget._trigger("rankitem_click", null, itemWrapper);
				});

				$element.append(row);

				if(localFlag === true && i === foundItemIndex) {
					$(row).addClass(self._helper.cssStyleClasses.leaderboard_item_local_paint);
				}

				// not the best solution so far
				$(row).hover(function() {
					$(this).addClass(self._helper.cssStyleClasses.rank_item_hover);
				}, function() {
					$(this).removeClass(self._helper.cssStyleClasses.rank_item_hover);
				});
			}
		},
		destroy : function() {
			this.element.remove();
		},
		_sortedData : [],
		_filteredData : []/*used when filterFunction is given for the local leaderboard*/,
		_startIndex : 0,
		_endIndex : 0,
		_localFlag : false,
		_foundItemIndex : -1,
		_helper : {
			pixels : function(value) {
				return value + "px";
			},
			sortBy : function(field, reverse, primer) {
				// beauty !
				reverse = [1,-1][+!!reverse];
				primer = primer ||
				function(x) {
					return x
				};

				return function(a, b) {
					a = primer(a[field]);
					b = primer(b[field]);

					return (reverse * ((a < b) ? -1 : (a > b) ? +1 : 0));
				}
			},
			ranklistElement : null,
			headerElement : null,
			cssStyleClasses : {
				rank_item_hover : "rank-item-hover",
				leaderboard_item_local_paint : "leaderboard-item-local-paint",
				leaderboard_ranklist_item : "leaderboard-ranklist-item",
				leaderboard_ranklist : "leaderboard-ranklist",
				leaderboard_title : "leaderboard-title",
				leaderboard_body : "leaderboard-body"
			}
		}
	})
})(jQuery);
