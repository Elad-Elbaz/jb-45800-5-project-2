import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Layout from '../layout/Layout'
import { Provider as Redux } from 'react-redux'
import store from '../../services/redux/store'
import  LocalStorageManager from '../LocalStorageManager/LocalStorageManager'
function App() {

  return (
    <div className='App'>
      <BrowserRouter>
        <Redux store={store}>
          <LocalStorageManager />

          <Layout />
        </Redux>
      </BrowserRouter>
    </div>
  )
}
export default App
