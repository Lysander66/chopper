import { useState } from 'react'
import { Tabs, Row, Col, Button, Divider, Form, Input, Tooltip } from 'antd'
import { CopyOutlined } from '@ant-design/icons'


const EncryptPage = () => {
  const onChange = (key) => {
    console.log(key)
  }
  const items = [
    {
      key: 'Base64',
      label: `Base64`,
      children: <Base64Tab />,
    },
    {
      key: '2',
      label: `Tab 2`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: '3',
      label: `Tab 3`,
      children: `Content of Tab Pane 3`,
    },
  ]

  return (
    <Tabs defaultActiveKey='1' items={items} onChange={onChange} />
  )
}

const Base64Tab = () => {
  const onChange = (e) => {
  }

  return (
    <>
      <Row justify='center'>
        <Col span={10}>
          <Input.TextArea style={{ width: 'calc(100% - 200px)' }} rows='20' />
        </Col>

        <Col span={2}>
          <Divider orientation='center'>Base64</Divider>
          <Row justify='center'>
            <Button type='primary'>Encode</Button>
          </Row>
          <br />
          <Row justify='center'>
            <Button type='primary'>Decode</Button>
          </Row>

          <Divider orientation='center'>MD5</Divider>
          <Row justify='center'>
            <Button type='primary'>Encrypt</Button>
          </Row>
        </Col>

        <Col span={10}>
          <Input.Group compact>
            <Input.TextArea style={{ width: 'calc(100% - 200px)' }} rows='20' />
            <Tooltip title='copy'>
              <Button icon={<CopyOutlined />} />
            </Tooltip>
          </Input.Group>
        </Col>
      </Row>
    </>
  )
}

export default EncryptPage
