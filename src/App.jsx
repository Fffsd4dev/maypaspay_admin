import AppRouter from './routes/router';
import AppProvidersWrapper from './components/wrappers/AppProvidersWrapper';
import '@/assets/fonts';
import '@/assets/scss/app.scss';
function App() {
  return <>
      <AppProvidersWrapper>
        <AppRouter />
      </AppProvidersWrapper>
    </>;
}
export default App;