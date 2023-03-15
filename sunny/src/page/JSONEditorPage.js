import './style/JSONEditorPage.scss'
import { formatTimeMillis } from '@/util/time'
import SvelteJSONEditor from '@/component/SvelteJSONEditor'

import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Form, Input, Switch, Timeline, message } from 'antd'

const JSONEditorPage = () => {
  const [count, setCount] = useState(0)
  const [freeze, setFreeze] = useState(false)
  const [channel, setChannel] = useState('')
  const [lastMessage, setLastMessage] = useState({})
  const [messageHistory, setMessageHistory] = useState([])
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!channel || channel.length === 0) {
      return
    }
    setCount(count + 1)
    if (!freeze) {
      const obj = {
        json: JSON.parse(channel),
        label: `${formatTimeMillis(new Date())} len: ${channel.length}`,
      }
      setLastMessage(obj)
      setMessageHistory([obj, ...messageHistory.filter(function (v, i) { return i < 35 })])
      setTimeline()
    }
  }, [channel])

  const onFinish = (values) => {
    const { url } = values
    const conn = new WebSocket(url)
    conn.onmessage = (e) => {
      setChannel(e.data)
    }
    conn.onopen = function () {
      message.success('连接成功')
    }
    conn.onclose = function (e) {
      message.info('连接关闭')
    }
    conn.onerror = function (e) {
      message.error('Failed:', e)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const onChange = (checked) => {
    setFreeze(checked)
  }

  const handleClick = (e, index) => {
    setLastMessage(messageHistory[index])
  }

  const setTimeline = () => {
    let items = []
    for (let i = 0; i < messageHistory.length; i++) {
      let item = {
        color: getColor(i),
        children: < span key={i} onClick={e => handleClick(e, i)} className='myTimeline'>
          {messageHistory[i].label}
        </span>,
      }
      items.push(item)
    }
    setItems(items)
  }

  const getColor = (i) => {
    if (i < 6) {
      return 'red'
    } else if (i < 16) {
      return 'green'
    } else if (i < 26) {
      return 'blue'
    }
    return 'gray'
  }

  return (
    <>
      <Form
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          url: '',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        colon={false}
        autoComplete='off'
        className='webSocketForm'
      >
        <Row>
          <Col span={10} >
            <Form.Item
              label='WebSocket'
              name='url'
              rules={[
                {
                  required: true,
                  message: 'Please input your url',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={2}>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button disabled={count > 1} htmlType='submit' type='primary' shape='round'>
                {count > 1 ? count : '连接'}
              </Button>
            </Form.Item>
          </Col>

          <Col span={2} >
            <Form.Item name='freeze' label='freeze' valuePropName='checked'>
              <Switch onChange={onChange} />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Row justify='space-around'>
        <Col span={19}>
          <SvelteJSONEditor content={lastMessage} />
        </Col>
        <Col >
          <Timeline items={items} />
        </Col>
      </Row>
    </>
  )
}

export default JSONEditorPage
