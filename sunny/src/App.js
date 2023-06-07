import './App.css'
import { DEFINE_PATH } from './config/path'
import LayoutPage from './page/LayoutPage'
import HomePage from './page/HomePage'
import PlayerPage from './page/PlayerPage'
import JSONEditorPage from './page/JSONEditorPage'
import WebSocketPage from './page/WebSocketPage'
import LivePage from './page/LivePage'
import LogPage from './page/LogPage'
import CryptoPage from './page/CryptoPage'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App () {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<LayoutPage />}>
            <Route index element={<HomePage />} />
            {/* <Route path={DEFINE_PATH.player} element={<PlayerPage />} /> */}
            <Route path={DEFINE_PATH.websocket} element={<WebSocketPage />} />
            <Route path={DEFINE_PATH.JSONEditor} element={<JSONEditorPage />} />
            {/* <Route path={DEFINE_PATH.live} element={<LivePage />} /> */}
            {/* <Route path={DEFINE_PATH.log} element={<LogPage />} /> */}
            <Route path={DEFINE_PATH.crypto} element={<CryptoPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
