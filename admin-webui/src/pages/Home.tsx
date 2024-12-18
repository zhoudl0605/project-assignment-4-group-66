import logo from "../logo.svg";
import Layout from "../layout/dashboard";

function HomePage() {
    return (
        <Layout pagename="Home">
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        123 Edit <code>src/App.tsx</code> and save to reload.123
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            </div>
        </Layout>
    );
}

export default HomePage;
