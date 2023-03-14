import { useState } from 'react'
import { Tabs, Row, Col, Button, Divider, Input, Tooltip, message } from 'antd'
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
      label: `Tab 1`,
      children: <HashTab />,
    },
    {
      key: '2',
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
      key: '3',
      label: `Tab 3`,
      children: `Content of Tab Pane 3`,
    },
  ]

  return (
    <Tabs defaultActiveKey='1' items={items} onChange={onChange} />
  )
}


const TimestampTab = () => {
  const [input, setInput] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  const [output, setOutput] = useState('')
  const [output2, setOutput2] = useState('')

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

  const onInputChange = (e) => {
    setInput(e.target.value)
    unix(e.target.value)
    unixMilli(e.target.value)
  }

  const onOutputChange = (e) => {
    setOutput(e.target.value)
    format(e.target.value)
  }

  const onOutput2Change = (e) => {
    setOutput2(e.target.value)
    format(e.target.value)
  }

  const format = (text) => {
    if (text.length === 0) return

    // 毫秒 13位
    if (text.length === 13) {
      console.log(Number.parseInt(text))
      let d = dayjs(Number.parseInt(text))
      setInput(d.format('YYYY-MM-DD HH:mm:ss'))
      return
    }

    // 秒 10位
    let d = dayjs.unix(text)
    setInput(d.format('YYYY-MM-DD HH:mm:ss'))
  }

  const unix = () => {
    if (input.length === 0) return
    setOutput(dayjs(input).unix())
  }

  const unixMilli = () => {
    if (input.length === 0) return
    setOutput2(dayjs(input).valueOf())
  }

  return (
    <>
      <Row justify='center'>
        <Col span={5}>
          <Input addonBefore='Format' value={input} onChange={onInputChange} />
        </Col>
        <Divider dashed type='vertical' />
        <Col span={5}>
          <Input addonBefore='Unix' value={output} onChange={onOutputChange} />
        </Col>
        <Divider dashed type='vertical' />
        <Col span={5}>
          <Input addonBefore='UnixMilli' value={output2} onChange={onOutput2Change} />
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
