import { useState } from 'react'
import { Row, Col, Button, Form, Input } from 'antd'

const LogPage = () => {
  //  本地发送数据
  let sendData = ''

  const [sendText, setSendText] = useState('')
  const [recvText, setRecvText] = useState('')

  const onSendTextChange = (e) => {
    setSendText(e.target.value)
  }

  const onRecvTextChange = (e) => {
    setRecvText(e.target.value)
  }


  // 本地连接
  let localConnection
  // 远端视频流
  let remoteConnection
  // 本地通道
  let sendChannel
  let sendChannelState

  // 远端通道
  let receiveChannel
  let receiveChannelState
  // 远端接受到得数据
  let receiveData

  // ICE service地址
  let configuration = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
        // urls: 'stun:49.232.162.254:2478',
        // username: 'admin',
        // credential: 'admin',
      },
    ],
  }

  const cancel = () => {
    console.log('关闭会话')
    remoteConnection.close()
    localConnection.close()
    localConnection = null
    remoteConnection = null
  }


  const send = async () => {
    // if (sendData == '') {
    //   return
    // }

    if (sendChannel == null) {
      console.log('sendChannel为空:', sendText)
      return
    }
    console.log(sendChannel.readyState)
    sendChannel.send(sendText)
    console.log('发送数据:', sendText)
  }

  const call = async () => {
    localConnection = new RTCPeerConnection()
  }

  const call2 = async () => {
    console.log('开始呼叫')

    //  监听返回icecandidate 信息
    localConnection = new RTCPeerConnection()
    localConnection.addEventListener(
      'icecandidate',
      onIceCandidateA
    )
    // 实例化发送通道
    sendChannel =
      localConnection.createDataChannel('webrtc-datachannel')
    sendChannel.onopen = onSendChannelStateChange
    sendChannel.onclose = onSendChannelStateChange

    remoteConnection = new RTCPeerConnection(configuration)
    remoteConnection.addEventListener(
      'icecandidate',
      onIceCandidateB
    )

    // 远端数据到达监听事件
    remoteConnection.ondatachannel = receiveChannelCallBack
    // 监听ICE状态变化
    localConnection.addEventListener(
      'iceconnectionstatechange',
      onIceStateChangeA
    )
    remoteConnection.addEventListener(
      'iceconnectionstatechange',
      onIceStateChangeB
    )

    // 创建通话offer
    try {
      console.log('localConnection 创建offer会话开始')
      const offer = await localConnection.createOffer()
      await onCreateOfferSuccess(offer)
    } catch (e) {
      console.log('创建会话描述SD失败：', e.toString())
    }
  }


  // 创建提议offer成功
  const onCreateOfferSuccess = async (event) => {
    // 设置连接描述
    console.log('localConnection 创建offer返回得SDP信息', event.sdp)
    console.log('设置localConnection得本地描述start...')
    try {
      await localConnection.setLocalDescription(event)
      console.log('设置localConnection得本地描述成功')
    } catch (e) {
      console.log('设置localConnection得本地描述错误：', e.toString())
    }

    console.log('设置remoteConnection得远端描述 start')
    try {
      await remoteConnection.setRemoteDescription(event)
      console.log('设置remoteConnection得远端描述成功')
    } catch (e) {
      console.log('设置remoteConnection得远端描述错误：', e.toString())
    }

    // 开始应答
    console.log('remoteConnection创建应答 answer start')
    try {
      const answer = await remoteConnection.createAnswer()
      console.log('remoteConnection创建应答成功')
      await onCreateAnswerSuccess(answer)
    } catch (e) {
      console.log('remoteConnection创建应答错误：', e.toString())
    }
  }

  // 创建answer应答成功
  const onCreateAnswerSuccess = async (answer) => {
    console.log('remoteConnection创建应答answer数据：', answer)
    console.log('localConnection与remoteConnection交换应答answer信息 start')

    try {
      await remoteConnection.setLocalDescription(answer)
      console.log('设置remoteConnection得本地answer 应答远端描述成功')
    } catch (e) {
      console.log(
        '设置remoteConnection得本地answer应答描述错误：',
        e.toString()
      )
    }

    try {
      await localConnection.setRemoteDescription(answer)
      console.log('设置localConnection得远端answer应答描述成功')
    } catch (e) {
      console.log(
        '设置localConnection得远端answer应答描述错误：',
        e.toString()
      )
    }
  }

  const receiveChannelCallBack = (event) => {
    receiveChannel = event.channel
    receiveChannel.onmessage = onReceiveMessageCallBack
    receiveChannel.onopen = onReceiveChannelStateChange
    console.log('Receive channel callback', receiveChannel)
  }

  const onReceiveChannelStateChange = () => {
    receiveChannelState = receiveChannel.readyState
    console.log('接受通道状态：' + receiveChannel.readyState)
  }
  const onReceiveMessageCallBack = (event) => {
    console.log('接受到数据:' + event.data)
    receiveData = event.data
  }




  const onSendChannelStateChange = () => {
    sendChannelState = sendChannel.readyState
    console.log('send channel state change', sendChannel.readyState)
  }

  // 监听ICE状态变化事件回调方法
  const onIceStateChangeA = (event) => {
    console.log(
      '监听 localConnection ICE状态',
      localConnection.iceConnectionState
    )
    console.log(event)
  }
  // 监听ICE状态变化事件回调方法
  const onIceStateChangeB = async (event) => {
    console.log(
      '监听 remoteConnection ICE状态',
      remoteConnection.iceConnectionState
    )
    console.log(event)
  }


  const onIceCandidateA = async (event) => {
    try {
      if (event.candidate) {
        // 直接交换candidate数据，就不需要通过信令服务器传送
        await remoteConnection.addIceCandidate(event.candidate)
        console.log('remoteConnection IceCandidate----------')
        console.log(event)
        onAddIceCandidateSuccess(remoteConnection)
      }
    } catch (e) {
      onAddIceCandidateError(remoteConnection, e)
    }
    console.log('onIceCandidateA data:' + event.candidate)
  }

  const onIceCandidateB = async (event) => {
    try {
      if (event.candidate) {
        await localConnection.addIceCandidate(event.candidate)
        console.log('localConnection IceCandidate----------')
        console.log(event)
        onAddIceCandidateSuccess(localConnection)
      }
    } catch (e) {
      onAddIceCandidateError(localConnection, e)
    }
    console.log('onIceCandidateB data:' + event.candidate)
  }

  const onAddIceCandidateSuccess = (pc) => {
    console.log('添加' + getPcName(pc) + '      IceCandidate 成功')
  }

  const onAddIceCandidateError = (pc, err) => {
    console.log(
      '添加' +
      getPcName(pc) +
      '       IceCandidate 失败' +
      err.toString()
    )
  }

  const getPcName = (pc) => {
    return pc === localConnection
      ? 'localConnection'
      : 'remoteConnection'
  }



  return (
    <div className='playerDiv'>
      <Form
        name='basic'
        initialValues={{
          sendText: 'hello world'
        }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={send}
        // onFinishFailed={onFinishFailed}
        colon={false}
        autoComplete='off'
      >
        <Row>
          <Col offset={4} span={10}>
            <Form.Item label='发送' name='sendText' rules={[{ required: true }]}>
              <Input.TextArea onChange={onSendTextChange} placeholder='请输入要发送的内容' />
            </Form.Item>
          </Col>
          <Col offset={4} span={10}>
            <Form.Item label='接收' name='recvText' >
              <Input.TextArea onChange={onRecvTextChange} />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={2}>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type='primary' htmlType='submit'>发送</Button>
            </Form.Item>
          </Col>

          <Col span={2}>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type='primary' onClick={call}>呼叫</Button>
            </Form.Item>
          </Col>

          <Col span={2}>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type='primary' onClick={cancel}>挂断</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default LogPage
