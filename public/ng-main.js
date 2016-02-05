/*
This demo visualises wine and cheese pairings.
*/

$(function(){

  var layoutPadding = 50;
  var layoutDuration = 500;

  var graphP = loadGraphData();
  var styleP = loadStyleData();
  var infoTemplate = getInfoHandleTemplate();
/*
  var infoTemplate = Handlebars.compile([
    //'<p class="ac-node-type"><i class="fa fa-info-circle"></i> {{toJson this}} </p>'
    '{{toJson this}}'
  ].join(''));
*/  
  // when both graph export json and style loaded, init cy
  Promise.all([ graphP, styleP ]).then(initCy);
//  initCy();


function initCy( then ){
  var loading = document.getElementById('loading');
  var expJson = then[0];
  var styleJson = then[1];
  var elements = expJson.elements;

  elements.nodes.forEach(function(n){
    var data = n.data;
    
    data.NodeTypeFormatted = data.NodeType;
    
    if( data.NodeTypeFormatted === 'RedWine' ){
    data.NodeTypeFormatted = 'Red Wine';
    } else if( data.NodeTypeFormatted === 'WhiteWine' ){
    data.NodeTypeFormatted = 'White Wine';
    }
    
    n.data.orgPos = {
    x: n.position.x,
    y: n.position.y
    };
  });

  loading.classList.add('loaded');

  cy = window.cy = cytoscape({
    container: document.getElementById('cy'),
    layout: { name: 'preset', padding: layoutPadding },
    style: styleJson,
    elements: elements,
    motionBlur: true,
    selectionType: 'single',
    boxSelectionEnabled: false,
    autoungrabify: true
  });

  cy.on('free', 'node', function( e ){
    var n = e.cyTarget;
    var p = n.position();
    
    n.data('orgPos', {
    x: p.x,
    y: p.y
    });
  });

  cy.on('tap', function(){
    $('#search').blur();
  });

  cy.on('select', 'node', function(e){
    var node = this;

    highlight( node );
    showNodeInfo( node );
  });

  cy.on('unselect', 'node', function(e){
    var node = this;

    clear();
    hideNodeInfo();
  });

} // end of initCy

<!-- insert menu.js here -->
/*

  $('#search').typeahead({
    minLength: 2,
    highlight: true,
  },
  {
    name: 'search-dataset',
    source: function( query, cb ){
      function matches( str, q ){
        str = (str || '').toLowerCase();
        q = (q || '').toLowerCase();
        
        return str.match( q );
      }
      
      var fields = ['name', 'NodeType', 'Country', 'Type', 'Milk'];
      
      function anyFieldMatches( n ){
        for( var i = 0; i < fields.length; i++ ){
          var f = fields[i];
          
          if( matches( n.data(f), query ) ){
            return true;
          }
        }
        
        return false;
      }
      
      function getData(n){
        var data = n.data();
        
        return data;
      }
      
      function sortByName(n1, n2){
        if( n1.data('name') < n2.data('name') ){
          return -1;
        } else if( n1.data('name') > n2.data('name') ){
          return 1;
        }
        
        return 0;
      }
      
      var res = cy.nodes().stdFilter( anyFieldMatches ).sort( sortByName ).map( getData );
      
      cb( res );
    },
    templates: {
      suggestion: infoTemplate
    }
  }).on('typeahead:selected', function(e, entry, dataset){
    var n = cy.getElementById(entry.id);
    
    n.select();
    showNodeInfo( n );
  });
  
  $('#neighbour').on('click', function(){
    var eles = cy.$(':selected');
    if( !eles.empty()) {
      alert(eles.size());
    }
    else {
      alert('Please select a node');
    }
  });
  
  $('#reset').on('click', function(){
    cy.animate({
      fit: {
        eles: cy.elements(),
        padding: layoutPadding
      },
      duration: layoutDuration
    });
  });
  
  $('#filters').on('click', 'input', function(){
    
    var soft = $('#soft').is(':checked');
    var semiSoft = $('#semi-soft').is(':checked');
    var na = $('#na').is(':checked');
    var semiHard = $('#semi-hard').is(':checked');
    var hard = $('#hard').is(':checked');
    
    var red = $('#red').is(':checked');
    var white = $('#white').is(':checked');
    var cider = $('#cider').is(':checked');
    
    cy.batch(function(){
      
      cy.nodes().forEach(function( n ){
        var type = n.data('NodeType');
        
        n.removeClass('filtered');
        
        var filter = function(){
          n.addClass('filtered');
        };
        
        if( type === 'Cheese' ){
          
          var cType = n.data('Type');
          
          if( 
               (cType === 'Soft' && !soft)
            || (cType === 'Semi-soft' && !semiSoft)
            || (cType === undefined && !na)
            || (cType === 'Semi-hard' && !semiHard)
            || (cType === 'Hard' && !hard)
          ){
            filter();
          }
          
        } else if( type === 'RedWine' ){
          
          if( !red ){ filter(); }
          
        } else if( type === 'WhiteWine' ){
          
          if( !white ){ filter(); }
          
        } else if( type === 'Cider' ){
          
          if( !cider ){ filter(); }
          
        }
        
      });
      
    });
    
  });
  
  $('#filter').qtip({
    position: {
      my: 'top center',
      at: 'bottom center'
    },
    
    show: {
      event: 'click'
    },
    
    hide: {
      event: 'unfocus'
    },
    
    style: {
      classes: 'qtip-bootstrap',
      tip: {
        width: 16,
        height: 8
      }
    },

    content: $('#filters')
  });

  $('#config-toggle').on('click', function(){
    $('body').toggleClass('config-closed');

    cy.resize();
  });
*/
});