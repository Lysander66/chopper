import { formatTimeMillis } from '@/util/time'

import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Input, List, Typography, message, Divider } from 'antd'

const WebSocketPage = () => {
  const [url, setUrl] = useState('')
  const [wsConn, setWsConn] = useState(null)
  const [channel, setChannel] = useState('')
  const [list, setList] = useState([])

  const onUrlChange = (e) => {
    setUrl(e.target.value)
  }

  useEffect(() => {
    if (!channel || channel.length === 0) {
      return
    }
    const item = {
      msg: channel,
      time: formatTimeMillis(new Date()),
    }
    setList([...list.filter(function (v, i) { return i < 20 }), item])
  }, [channel])

  const start = () => {
    const conn = new WebSocket(url)
    conn.onmessage = (e) => {
      setChannel(e.data)
      let ele = document.getElementById("demo")
      ele.scrollTop = ele.scrollHeight
    }
    conn.onopen = function () {
      setWsConn(conn)
      message.success('连接成功')
    }
    conn.onclose = function (e) {
      setWsConn(null)
      message.info('连接关闭')
    }
    conn.onerror = function (e) {
      message.error('Failed:', e)
    }
  }

  const stop = () => {
    if (wsConn) {
      wsConn.close()
    }
  }

  return (
    <>
      <Row justify='space-around'>
        <Col >
          <br />
          <Input style={{ paddingBottom: 10 }} addonBefore='URL' value={url} onChange={onUrlChange} />
          <Button onClick={start} type='primary'>连接</Button>
          <Divider type='vertical' />
          <Button onClick={stop} danger type='primary'>断开</Button>
          <Divider type='vertical' />
          <Button onClick={() => { setList([]) }} >Clear</Button>
        </Col>

        <Col span={15}>
          <List
            style={{ height: '85vh', overflowY: 'scroll' }}
            header={<div>Header</div>}
            dataSource={list}
            renderItem={(item, i) => (
              <List.Item>
                <div id='demo'>
                  <Typography.Text mark={i === list.length - 1} style={{ width: '100px' }} type='success'>{item.time}</Typography.Text>
                  <Typography.Paragraph
                    copyable
                    ellipsis={{ rows: 5, expandable: true }}
                    title={`${item.time}--title`}
                  >
                    {item.msg}
                  </Typography.Paragraph>
                </div>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  )
}

export default WebSocketPage
