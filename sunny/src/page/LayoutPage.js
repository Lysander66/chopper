import './style/LayoutPage.scss'
import { DEFINE_PATH } from '@/config/path'

import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
  FloatButton,
  Layout,
  Menu,
} from 'antd'
import {
  CameraOutlined,
  HomeOutlined,
  PlayCircleOutlined,
  WifiOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  FunctionOutlined,
} from '@ant-design/icons'

const { Header, Content, Footer, Sider } = Layout


const LayoutPage = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsed='false' defaultCollapsed >
        <div className='site-logo'>
          {/* <div className='g-fire'>
            {
              [...Array(200).keys()].map(i => {
                return <div key={i} className='g-ball' />
              })
            }
          </div> */}
        </div>
        <Menu
          mode='inline'
          theme='light'
          defaultSelectedKeys={pathname}
          selectedKeys={pathname}
          items={[
            {
              icon: <HomeOutlined />,
              label: 'Outline',
              key: 'root',
              onClick: () => { navigate(DEFINE_PATH.root) },
            },
            // {
            //   icon: <PlayCircleOutlined />,
            //   label: 'Player',
            //   key: 'player',
            //   onClick: () => { navigate(DEFINE_PATH.player) },
            // },
            {
              icon: <WifiOutlined />,
              label: 'WebSocket',
              key: 'websocket',
              onClick: () => { navigate(DEFINE_PATH.websocket) },
            },
            {
              icon: <SearchOutlined />,
              label: 'WebSocket2',
              key: 'websocket2',
              onClick: () => { navigate(DEFINE_PATH.JSONEditor) },
            },
            // {
            //   icon: <CameraOutlined />,
            //   label: 'Live',
            //   key: 'live',
            //   onClick: () => { navigate(DEFINE_PATH.live) },
            // },
            // {
            //   icon: <ThunderboltOutlined />,
            //   label: 'Log',
            //   key: 'log',
            //   onClick: () => { navigate(DEFINE_PATH.log) },
            // },
            {
              icon: <FunctionOutlined />,
              label: 'Crypto',
              key: 'crypto',
              onClick: () => { navigate(DEFINE_PATH.crypto) },
            }
          ]}
        />
      </Sider>

      <Layout className="site-layout">
        <Header className="site-layout-background" />
        <Content >
          <Outlet />
        </Content>
        <FloatButton.BackTop className="myBackTop" />
        <Footer>DevTools ©2023 Created by Lysander</Footer>
      </Layout>
    </Layout>
  )
}

export default LayoutPage
