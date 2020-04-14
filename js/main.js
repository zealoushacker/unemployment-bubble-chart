var stateInfoTip = d3.tip()
  .attr('class', 'd3-tip b-r-6')
  .offset([0, 0])
  .direction(function(d) {
    states = ["Washington", "Oregon","Idaho", "Montana", "North Dakota", "Minnesota", "Wisconsin", "Michigan", "New Hampshire", "Maine", "Vermont"]
    if (states.includes(d.properties.STATE)) {
      return "s";
    } else {
      return "n"
    }
  })
  .html(function(d) {
    return '<div class="has-text-weight-bold m-b-2">' + d.properties.STATE + '</div>' +
      '<div class="has-text-danger m-b-1 is-size-7">' + getNumberOfClaimsForState(d.properties.STATE).toLocaleString() + '</div>' +
      '<div class="has-text-danger is-size-7">Unemployed</div>';
});


var showPersonModal = function(d) { 
  d3.select('#person-modal')
    .selectAll('div')
    .remove();

  d3.select('#person-modal')
    .datum(d.fields)
    .html(function(person) {
      photo_url = "https://res.cloudinary.com/hireclub/image/fetch/w_400,h_300,c_fill,g_face,f_auto/" + person.photo[0].url
      
      return '<div class="card has-background-black b-r-8">' +
          '<div class="card-image">' +
            '<figure class="image is-4by3">' +
              '<img src="' + photo_url + '" alt="Placeholder image" style="object-fit: cover">' +
            '</figure>' +
          '</div>' +
          '<div class="card-content p-3">' +
            '<p class="title is-size-6 has-text-white m-b-2">' + person.name + '</p>' +
            '<p class="is-size-7 has-text-grey-light">' +
              person.title +
              '<br>' +
              person.company +
              '<br>' +
              person.locations[0] +
            '</p>' +
            '<p class="is-size-7 m-t-2 has-text-grey-light">' +
              person.bio +
            '</p>' +
            '<p class="is-size-7 m-t-3 has-text-grey-light">' +
              '<a href="mailto:' + person.email + '" alt="Email" class="m-r-2"><img src=""/><i class="mdi mdi-email"></i></a>' +
              '<a href="' + person.resume[0].url + '" alt="Resume" class="m-r-2"><img src=""/><i class="mdi mdi-file-document"></i></a>' +
              '<a href="' + person.linkedin_url + '" alt="LinkedIn"><img src=""/><img src=""/><i class="mdi mdi-linkedin"></i></a>' +
            '</p>' +
            '<p class="m-t-4">' +
              '<a href="javascript:showListModal(\'' + person.locations[0] + '\')" class="button is-link is-size-8 is-padded has-text-weight-bold">View More People</a>' +
              '<a href="javascript:hidePersonModal()" class="button is-black is-size-8 is-padded has-text-weight-bold m-l-2"><i class="mdi mdi-close-circle mdi-18px"></i></a>' +
            '</p>' +
          '</div>' +
        '</div>';
    });
  d3.select('#person-modal').attr('style', 'display: block');
};

var hidePersonModal = function() {
  d3.select('#person-modal').attr('style', 'display: none');
};

var hideListModal = function() {
  d3.select('#list-modal').attr('style', 'display: none');
};

var showListModal = function(location) {
  d3.select('#list-modal')
    .selectAll('div')
    .remove();

  d3.select('#list-modal')
    .datum(location)
    .insert('div')
    .html(function(d) {
      return '<p class="title is-size-6 has-text-white m-b-3">' + location + 
        '<a href="javascript:hideListModal()" class="m-l-3 has-text-white"><i class="mdi mdi-close-circle mdi-18px"></i></a>' +
      '</p>'
    });

  d3.select('#list-modal')
    .selectAll('div')
    .data(_mostRecentLayoffsByLocation.records.filter(function(r) { return r.fields.locations[0] == location; }))
    .enter()
    .insert('div')
    .html(function(d) { 
      return '<div class="card has-background-black b-r-8">' +
          '<div class="card-content p-4">' +
            '<article class="media">' +
              '<figure class="media-left">' +
                '<p class="image is-48x48">' +
                  '<img src="' + 
                  "https://res.cloudinary.com/hireclub/image/fetch/w_100,h_100,c_fill,g_face,f_auto/" + d.fields.photo[0].url + 
                  '" class="is-rounded">' +
                '</p>' +
              '</figure>' +
              '<div class="media-content">' +
                '<div class="content">' +
                  '<p class="is-size-7 has-text-white has-text-weight-bold m-b-1">' +
                    d.fields.name +
                  '</p>' +
                  '<p class="is-size-8 has-text-grey-light" style="height: 1.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' +
                    d.fields.title +
                  '</p>' +
                '</div>' +
              '</div>' +
            '</article>' +
          '</div>' +
        '</div>';
    })
    .on('click', function(d) { showPersonModal(d); });
  d3.select('#list-modal').attr('style', 'display: block');
};

