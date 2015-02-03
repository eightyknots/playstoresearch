var Application = {
  data: [],
  currentOrderAlg: 'byTitle',
  currentOrderAD: 'asc',
  currentFilter: '',

  init: function() {
    console.log('androidsearch started...');
    var self = this;
    $.get('/data/data.json', function(response) {
      self.data = response;
      console.log(self.data.results.length + ' applications loaded...');
      self.runApplication();
      self.helpers.setStatus('success', 'Data loaded!');
    });

    // Attach search listeners
    $('#search').keyup(function() { self.searchListener(); });
    $('#sort').change(function() { self.sortListener(); });
  },

  sortListener: function() {
    var self = this;
    var sort = $('#sort').val().split('.');
    if (sort.length !== 2) {
      self.currentOrderAlg = 'byTitle',
      self.currentOrderAD = 'asc'
    } else {
      self.currentOrderAlg = sort[0];
      self.currentOrderAD = sort[1];
    }

    // Fire!
    self.runApplication();
  },

  searchListener: function() {
    var self = this;
    var search = $('#search').val();
    console.log('search listener fired: ' + search);
    self.filterApplication();
  },

  runApplication: function() {
    // Clear
    $('#results').html('');
    var self = this;
    if (undefined === self.ordering[self.currentOrderAlg][self.currentOrderAD]) {
      console.log('APP_ERROR: runApplication could not find valid sorting algorithm: ' + self.currentOrderAlg + self.currentOrderAD);
      self.helpers.setStatus('error', 'Sorting algorithm error.');
    } else {
      self.ordering[self.currentOrderAlg][self.currentOrderAD](self);
    }

    // After ordering, show it in a list!
    $.each(self.data.results, function(index, app) {
      var updateTime = new Date(app.market_update);
      $('#results').append('<div class="col-md-2 as-container" data-apk="' + app.package_name.toLowerCase() + '" data-title="' + app.title.toLowerCase() + '" data-author="' + app.developer.toLowerCase() + '">' + 
        '<div class="as-app"><div class="clearfix as-app-basic">' + 
          '<div class="as-app-img">' +
            '<a href="' + app.market_url + '" onclick="window.open(this.href);return false;">' +
              '<img src="' + app.icon + '" style="width:100%;">' +
            '</a>' +
          '</div>' +
          '<div class="as-app-title">' +
            '<a href="' + app.market_url + '" onclick="window.open(this.href);return false;">' + 
            app.title + '</a></div>' + 
          '<div class="as-app-author"><i class="fa fa-group"></i> ' + app.developer + '</div>' +
        '</div>' + 
        '<div class="as-app-info text-center clearfix">' +
          '<span class="as-app-downloads text-left"><i class="fa fa-cloud-download"></i> ' + app.downloads + '</span>' + 
        '</div><div class="as-app-info text-center clearfix">' +
          '<span class="as-app-update"><i class="fa fa-calendar"></i> ' + updateTime.toLocaleDateString('en-GB') + ' </span>' +
          '<span class="as-app-rating"><i class="fa fa-star"></i> ' + self.helpers.safeRound(app.rating) +'</span>' +
        '</div></div>');
    });

    // Filter!
    self.filterApplication();
  },

  filterApplication: function() {
    var found = this.data.results.length;
    var total = this.data.results.length;

    if ($('#search').val().length < 2) {
      $('.as-container').removeClass('hide');
    } else {
      var query = $('#search').val().toLowerCase();
      $('.as-container').each(function() {
        if ($(this).data('title').indexOf(query) === -1 && $(this).data('author').indexOf(query) === -1) {
          found--;
          $(this).addClass('hide');
        } else {
          $(this).removeClass('hide');
        }
      });
    }

    this.helpers.setStatus('muted', 'Showing ' + found + ' application' + (found === 1 ? '' : 's') + ' out of ' + total + '.');
  },

  helpers: {
    safeRound: function(num) {
      return Math.round((num+0.00001)*100)/100;
    },
    setStatus: function(type, msg) {
      $('#status').removeClass('alert-success alert-warning alert-danger alert-muted');
      if (type === 'error') {
        $('#status').addClass('alert-danger');
      } else if (type === 'success') {
        $('#status').addClass('alert-success');
      } else {
        $('#status').addClass('alert-info');
      }
      $('#status').html(msg);
    }
  },

  ordering: {
    byDownloads: {
      asc: function(self) {
        self.data.results.sort(function(a,b) {
          var num = {
            a: parseInt(a.downloads.split(' ')[0].replace(/,/g, '')),
            b: parseInt(b.downloads.split(' ')[0].replace(/,/g, ''))
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
      desc: function(self) {
        self.data.results.sort(function(a,b) {
          var num = {
            a: parseInt(a.downloads.split(' ')[0].replace(/,/g, '')),
            b: parseInt(b.downloads.split(' ')[0].replace(/,/g, ''))
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
      asc: function(self) {
        self.data.results.sort(function(a,b) {
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
      desc: function(self) {
        self.data.results.sort(function(a,b) {
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
      asc: function(self) {
        self.data.results.sort(function(a,b) {
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
      desc: function(self) {
        self.data.results.sort(function(a,b) {
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
      asc: function(self) {
        self.data.results.sort(function(a,b) {
          if (a.title > b.title) {
            return 1;
          } else {
            return -1;
          }
        });
      },
      desc: function(self) {
        self.data.results.sort(function(a,b) {
          if (a.title < b.title) {
            return 1;
          } else {
            return -1;
          }
        });
      }
    },
    byDeveloper: {
      asc: function(self) {
        self.data.results.sort(function(a,b) {
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
      desc: function(self) {
        self.data.results.sort(function(a,b) {
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
  }
};

$(document).ready(function() {
  Application.init();
  $('#search').focus();
});