$(document).ready(function() {
	module("Global Leaderboard with pontsFunction provided and pointsField provided in order to check for bugs", {
		setup : function() {
			this.containerId = "leaderboardContainer";

			this.data = [{
				name : "Player1",
				score : 1
			}, {
				name : "Player2",
				score : 2
			}, {
				name : "Player3",
				score : 3
			}, {
				name : "Player4",
				score : 4
			}, {
				name : "Player5",
				score : 5
			}, {
				name : "Player6",
				score : 6
			}, {
				name : "Player7",
				score : 10
			}];

			this.options = {
				title : "Testing the Leaderboar",
				width : 300,
				height : 250,
				topPlayers : 3,
				data : this.data,
				pointsField : "score",
				pointsFunction : function(item1, item2) {
					var arraysum = function(arr) {
						var sum = 0;
						for(var i = 0, len = arr.length; i < len; ++i) {
							sum += arr[i];
						}
						return sum;
					}
					var a = arraysum(item1.score), b = arraysum(item2.score);
					return (1 * ((a < b) ? -1 : (a > b) ? +1 : 0));
				},
				labelFunction : function(item/*object*/, place /*integer*/) {
					return place + ":" + item.name;
				}
			}

			// create an element for the leaderboard
			$("body").append($(document.createElement("div")).attr("id", this.containerId));
			this.leaderboard = $("#" + this.containerId).leaderboard(this.options);
		},
		teardown : function() {
			console.log("tearing down");
			$("#" + this.containerId).leaderboard("destroy");
		}
	});

	test("Testing if the title is Correct", function() {
		var value = $("#" + this.containerId + " .leaderboard-title").html();
		equal(value, this.options.title, "We expect title to be " + this.options.title);
	});
	test("Testing if the width and height are correct", function() {
		var width = $("#" + this.containerId).width(), height = $("#" + this.containerId).height();
		equal(width, this.options.width, "We expect width to be " + this.options.width);
		equal(height, this.options.height, "We expect height to be " + this.options.height);
	});
	test("Testing leaderboard when changing the width and height option dynamically", function() {
		var newWidthValue = 550, newHeightValue = 550;

		this.leaderboard.leaderboard("option", "width", newWidthValue);
		this.leaderboard.leaderboard("option", "height", newHeightValue);
		var currentWidth = $("#" + this.containerId).width(), currentHeight = $("#" + this.containerId).height();
		equal(currentWidth, newWidthValue, "We expect width to be " + currentWidth);
		equal(currentHeight, newHeightValue, "We expect height to be " + currentHeight);
	});
	test("Testing if displaying correctly top players count", function() {
		var displayedElementsCount = $("#" + this.containerId).children(".leaderboard-ranklist").children().length;
		equal(displayedElementsCount, this.options.topPlayers, "We expected displayed rankings to be " + this.options.topPlayers)
	});
	test("Testing if ranklist items are displayed in correct order", function() {
		var displayedElements = $("#" + this.containerId).children(".leaderboard-ranklist").children();
		var sortedData = this.data.sort(this.options.pointsFunction);
		for(var i = 0, len = displayedElements.length; i < len; ++i) {
			var item = $(displayedElements[i]).html();
			equal(item, this.options.labelFunction(sortedData[i], i + 1), "Item with rank " + (i + 1) + " should be equal to " + item);
		}
	});
});