var getColorForNumberOfClaims = function(stateName) {
  var stateClaims = getNumberOfClaimsForState(stateName); 
  if (!stateClaims) {
    return '#ccc';
  } else {
    return _claimsColorScale(stateClaims);
  }
};

var getNumberOfClaimsForState = function(stateName) {
  return _stateClaims[stateName]; 
};

var _claimsColorScale;

var _states, _claims, _stateClaims = {}, _mostRecentLayoffsByLocation;

var drawMostRecentLayoffsByLocation = function(layoffs) {
  var circleGroup = svg.selectAll('circle')
    .data(layoffs.records)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return 'translate('+ projection([d.fields.lon[0], d.fields.lat[0]])+')';
                })
    .attr('class', 'city');

  circleGroup
    .append('circle')
    .attr('r', 5)
    .on('click', function(d, i) { 
      showPersonModal(d); 
    });
};

var dataReady = function(error, states, claims, layoffs) {
  if (error) throw error;
  _states = states;
  _claims = claims;
  _mostRecentLayoffsByLocation = layoffs;

  var minClaims = claims.records[claims.records.length - 1].fields.claims;
  var maxClaims = claims.records[0].fields.claims;

  _claimsColorScale = d3.scaleQuantize()
    .domain([minClaims, maxClaims])
    .range(['#280406', '#840e15', '#b3121c', '#d11621', '#e8212d']);


  // build up the state claim numbers dictionary for easy retrieval later
  _claims.records.forEach(function(claim) {
    _stateClaims[claim.fields.state] = claim.fields.claims;
  });

  renderMap(_states, _claims);
  drawMostRecentLayoffsByLocation(layoffs);
}

var renderMap = function(states, claims) {
  svg.selectAll('*').remove(); // clear for re-render
  
  svg.selectAll('.states')
    .data(topojson.feature(states, states.objects.states).features)
    .enter()
    .append('path')
    .attr('class', 'state')
    .style('fill', function (st) { 
      return getColorForNumberOfClaims(st.properties.STATE) 
    })
    .attr('d', path)
    .on('mouseover', stateInfoTip.show)
    .on('mouseout', stateInfoTip.hide)
    .on('click', hidePersonModal);
}

var svg = d3.select('#container').append('svg')
  .attr('xmlns', 'http://www.w3.org/2000/svg')
  .attr('version', '1.1')
  .attr('viewBox', '0 0 900 500')
  .attr('preserveAspectRatio', 'xMidYMid meet')
  .classed('svg-content', true);

svg.call(stateInfoTip);
var projection = d3.geoAlbersUsa();
var path = d3.geoPath().projection(projection);

var claimsRequest = d3.json('https://api.airtable.com/v0/appQWZIOAEl6UiPa3/ui_claims?view=Grid%20view')
  .header('Authorization', 'Bearer keyLVEYQelX6aEgaR');

var mostRecentLayoffsByLocationRequest = d3.json('https://api.airtable.com/v0/appQWZIOAEl6UiPa3/people?view=map_view')
  .header('Authorization', 'Bearer keyLVEYQelX6aEgaR');

d3.queue()
  .defer(d3.json, 'data/us-states-simplified.json')
  .defer(claimsRequest.get)
  .defer(mostRecentLayoffsByLocationRequest.get)
  .await(dataReady);

