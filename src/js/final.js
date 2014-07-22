var img, hammertime, pager, pagerTemplate, position, pagerData;

function getDataUrl(data) {
  return 'data:image/jpeg ;base64,' + data;
}

function renderPager() {
  var data = {
    ids: pagerData.ids.map(function (id, pos) {
      return {
        id: id,
        active: position === pos,
      };
    }),
    image: getDataUrl(pagerData.images[position].data)
  };
  pager.html(pagerTemplate(data));
}

function handleMeasurements(result) {
  pagerData = result;
  renderPager();
}

$(document).ready(function () {
  position = 0;

  img = $('#data-image');
  pager = $('#pager-container');

  var source   = $("#pager-template").html();
  pagerTemplate = Handlebars.compile(source);

  // handle the incoming data

  measurements = new ROSLIB.Service({
      ros : ros,
      name : '/ed/get_measurements',
      serviceType : 'ed/GetMeasurements'
  });

  var req = new ROSLIB.ServiceRequest({});

  measurements.callService(req, function(result) {
    handleMeasurements(result);
  });

  // catch the swipe gesture

  var final = $('#final').get(0);
  hammertime = Hammer(final, {});

  hammertime.on('swipe', function (e) {
    var direction = e.direction;

    if (direction & Hammer.DIRECTION_LEFT) {
      position = position == 0 ? 0 : position - 1;
    }
    if (direction & Hammer.DIRECTION_RIGHT) {
      var maxpos = pagerData.ids.length - 1;
      position = position >= maxpos ? maxpos : position + 1;
    }

    renderPager();
  });
});