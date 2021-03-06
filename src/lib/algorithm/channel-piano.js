import { format } from 'd3-format'
import * as utils from '../../utils'

const percentage = 0.3125
let start_price = 0.002101
let start_price_2 = 0.00210

let conversion_percentage = percentage / 100

let profit_desired = start_price * conversion_percentage
let next_price = start_price + profit_desired

const start_num__ = 0.00002625
const numbers__ = [
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
  0.00002625,
]

const lines_1 =  []
const lines_2 =  []

for (let i = 0; i < numbers__.length; i++) {

  let num = start_price * (percentage / 100)
  let val = start_price + num
  start_price = val

  let num_2 = start_price_2 * (percentage / 100)
  let val_2 = start_price_2 + num_2
  start_price_2 = val_2

  lines_1.push(utils.__toFixed(val))
  lines_2.push(utils.__toFixed(val_2))

}

const channels_1 = lines_1.map(function (__number, __idx) {
  let guid = chance.guid()
  return (
    <PriceCoordinate id={'current_base'}
                     key={guid}
                     displayFormat={format(utils.currencyFormat(base))}
                     at={'left'}
                     orient={'left'}
                     rectHeight={12}
                     dx={0}
                     x1_Offset={0}
                     x2_Offset={0}
                     lineStroke={'#00A2FF'}
                     fill={'#00A2FF'}
                     opacity={0.90}
                     lineOpacity={0.20}
                     lineStrokeDasharray={'LongDash'}
                     fontSize={9}
                     text={''}
                     price={__number}/>
  )

})

const channels_2 = lines_2.map(function (__number, __idx) {
  let guid = chance.guid()
  return (
    <PriceCoordinate id={'current_base'}
                     key={guid}
                     displayFormat={format(utils.currencyFormat(base))}
                     at={'left'}
                     orient={'left'}
                     rectHeight={12}
                     dx={0}
                     x1_Offset={0}
                     x2_Offset={0}
                     lineStroke={'#FF8200'}
                     fill={'#FF8200'}
                     opacity={0.90}
                     lineOpacity={0.20}
                     lineStrokeDasharray={'LongDash'}
                     fontSize={9}
                     text={''}
                     price={__number}/>
  )

})
