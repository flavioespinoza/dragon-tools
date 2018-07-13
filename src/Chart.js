
import React from 'react'
import PropTypes from 'prop-types'

import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import { ChartCanvas, Chart } from 'react-stockcharts'
import {
  CandlestickSeries,
} from 'react-stockcharts/lib/series'
import { XAxis, YAxis } from 'react-stockcharts/lib/axes'
import {
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateY,
  MouseCoordinateX,
} from 'react-stockcharts/lib/coordinates'

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
import {
  OHLCTooltip,
} from 'react-stockcharts/lib/tooltip'
import { fitWidth } from 'react-stockcharts/lib/helper'
import { DrawingObjectSelector } from 'react-stockcharts/lib/interactive'

import GannFan from './lib/interactive/GannFan'

import { last, toObject } from 'react-stockcharts/lib/utils'
import {
  saveInteractiveNodes,
  getInteractiveNodes,
} from './interactiveutils'

import { ClickCallback } from './lib/interactive'
import MouseLocationIndicator from './lib/interactive/components/MouseLocationIndicator'

import _ from 'lodash'
import * as utils from './utils'
import * as d3 from 'd3'

import { drag } from 'd3-drag'
import { isDefined, isNotDefined } from './lib/utils'

const log = require('ololog').configure({locate: false})

class CandleStickChartWithGannFan extends React.Component {
  constructor(props) {
    super(props)
    this.onKeyPress = this.onKeyPress.bind(this)
    this.saveInteractiveNode = this.saveInteractiveNode.bind(this)
    this.saveCanvasNode = this.saveCanvasNode.bind(this)

    this.handleSelection = this.handleSelection.bind(this)

    this.svg = this.svg.bind(this)
    this.drawPath = this.drawPath.bind(this)

    this.handleStart = this.handleStart.bind(this)
    this.handleEnd = this.handleEnd.bind(this)
    this.handleDrawLine = this.handleDrawLine.bind(this)

    this.onStart = this.onStart.bind(this)
    this.onDrawComplete = this.onDrawComplete.bind(this)

    this.saveInteractiveNodes = saveInteractiveNodes.bind(this)
    this.getInteractiveNodes = getInteractiveNodes.bind(this)

    this.state = {
      enableInteractiveObject: true,
      fans: [],
      chartHeight: 1200,
      svg: null,

    }
  }

