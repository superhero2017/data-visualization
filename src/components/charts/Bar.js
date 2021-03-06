import * as d3 from 'd3'

import services from 'src/modules/services'

export default {
  name: 'bar',
  props: ['manufacturerCode','chartId', 'mediaTypeFilter', 'categoryFilter'],
  template: require('components/charts/Bar.html'),
  data () {
    return {
      model: nch.model,
      barData: {}
    }
  },

  watch: {
    model: {
      handler: function (newValue, oldValue) {
        this.barData = this.getMediaData()
        this.render()
      },
      deep: true
    }
    // services: {
    //   handler: function (newValue, oldValue) {
    //     this.barData = this.getMediaData()
    //     this.render()
    //   },
    //   deep: true
    // }
  },

  mounted () {
    console.log("Bar mounted");
    this.barData = this.getMediaData()
    this.render()
  },

  methods: {
    render() {
      console.log("Rendering Bar, ID: " + this.chartId );
      var responseData = this.barData

      var svg = d3.select('#' + this.chartId).html(''),
        margin = {top: 0, right: 40, bottom: 30, left: 40},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom

      var x = d3.scaleBand().rangeRound([20, width - 40]).padding(0.2),
        y = d3.scaleLinear().rangeRound([height, 50])

      var defs = svg.append('defs')
        var filter = defs.append('filter')
          .attr('id', 'drop-shadow')
          .attr('height', '130%')

        filter.append('feGaussianBlur')
          .attr('in', 'SourceAlpha')
          .attr('stdDeviation', 2)
          .attr('result', 'blur')

        filter.append('feOffset')
          .attr('in', 'blur')
          .attr('dx', 2)
          .attr('dy', 0)
          .attr('result', 'offsetBlur')

        var feMerge = filter.append('feMerge')

        feMerge.append('feMergeNode')
          .attr('in', 'offsetBlur')
        feMerge.append('feMergeNode')
          .attr('in', 'SourceGraphic')

      //var i = 0; // massive HACK, remove!
      //for (var i = 0; i < responseData.length; i++) {

        const g = svg.append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        var data = Object.keys(responseData.data).map(function (d) { return responseData.data[d] } )
        x.domain(data.map(function (d) {
          return d.name
        }))
        y.domain([0, d3.max(data, function (d) {
          return ((d.totalredemptionsp1 > d.totalredemptionsp2)?(d.totalredemptionsp1):(d.totalredemptionsp2))
        })]).nice()

        g.append('text')
          .attr('x', width/2)
          .attr('font-weight', 'bold')
          .style('text-anchor', 'middle')
          .attr('y', 20)
          .text(responseData.label)
          .attr('font-size', '20')
          .attr('fill', '#498fe1')

        g.append('g')
          .selectAll('g')
          .data(data)
          .enter().append('text')
          .attr('x', function (d) {
            return x.bandwidth() / 2 + x(d.name)
          })
          .attr('font-weight', 'bold')
          .style('text-anchor', 'middle')
          .attr('y', height + 20)
          .text(function (d) {
            return d.name
          })

        var axisData = y.ticks()

        g.append('g')
          .selectAll('g')
          .data(axisData)
          .enter().append('line')
          .attr('y1', function (d) {
            return y(d)
          })
          .attr('y2', function (d) {
            return y(d)
          })
          .attr('x1', 20)
          .attr('x2', width - 30 )
          .attr('stroke', 'grey')
          .style('stroke-dasharray','5, 5')

        g.append('g')
          .selectAll('g')
          .data(axisData)
          .enter().append('text')
          .attr('y', function (d) {
            return y(d) + 5
          })
          .attr('x', 10)
          .text(function (d) {
            return d
          })
          .style('text-anchor', 'end')
          .attr('fill', 'grey')

        g.append('g')
          .selectAll('g')
          .data(data)
          .enter().append('rect')
          .attr('class', 'bar bar1')
          .attr('x', function (d) {
            return x(d.name)
          })
          .attr('y', function (d) {
            return y(d.totalredemptionsp1)
          })
          .attr('width', x.bandwidth()/2)
          .attr('height', function (d) {
            return height - y(d.totalredemptionsp1) + 2
          })
          .attr('stroke', 'white')
          .attr('stroke-width', '2px')
          .style('filter', 'url(#drop-shadow)')

        g.append('g')
          .selectAll('g')
          .data(data)
          .enter().append('rect')
          .attr('class', 'bar bar2')
          .attr('x', function (d) {
            return x(d.name) + x.bandwidth()/2
          })
          .attr('y', function (d) {
            return y(d.totalredemptionsp2)
          })
          .attr('width', x.bandwidth()/2)
          .attr('height', function (d) {
            return height - y(d.totalredemptionsp2) + 2
          })
          .attr('stroke', 'white')
          .attr('stroke-width', '2px')
          .style('filter', 'url(#drop-shadow)')



        // if (this.model.selectedItem.flag == 2 && this.model.selectedItem.selectedMfrname === i) {
        //   g.selectAll('.bar1' + i)
        //     .attr('y', height)
        //     .attr('height', 1)
        //     .transition()
        //     .duration(1000)
        //     .attr('height', function (d) {
        //       return height - y(d.totalredemptionsp1) + 2
        //     })
        //     .attr('y', function (d) {
        //       return y(d.totalredemptionsp1)
        //     })
        //
        //   g.selectAll('.bar2' + i)
        //     .attr('y', height)
        //     .attr('height', 1)
        //     .transition()
        //     .duration(1000)
        //     .attr('height', function (d) {
        //       return height - y(d.totalredemptionsp2) + 2
        //     })
        //     .attr('y', function (d) {
        //       return y(d.totalredemptionsp2)
        //     })
        //
        // }

      svg.selectAll('.bar1')
        .on('mouseover', bar1mouseover)
        .on('mouseout', barmouseout)

      console.log( "setting mouse overs" );
      console.log( this.mediaTypeFilter );
      var localFilter = this.mediaTypeFilter;

      function bar1mouseover (d) {

        console.log("bar1mouseover");
        console.log(d.name);

        localFilter.mediaType = d.name;
        localFilter.period = 1;

        if (nch.model.selectedItem.selectedMedia != d.name) {
          nch.model.selectedItem.selectedMfrname = 0
          nch.model.selectedItem.selectedPeriod = 1
          nch.model.selectedItem.selectedMedia = d.name
          nch.model.selectedItem.selectedCategory = ''
          nch.model.selectedItem.selectedProductMoved = ''
          nch.model.selectedItem.selectedPrice = ''
          nch.model.selectedItem.flag = 1
        }
      }

      svg.selectAll('.bar2')
        .on('mouseover', bar2mouseover)
        .on('mouseout', barmouseout)

      function bar2mouseover (d) {

        console.log("bar2mouseover");
        console.log(d.name);

        component.mediaTypeFilter.mediaType = d.name;
        component.mediaTypeFilter.period = 2;

        if (nch.model.selectedItem.selectedMedia != d.name) {
          nch.model.selectedItem.selectedMfrname = 0
          nch.model.selectedItem.selectedPeriod = 2
          nch.model.selectedItem.selectedMedia = d.name
          nch.model.selectedItem.selectedCategory = ''
          nch.model.selectedItem.selectedProductMoved = ''
          nch.model.selectedItem.selectedPrice = ''
          nch.model.selectedItem.flag = 1
        }
      }

      // svg.selectAll('.bar11')
      //   .on('mouseover', bar11mouseover)
      //   .on('mouseout', barmouseout)
      //
      // function bar11mouseover (d) {
      //   if (nch.model.selectedItem.selectedMedia != d.name) {
      //     nch.model.selectedItem.selectedMfrname = 1
      //     nch.model.selectedItem.selectedPeriod = 1
      //     nch.model.selectedItem.selectedMedia = d.name
      //     nch.model.selectedItem.selectedCategory = ''
      //     nch.model.selectedItem.selectedProductMoved = ''
      //     nch.model.selectedItem.selectedPrice = ''
      //     nch.model.selectedItem.flag = 1
      //   }
      // }
      //
      // svg.selectAll('.bar21')
      //   .on('mouseover', bar21mouseover)
      //   .on('mouseout', barmouseout)
      // // })
      // function bar21mouseover (d) {
      //   if (nch.model.selectedItem.selectedMedia != d.name) {
      //     nch.model.selectedItem.selectedMfrname = 1
      //     nch.model.selectedItem.selectedPeriod = 2
      //     nch.model.selectedItem.selectedMedia = d.name
      //     nch.model.selectedItem.selectedCategory = ''
      //     nch.model.selectedItem.selectedProductMoved = ''
      //     nch.model.selectedItem.selectedPrice = ''
      //     nch.model.selectedItem.flag = 1
      //   }
      // }


      function barmouseout (d) {
        localFilter.mediaType = null;
        nch.model.selectedItem.selectedMedia = ''
        nch.model.selectedItem.selectedPeriod = ''
      }
    },

    getMediaData () {
      var mediaData = nch.services.dataService.getRedemptionsByMedia()

      if( this.manufacturerCode === 'ALL' ) {
        return mediaData.comparables
      }
      else {
        return mediaData.manufacturer
      }
    }
  }
}
