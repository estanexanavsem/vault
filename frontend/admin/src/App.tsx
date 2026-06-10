import { MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import 'dayjs/locale/ru'
import AuthGate from './components/AuthGate'
import { appTheme } from './theme'

function App() {
  return (
    <MantineProvider theme={appTheme} forceColorScheme="dark">
      <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }}>
        <AuthGate />
      </DatesProvider>
    </MantineProvider>
  )
}

export default App