  componentDidMount () {

    let svg = d3.select('#svg_main')

    document.addEventListener('keyup', this.onKeyPress)
    const chartHeight = document.getElementById('chart').clientHeight

    this.setState({
      chartHeight: chartHeight,
      svg: svg
    })
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.onKeyPress)

  }

  onKeyPress(e) {
    const keyCode = e.which
    // console.log(keyCode)
    switch (keyCode) {
      case 8: // DEL Mac
      case 46: { // DEL PC
        const fans = this.state.fans
          .filter(each => !each.selected)

        this.canvasNode.cancelDrag()
        this.setState({
          fans,
        })

        break
      }
      case 27: { // ESC
        // this.node.terminate()
        // this.canvasNode.cancelDrag()
        this.setState({
          enableInteractiveObject: false
        })
        break
      }
      case 68:   // D - Draw drawing object
      case 69: { // E - Enable drawing object
        this.setState({
          enableInteractiveObject: true
        })
        break
      }
    }
  }

  saveInteractiveNode(node) {
    log.red('saveInteractiveNode(node)')
    console.log(node)
    this.node = node
  }

  saveCanvasNode(node) {
    // console.log('saveCanvasNode(node)')
    // console.log(node)
    this.canvasNode = node
  }

  handleSelection(interactives) {

    // log.cyan('handleSelection(interactives)')
    // console.log(interactives)

    const state = toObject(interactives, each => {
      return [
        'fans',
        each.objects,
      ]
    })
    // log.cyan('handleSelection(interactives) --> state')
    // console.log(state)

    this.setState(state)

  }

  onStart (xyValue) {
    // console.log('start')
    // console.log(xyValue)
  }

  handleStart (xyValue) {

    // console.log('handleStart(xyValue)', xyValue)

    const {current} = this.state

    if (isNotDefined(current) || isNotDefined(current.startXY)) {
      this.mouseMoved = false

      this.setState({
        current: {
          startXY: xyValue,
          endXY: null
        }
      }, () => {
        this.onStart(xyValue)
      })
    }
  }

  handleEnd (xyValue, moreProps, e) {

    // console.log('handleEnd (xyValue, moreProps, e')
    // console.log(xyValue)
    // console.log(moreProps)
    // console.log(e)

    const {current, fans} = this.state
    const {appearance} = this.props

    if (this.mouseMoved && isDefined(current) && isDefined(current.startXY)) {
      const newfans = [
        ...fans.map(d => ({...d, selected: false})),
        {...current, selected: true, appearance}
      ]
      this.setState({
        current: null
      }, () => {
        this.onDrawComplete(newfans, moreProps, e)
      })
    }

    console.log(this.state.fans)

  }

  handleDrawLine(xyValue) {

    // console.log('handleDrawLine(xyValue)')
    // console.log(xyValue)

    const { current } = this.state;

    if (isDefined(current) && isDefined(current.startXY)) {
      this.mouseMoved = true;

      this.setState({
        current: {
          startXY: current.startXY,
          endXY: xyValue,
        }
      });
    }
  }

  svg (moreProps, e) {

    // console.log(e)

    let mouseXY = moreProps.mouseXY

    let x = mouseXY[0]
    let y = mouseXY[1]

    this.state.svg.call(drag()
      .container(function () { return this })
      .subject(function () {
        let p = [x, y]
        console.log('p-----', p)
        return [p, p]
      })
      .on('start', this.drawPath))
  }

  drawPath (moreProps, e) {

    let line = d3.line().curve(d3.curveBasis)

    let mouseXY = moreProps.mouseXY

    let x = mouseXY[0]
    let y = mouseXY[1]

    let d = d3.event.subject

    let active = this.svg().append('path').datum(d)

    console.log('active', active)

    let x0 = x
    let y0 = y

    drag().on('drag', function () {

      console.log('drag')

      let x1 = x
      let y1 = y
      let dx = x1 - x0
      let dy = y1 - y0

      if (dx * dx + dy * dy > 100) d.push([x0 = x1, y0 = y1])
      else d[d.length - 1] = [x1, y1]
      console.log(line)

      active.attr('d', line)

    })

  }

  onDrawComplete(fans, moreProps, e) {

    if (fans.length < 1) {
      return
    }

    // const { type, data: initialData, width, ratio } = this.props
    //
    // const nodes = this.getInteractiveNodes()
    // const gann_fan_1 = nodes.GannFan_1.node
    // const GannFans = new Promise(function (resolve) {
    //   resolve(gann_fan_1.nodes)
    //
    // })

    // GannFans.then(function (EachGannFan) {
    //
    //   for (let i = 0; i < EachGannFan.length; i++) {
    //
    //     let startXY = EachGannFan[i].nodes.fan.props.startXY
    //     let endXY = EachGannFan[i].nodes.fan.props.endXY
    //
    //     let startX = startXY[0]
    //     let endX = endXY[0]
    //
    //     let startPrice = utils.__toFixed(startXY[1])
    //     let endPrice = utils.__toFixed(endXY[1])
    //
    //     let startDate = initialData[startX].date
    //     let endDate = initialData[endX].date
    //
    //     log.white(i, ' ---------------------------')
    //     log.cyan(i, ' ---------------------------')
    //
    //     // console.log('EachGannFan[' + i + '].nodes: ', EachGannFan[i].nodes.fan.props)
    //
    //     log.green(` startDate: `, startDate)
    //     log.green(`startPrice: `, startPrice)
    //
    //     log.lightRed(`   endDate: `, endDate)
    //     log.lightRed(`  endPrice: `, endPrice)
    //
    //     // console.log('startXY: ', startXY)
    //     // console.log('..endXY: ', endXY)
    //
    //     log.white(i, ' ---------------------------')
    //
    //   }
    //
    // })

    this.setState({
      enableInteractiveObject: false,
      fans
    })

  }

  render() {
    const { type, data: initialData, width, ratio } = this.props
    const { fans } = this.state

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date)
    const {
      data,
      xScale,
      xAccessor,
      displayXAccessor,
    } = xScaleProvider(initialData)

    const start = xAccessor(last(data))
    const end = xAccessor(data[Math.max(0, data.length - 150)])
    const xExtents = [start, end]

    return (

      <ChartCanvas ref={this.saveCanvasNode}
                   height={this.state.chartHeight}
                   width={width}
                   ratio={ratio}
                   margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
                   type={type}
                   seriesName='Balls'
                   data={data}
                   xScale={xScale}
                   xAccessor={xAccessor}
                   displayXAccessor={displayXAccessor}
                   xExtents={xExtents}>

        <Chart id={1}
               yExtents={[d => [d.high, d.low]]}
               padding={{ top: 10, bottom: 20 }}>

          <YAxis axisAt='right' orient='right' ticks={5} />
          <XAxis axisAt='bottom' orient='bottom'/>

          <MouseCoordinateY at='right' orient='right' displayFormat={format('.2f')} />

					<CandlestickSeries />

          <MouseLocationIndicator enabled={this.state.enableInteractiveObject}
                                  snap={false}
                                  r={10}
                                  stroke={'black'}
                                  opacity={0.75}
                                  strokeWidth={2}
                                  onMouseDown={this.handleStart}
                                  onClick={this.handleEnd}
                                  onMouseMove={this.handleDrawLine} />

        </Chart>
        
        <CrossHairCursor />
        
        <DrawingObjectSelector enabled={!this.state.enableInteractiveObject}
                               getInteractiveNodes={this.getInteractiveNodes}
                               onSelect={this.handleSelection}
                               drawingObjectMap={{
                                 GannFan: 'fans'
                               }} />
      </ChartCanvas>
    )
  }
}

CandleStickChartWithGannFan.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
}

CandleStickChartWithGannFan.defaultProps = {
  type: 'svg',
}

CandleStickChartWithGannFan = fitWidth(CandleStickChartWithGannFan)

export default CandleStickChartWithGannFan
