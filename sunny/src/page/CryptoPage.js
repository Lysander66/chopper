import { useState } from 'react'
import { Tabs, Row, Col, Button, Divider, Input, InputNumber, Descriptions, Tooltip, message } from 'antd'
import { SwapOutlined, CopyOutlined } from '@ant-design/icons'
import { Base64 } from 'js-base64'
import dayjs from 'dayjs'


const CryptoPage = () => {
  const onChange = (key) => {
    console.log(key)
  }
  const items = [
    {
      key: '1',
      label: `Unix时间戳`,
      children: <>
        <TimestampTab />
        <br />
        <TimestampTab />
        <br />
        <TimestampTab />
        <br />
        <TimestampTab />
        <br />
        <TimestampTab />
        <br />
        <TimestampTab />
        <br />
        <TimestampTab />
      </>,
    },
    {
      key: '2',
      label: `Tab 2`,
      children: <HashTab />,
    },
    {
      key: '3',
      label: `Tab 3`,
      children: `Content of Tab Pane 3`,
    },
  ]

  return (
    <>
      <Tabs defaultActiveKey='1' items={items} onChange={onChange} />
      <br />
      <br />
      <br />
      <Descriptions column={1} title="输入完成按回车即可">
        <Descriptions.Item label="Unix 时间戳">Unix 时间戳是从1970年1月1日（UTC/GMT的午夜）开始所经过的秒数，不考虑闰秒。</Descriptions.Item>
        <Descriptions.Item label="Unix">秒(10位)</Descriptions.Item>
        <Descriptions.Item label="UnixMilli">毫秒(13位)</Descriptions.Item>
        <Descriptions.Item label="format">YYYY-MM-DD HH:mm:ss</Descriptions.Item>
        <Descriptions.Item label="2038年问题">
          现时大部分使用UNIX的系统都是32位的，即它们会以32位有符号整数表示时间类型time_t。因此它可以表示136年的秒数。表示协调世界时间1901年12月13日星期五20时45分52秒至2038年1月19日3时14分07秒（二进制：01111111 11111111 11111111 11111111，0x7FFF:FFFF），在下一秒二进制数字会是10000000 00000000 00000000 00000000（0x8000:0000），这是负数，因此各系统会把时间误解作1901年12月13日20时45分52秒（亦有可能回归到1970年）。这时可能会令软件发生问题，导致系统瘫痪。
          目前的解决方案是把系统由32位转为64位系统。在64位系统下，此时间最多可以表示到2922亿7702万6596年12月4日15时30分08秒。
        </Descriptions.Item>
      </Descriptions>
    </>
  )
}


const TimestampTab = () => {
  const [input, setInput] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  const [output, setOutput] = useState('')
  const [output2, setOutput2] = useState(dayjs().valueOf())

  const onPressEnter1 = (e) => {
    if (e.target.value.length === 0) return
    let d = dayjs(e.target.value)
    setOutput(d.unix())
    setOutput2(d.valueOf())
  }

  // 秒10位 毫秒13位
  const format = (value) => {
    let d = value.length === 13 ? dayjs(Number.parseInt(value)) : dayjs.unix(value)
    setInput(d.format('YYYY-MM-DD HH:mm:ss'))
    setOutput2(d.valueOf())
  }

  return (
    <>
      <Row justify='center'>
        <Col span={3}>
          <Input addonBefore='Format' value={input} onChange={(e) => setInput(e.target.value)} onPressEnter={onPressEnter1} />
        </Col>
        <Col span={3}>
          <InputNumber addonBefore='Unix' value={output} onChange={(val) => setOutput(val)} onPressEnter={(e) => format(e.target.value)} />
        </Col>
        <Col span={3}>
          <InputNumber addonBefore='UnixMilli' readOnly value={output2} onChange={(val) => setOutput2(val)} />
        </Col>
      </Row>
    </>
  )
}

const HashTab = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const swap = () => {
    setInput(output)
    setOutput(input)
  }

  const onInputChange = (e) => {
    setInput(e.target.value)
  }

  const copy = (e) => {
    if (navigator.clipboard) {
      // clipboard api 复制
      navigator.clipboard.writeText(output)
    } else {
      let textarea = document.createElement('textarea')
      document.body.appendChild(textarea)
      // 隐藏此输入框
      textarea.style.position = 'fixed'
      textarea.style.clip = 'rect(0 0 0 0)'
      textarea.style.top = '10px'
      // 赋值
      textarea.value = output
      // 选中
      textarea.select()
      // 复制
      document.execCommand('copy', true)
      // 移除输入框
      document.body.removeChild(textarea)
    }

    message.success('copied')
  }

  const urlEncode = () => {
    setOutput(encodeURIComponent(input))
  }

  const urlDecode = () => {
    try {
      setOutput(decodeURIComponent(input))
    } catch (e) { // Catches a malformed URI
      console.error(e)
    }
  }

  const md5Hash = () => {
    let url = `http://127.0.0.1:8180/api/v1/crypto/md5?s=${input}`
    get(url).then(resp => {
      setOutput(resp.data)
    })
  }

  const sha1Hash = () => {
    let url = `http://127.0.0.1:8180/api/v1/crypto/sha1?s=${input}`
    get(url).then(resp => {
      setOutput(resp.data)
    })
  }

  const sha256Hash = () => {
    let url = `http://127.0.0.1:8180/api/v1/crypto/sha256?s=${input}`
    get(url).then(resp => {
      setOutput(resp.data)
    })
  }

  const sha512Hash = () => {
    let url = `http://127.0.0.1:8180/api/v1/crypto/sha512?s=${input}`
    get(url).then(resp => {
      setOutput(resp.data)
    })
  }

  const get = async (url = '') => {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    })
    return response.json()
  }

  const todo = () => {
    message.warning('TODO')
  }

  return (
    <>
      <Row justify='center'>
        <Col span={10}>
          <Input.TextArea value={input} onChange={onInputChange} rows='20' style={{ width: 'calc(100% - 200px)' }} />
        </Col>

        <Col span={2}>
          <Button onClick={swap} icon={<SwapOutlined />}>Swap</Button>

          <Divider orientation='center'>urlEncode</Divider>
          <Button onClick={urlEncode} type='primary'>Escape</Button>
          <br />
          <br />
          <Button onClick={urlDecode} type='primary'>Unescape</Button>

          <Divider orientation='center'>Base64</Divider>
          <Button onClick={() => { setOutput(Base64.encode(input)) }} type='primary'>Encode</Button>
          <br />
          <br />
          <Button onClick={() => { setOutput(Base64.decode(input)) }} type='primary'>Decode</Button>

          <Divider orientation='center'>Hash</Divider>
          <Button onClick={md5Hash} type='primary'>MD5</Button>
          <br />
          <br />
          <Button onClick={sha1Hash} type='primary'>SHA-1</Button>
          <br />
          <br />
          <Button onClick={sha256Hash} type='primary'>SHA-256</Button>
          <br />
          <br />
          <Button onClick={sha512Hash} type='primary'>SHA-512</Button>

          <Divider orientation='center'>AES</Divider>
          <Button onClick={todo} type='primary'>Encrypt</Button>
          <br />
          <br />
          <Button onClick={todo} type='primary'>Decrypt</Button>
        </Col>

        <Col span={10}>
          <Input.Group compact>
            <Input.TextArea value={output} rows='20' style={{ width: 'calc(100% - 200px)' }} />
            <Tooltip title='copy'>
              <Button onClick={copy} icon={<CopyOutlined />} />
            </Tooltip>
          </Input.Group>
        </Col>
      </Row>
    </>
  )
}

export default CryptoPage
