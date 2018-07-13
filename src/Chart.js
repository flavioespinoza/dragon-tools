
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

const log = require('ololog').configure({locate: false})

class CandleStickChartWithGannFan extends React.Component {
  constructor(props) {
    super(props)
    this.onKeyPress = this.onKeyPress.bind(this)
    this.onDrawComplete = this.onDrawComplete.bind(this)
    this.saveInteractiveNode = this.saveInteractiveNode.bind(this)
    this.saveCanvasNode = this.saveCanvasNode.bind(this)

    this.handleSelection = this.handleSelection.bind(this)

    this.saveInteractiveNodes = saveInteractiveNodes.bind(this)
    this.getInteractiveNodes = getInteractiveNodes.bind(this)

    this.state = {
      enableInteractiveObject: true,
      fans: [],
      chartHeight: 1200,

    }
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyPress)
    const chartHeight = document.getElementById('chart').clientHeight

    this.setState({
      chartHeight: chartHeight
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
  onDrawComplete(fans) {

    const { type, data: initialData, width, ratio } = this.props

    const nodes = this.getInteractiveNodes()
    const gann_fan_1 = nodes.GannFan_1.node
    const GannFans = new Promise(function (resolve) {
      resolve(gann_fan_1.nodes)

    })

    GannFans.then(function (EachGannFan) {

      for (let i = 0; i < EachGannFan.length; i++) {

        let startXY = EachGannFan[i].nodes.fan.props.startXY
        let endXY = EachGannFan[i].nodes.fan.props.endXY

        let startX = startXY[0]
        let endX = endXY[0]

        let startY = startXY[1]
        let endY = endXY[1]

        let sDate = initialData[startX].date //start date
        let eDate = initialData[endX].date // end date

        log.white(i, ' ---------------------------')
        log.cyan(i, ' ---------------------------')

        // console.log('EachGannFan[' + i + '].nodes: ', EachGannFan[i].nodes.fan.props)

        log.green('sDate: ', sDate)
        log.lightRed('eDate: ', eDate)

        // console.log('startXY: ', startXY)
        // console.log('..endXY: ', endXY)

        log.white(i, ' ---------------------------')


      }

    })

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

          <GannFan ref={this.saveInteractiveNodes('GannFan', 1)}
                   enabled={this.state.enableInteractiveObject}
                   // onStart={() => console.log('START')}
                   onComplete={this.onDrawComplete}
                   fans={fans} />

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
