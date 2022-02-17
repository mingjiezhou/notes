import React, { useState } from 'react'
import './index.less'

export default function App() {
  const [mineCoord, setMineCoord] = useState([])
  const [mineNum, setMineNum] = useState(50)
  const [width, setWidth] = useState(16)
  const [height, setHeight] = useState(16)
  const [square, setSquare] = useState([])
  /**
   * leetcode 529. 扫雷游戏
   * 'M' 代表一个未挖出的地雷，
   * 'E' 代表一个未挖出的空方块，
   * 'B' 代表没有相邻（上，下，左，右，和所有4个对角线）地雷的已挖出的空白方块，
   * 数字（'1' 到 '8'）表示有多少地雷与这块已挖出的方块相邻，
   * 'X' 则表示一个已挖出的地雷。
   */

  // 定义方块（细胞）类型 Map
  const STATUSMAP = new Map([
    [0, '空'],
    [1, '1'],
    [2, '2'],
    [3, '3'],
    [4, '4'],
    [5, '5'],
    [6, '6'],
    [7, '7'],
    [8, '8'],
    [10, require('./assets/mine.jpeg')],
  ])

  // 定义雷区组件
  const Board = props => {
    // 细胞(最小单位)
    const Square = props => {
      return (
        <td
          onClick={() => {
            props.updateSquareValue(props)
          }}
          className={`td-${props.colCoord}-${props.rowCoord} square`}
        >
          {props.show ? props.value : ''}
        </td>
      )
    }
    // 列
    const trList = square.map((item, index) => {
      return (
        <tr key={index}>
          {item.map((subItem, tdIndex) => {
            return (
              <Square
                updateSquareValue={updateSquareValue}
                colCoord={index}
                rowCoord={tdIndex}
                value={square[index][tdIndex].value}
                key={`${index}-${tdIndex}`}
                show={false}
                hasClearance={false}
              />
            )
          })}
        </tr>
      )
    })

    return (
      <table className="board-container" cellSpacing="0">
        <thead></thead>
        <tbody>{trList}</tbody>
      </table>
    )
  }

  // 初始化方块数据
  const initSquareValue = (width, height, mineArray) => {
    let square = []
    for (let i = 0; i < height; i++) {
      let a = []
      for (let j = 0; j < width; j++) {
        a.push({ value: 0 })
      }
      square.push(a)
    }
    mineArray.forEach(i => {
      square[i['col']][i['row']].value = 10
    })
    return square
  }

  // 配置雷区数据
  const creatBoardParams = () => {
    const mineArray = []
    for (let i = 0; i < mineNum; i++) {
      mineArray.push({
        col: Number(Number(Math.random() * (width - 1 || 0)).toFixed(0)),
        row: Number(Number(Math.random() * (height - 1 || 0)).toFixed(0)),
      })
    }
    setMineCoord(mineArray)
    setTimeout(() => {
      setSquare(initSquareValue(width, height, mineArray))
    })
  }

  // 更新方块数据
  const updateSquareValue = props => {
    let dom = document.querySelector(`.td-${props.colCoord}-${props.rowCoord}`)
    const v = dom.innerText
    if (v !== '') {
      return
    }
    if (props.value === 10) {
      dom.style.background = `#fff url(${STATUSMAP.get(10)})`
      dom.style.backgroundSize = 'cover'
      setTimeout(() => {
        // if (window.confirm('游戏结束，是否初始化服务？')) {
        //   init()
        // }
      }, 100)
      return
    }
    let neighbor = []
    let num = 0
    for (let i = props.colCoord - 1; i <= props.colCoord + 1; i++) {
      for (let j = props.rowCoord - 1; j <= props.rowCoord + 1; j++) {
        if (
          i < 0 ||
          j < 0 ||
          (i === props.colCoord && j === props.rowCoord) ||
          i >= height ||
          j >= width
        ) {
          continue
        }
        neighbor.push({ colCoord: i, rowCoord: j })
        if (
          mineCoord.filter(item => {
            return item.col === i && item.row === j
          }).length > 0
        ) {
          num++
        }
      }
    }
    // if (STATUSMAP.get(num) === '空') {
    console.log(num)
    if (num === 0) {
      neighbor.forEach(s => {
        window.requestAnimationFrame(() => {
          updateSquareValue(s)
        })
      })
    }
    dom.innerText = STATUSMAP.get(num)
  }

  const init = () => {
    setWidth(16)
    setHeight(16)
    setMineCoord([])
    setMineNum(50)
    setSquare([])
  }

  return (
    <div className="App">
      <div className="page-container">
        <div>
          <span>宽度</span>
          <input
            id="boardWidth"
            type="text"
            name="width"
            placeholder="宽度"
            value={width}
            onChange={e => setWidth(Number(e.target.value))}
          ></input>
          <span>高度</span>
          <input
            id="boardHeight"
            type="text"
            name="height"
            value={height}
            placeholder="高度"
            onChange={e => setHeight(Number(e.target.value))}
          ></input>
          <span>雷数</span>
          <input
            id="mineNum"
            type="text"
            name="num"
            value={mineNum}
            onChange={e => setMineNum(Number(e.target.value))}
            placeholder="地雷数量"
          ></input>
          <button onClick={() => creatBoardParams()}>生成</button>
          <button onClick={() => init()}>重置</button>
        </div>
        <Board width={Number(width)} height={Number(height)} />
      </div>
    </div>
  )
}
