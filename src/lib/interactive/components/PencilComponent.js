import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { pairs } from 'd3-array'
import { path as d3Path } from 'd3-path'

import GenericChartComponent from '../../GenericChartComponent'
import { getMouseCanvas } from '../../GenericComponent'
import { generateLine, isHovering2 } from './StraightLine'

import {
  isDefined, isNotDefined,
  noop, hexToRGBA
} from '../../utils'

import _ from 'lodash'
import * as d3 from 'd3'

import { testDataCurve } from './test-data-curve'
import * as utils from '../../../utils'

const log = require('ololog').configure({locate: false})

class PencilComponent extends Component {
  constructor (props) {
    super(props)

    this.renderSVG = this.renderSVG.bind(this)
    this.isHover = this.isHover.bind(this)

  }

  isHover (moreProps) {

    const {tolerance, onHover} = this.props
    const {mouseXY} = moreProps
    const [mouseX, mouseY] = mouseXY

    let hovering = false

    if (isDefined(onHover)) {

      const lines = helper(this.props, moreProps)

      const paths = line_helper(this.props, moreProps)

      for (let i = 0; i < lines.length; i++) {
        const line1 = lines[i]

        const left = Math.min(line1.x1, line1.x2)
        const right = Math.max(line1.x1, line1.x2)
        const top = Math.min(line1.y1, line1.y2)
        const bottom = Math.max(line1.y1, line1.y2)

        const isWithinLineBounds = mouseX >= left && mouseX <= right
          && mouseY >= top && mouseY <= bottom

        hovering = isWithinLineBounds
          && isHovering2(
            [line1.x1, line1.y1],
            [line1.x2, line1.y2],
            mouseXY,
            tolerance)

        if (hovering) break
      }
    }
    return hovering
  }

	renderSVG(moreProps) {

    const { stroke, strokeWidth, fillOpacity, fill, strokeOpacity } = this.props

		const lines = helper(this.props, moreProps)

    // log.cyan(`renderSVG() -----------> lines`)
    // console.log(lines)
    // log.cyan(`renderSVG() -----------> lines`)

    const pairsOfLines = pairs(lines)

		const paths = pairsOfLines.map(([line1, line2], idx) => {

		  const ctx = d3Path()

      ctx.moveTo(line1.x1, line1.y1)

      ctx.lineTo(line1.x2, line1.y2)
      ctx.lineTo(line2.x2, line2.y2)

      ctx.closePath()

      let d = ctx.toString()

      return (
        <path key={idx}
              stroke={'black'}
              fill={fill[idx]}
              fillOpacity={fillOpacity}
              d={d}/>
      )
    })

		return (


			<g>

        {paths}

			</g>
		)
	}

	render() {

		const { selected, interactiveCursorClass } = this.props
		const { onDragStart, onDrag, onDragComplete, onHover, onUnHover } = this.props

		return <GenericChartComponent isHover={this.isHover}
                                  svgDraw={this.renderSVG}
                                  canvasToDraw={getMouseCanvas}
                                  // canvasDraw={this.drawOnCanvas}
                                  interactiveCursorClass={interactiveCursorClass}
                                  selected={selected}
                                  onDragStart={onDragStart}
                                  onDrag={onDrag}
                                  onDragComplete={onDragComplete}
                                  onHover={onHover}
                                  onUnHover={onUnHover}
                                  drawOn={['mousemove', 'mouseleave', 'pan', 'drag']} />
	}
}

function getLineCoordinates (start, endX, endY, text) {
  const end = [
    endX,
    endY
  ]
  return {
    start, end, text
  }
}

