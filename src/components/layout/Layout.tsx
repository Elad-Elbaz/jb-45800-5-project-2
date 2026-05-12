import Footer from './footer/Footer'
import Header from './header/Header'
import './Layout.css'
import Main from './main/Main'

export default function Layout() {

    return (
        <div className='layout'>

            <Header />
            <main>
                <Main />
            </main>
            <Footer />

        </div>

    )
}