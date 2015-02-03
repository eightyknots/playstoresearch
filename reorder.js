var json = require('./data.json');

var misc = {
	safeRound: function(num) {
		return Math.round((num+0.00001)*100)/100;
	}
}

var ordered = {
	byDownloads: {
		asc: function() {
			json.results.sort(function(a,b) {
				var num = {
					a: parseInt(a.downloads.replace(',', '')),
					b: parseInt(b.downloads.replace(',', ''))
				};

				if (num.a > num.b) {
					return 1;
				} else if (num.a < num.b) {
					return -1;
				} else {
					if (a.title > b.title) {
						return 1;
					} else {
						return -1;
					}
				}
			});
		},
		desc: function() {
			json.results.sort(function(a,b) {
				var num = {
					a: parseInt(a.downloads.replace(',', '')),
					b: parseInt(b.downloads.replace(',', ''))
				};

				if (num.a < num.b) {
					return 1;
				} else if (num.a > num.b) {
					return -1;
				} else {
					if (a.title > b.title) {
						return 1;
					} else {
						return -1;
					}
				}
			});
		}
	},
	byRating: {
		asc: function() {
			json.results.sort(function(a,b) {
				if (misc.safeRound(a.rating) > misc.safeRound(b.rating))  {
					return 1;
				} else if (misc.safeRound(a.rating) < misc.safeRound(b.rating)) {
					return -1;
				} else {
					if (a.title > b.title) {
						return 1;
					} else {
						return -1;
					}
				}
			});
		},
		desc: function() {
			json.results.sort(function(a,b) {
				if (misc.safeRound(a.rating) > misc.safeRound(b.rating))  {
					return -1;
				} else if (misc.safeRound(a.rating) < misc.safeRound(b.rating)) {
					return 1;
				} else {
					if (a.title > b.title) {
						return 1;
					} else {
						return -1;
					}
				}
			});
		},
	},
	byLatestUpdate: {
		asc: function() {
			json.results.sort(function(a,b) {
				var dates = {
					a: new Date(a.market_update),
					b: new Date(b.market_update)
				}

				if (dates.a < dates.b) {
					return -1;
				} else {
					return 1;
				}
			});
		},
		desc: function() {
			json.results.sort(function(a,b) {
				var dates = {
					a: new Date(a.market_update),
					b: new Date(b.market_update)
				}

				if (dates.a > dates.b) {
					return -1;
				} else {
					return 1;
				}
			});
		},
	},
	byTitle: {
		asc: function() {
			json.results.sort(function(a,b) {
				if (a.title > b.title) {
					return 1;
				} else {
					return -1;
				}
			});
		},
		desc: function() {
			json.results.sort(function(a,b) {
				if (a.title < b.title) {
					return 1;
				} else {
					return -1;
				}
			});
		}
	},
	byDeveloper: {
		asc: function() {
			json.results.sort(function(a,b) {
				if (a.developer > b.developer) {
					return 1;
				} else if (a.developer < b.developer) {
					return -1;
				} else {
					if (a.title > b.title) {
						return 1;
					} else {
						return -1;
					}
				}
			});
		},
		desc: function() {
			json.results.sort(function(a,b) {
				if (a.developer < b.developer) {
					return 1;
				} else if (a.developer > b.developer) {
					return -1;
				} else {
					if (a.title > b.title) {
						return 1;
					} else {
						return -1;
					}
				}
			});
		}
	}
};