function line_helper (props, moreProps) {

  const {startXY, endXY} = props

  const {
    xScale,
    chartConfig: {yScale}
  } = moreProps
  if (isNotDefined(startXY) || isNotDefined(endXY)) {
    return []
  }
  const [x1, y1] = startXY
  const [x2, y2] = endXY

  const dx = x2 - x1
  const dy = y2 - y1

  /**
   *
   * D3 Curve Shit!!!
   * D3 Curve Shit!!!
   * D3 Curve Shit!!!
   *
   * */

  let parseTime = d3.timeParse('%d-%b-%y')

  let margin = {top: 20, right: 150, bottom: 30, left: 50}
  let width = 1440 - margin.left - margin.right
  let height = 900 - margin.top - margin.bottom

  let curveArray = [
    // {'d3Curve': d3.curveLinear, 'curveTitle': 'curveLinear'},
    // {'d3Curve': d3.curveStep, 'curveTitle': 'curveStep'},
    // {'d3Curve': d3.curveStepBefore, 'curveTitle': 'curveStepBefore'},
    // {'d3Curve': d3.curveStepAfter, 'curveTitle': 'curveStepAfter'},
    // {'d3Curve': d3.curveBasis, 'curveTitle': 'curveBasis'},
    // {'d3Curve': d3.curveCardinal, 'curveTitle': 'curveCardinal'},
    {'d3Curve': d3.curveMonotoneX, 'curveTitle': 'curveMonotoneX'},
    // {'d3Curve': d3.curveCatmullRom, 'curveTitle': 'curveCatmullRom'}
  ]

  let x = d3.scaleTime().range([0, width])
  let y = d3.scaleLinear().range([height, 0])

  let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


  let test_data = new Promise(async function (resolve) {
    resolve(await testDataCurve())
  })

  test_data.then(function (data) {

    data.forEach(function (d) {

      d.date = new Date(d.date)
      d.close = +d.close

    })

    // console.log(data[0])

    let color = d3.scaleOrdinal(d3.schemeCategory10)

    curveArray.forEach(function (daCurve, i) {

      // Scale the range of the data
      x.domain(d3.extent(data, function (d) { return d.date }))
      y.domain(d3.extent(data, function (d) { return d.close }))

      let d = d3.line()
        .curve(daCurve.d3Curve)
        .x(function (d) {
          return x(d.date)
        })
        .y(function (d) {
          return y(d.close)
        })

      console.log(d)

      // Add the paths with different curves.
      svg.append('path')
        .datum(data)
        .attr('class', 'line dpath')
        .style('stroke', function () { // Add the colours dynamically
          return daCurve.color = color(daCurve.curveTitle)
        })
        .attr('id', 'tag' + i) // assign ID
        .attr('d', d)

      // Add the Legend
      svg.append('text')
        .attr('x', width + 5)  // space legend
        .attr('y', margin.top + 20 + (i * 20))
        .attr('class', 'legend')    // style the legend
        .style('fill', function () { // Add the colours dynamically
          return daCurve.color = color(daCurve.curveTitle)
        })
        .on('click', function () {

          // Determine if current line is visible
          let active = !daCurve.active

          let newOpacity = active ? 0 : 1
          // Hide or show the elements based on the ID

          d3.select('#tag' + i)
            .transition().duration(100)
            .style('opacity', newOpacity)

          // Update whether or not the elements are active
          daCurve.active = active

        })
        .text(daCurve.curveTitle)

      // Add the scatter plot
      svg.selectAll('dot')
        .data(data)
        .enter().append('circle')
        .attr('r', 4)
        .attr('cx', function (d) {
          return x(d.date)
        })
        .attr('cy', function (d) {
          return y(d.close)
        })

      // Add the X Axis
      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))

      // Add the Y Axis
      svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y))

    })

  })

}

function helper (props, moreProps) {

  const {startXY, endXY} = props

  const {
    xScale,
    chartConfig: {yScale}
  } = moreProps
  if (isNotDefined(startXY) || isNotDefined(endXY)) {
    return []
  }
  const [x1, y1] = startXY
  const [x2, y2] = endXY

  const dx = x2 - x1
  const dy = y2 - y1

  if (dx !== 0 && dy !== 0) {
    // console.log('modLine ->', startXY, modLine, dx1, dy1)
    const halfY = getLineCoordinates(
      startXY,
      x2,
      y1 + dy / 2,
      '2/1'
    )
    const oneThirdY = getLineCoordinates(
      startXY,
      x2,
      y1 + dy / 3,
      '3/1'
    )
    const oneFourthY = getLineCoordinates(
      startXY,
      x2,
      y1 + dy / 4,
      '4/1'
    )
    const oneEighthY = getLineCoordinates(
      startXY,
      x2,
      y1 + dy / 8,
      '8/1'
    )
    const halfX = getLineCoordinates(
      startXY,
      x1 + dx / 2,
      y2,
      '1/2'
    )
    const oneThirdX = getLineCoordinates(
      startXY,
      x1 + dx / 3,
      y2,
      '1/3'
    )
    const oneFourthX = getLineCoordinates(
      startXY,
      x1 + dx / 4,
      y2,
      '1/4'
    )
    const oneEighthX = getLineCoordinates(
      startXY,
      x1 + dx / 8,
      y2,
      '1/8'
    )

    const lines = [
      oneEighthX,
      oneFourthX,
      oneThirdX,
      halfX,
      {start: startXY, end: endXY, text: '1/1'},
      halfY,
      oneThirdY,
      oneFourthY,
      oneEighthY
    ]

    return lines.map(function (line) {

      const {x1, y1, x2, y2} = generateLine({
        type: 'RAY',
        start: line.start,
        end: line.end,
        xScale,
        yScale
      })

      return {
        x1: xScale(x1),
        y1: yScale(y1),
        x2: xScale(x2),
        y2: yScale(y2),
        label: {
          x: xScale(line.end[0]),
          y: yScale(line.end[1]),
          text: line.text
        }
      }

    })


  }
  return []
}

PencilComponent.propTypes = {
  interactiveCursorClass: PropTypes.string,
  stroke: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  fill: PropTypes.arrayOf(PropTypes.string).isRequired,
  strokeOpacity: PropTypes.number.isRequired,
  fillOpacity: PropTypes.number.isRequired,

  fontFamily: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
  fontFill: PropTypes.string.isRequired,

  onDragStart: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDragComplete: PropTypes.func.isRequired,
  onHover: PropTypes.func,
  onUnHover: PropTypes.func,

  defaultClassName: PropTypes.string,

  tolerance: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired
}

PencilComponent.defaultProps = {
  onDragStart: noop,
  onDrag: noop,
  onDragComplete: noop,

  strokeWidth: 10,
  tolerance: 4,
  selected: false
}

export default PencilComponent
