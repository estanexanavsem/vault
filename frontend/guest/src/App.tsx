import axios from 'axios'
import {
  Alert,
  Button,
  MantineProvider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  createTheme,
} from '@mantine/core'
import { AlertCircle, Lock, User } from 'lucide-react'
import { useState, type FormEvent } from 'react'

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
})

interface GuestData {
  master: {
    id: number
    login: string
    holder_name: string
    account_name: string
    full_account_name: string
    account_number: string
    routing_number: string
    email: string
    phone: string
    balance: number
    created_at: string
    updated_at: string
  }
  transfers: Transfer[]
  files: GuestFile[]
}

interface Transfer {
  id: number
  account_id: number
  from_account: string
  to_account: string
  amount: number
  description: string
  full_description: string
  category: string
  reference: string
  transfer_type: string
  status: string
  transaction_date: string
  created_at: string
}

interface GuestFile {
  id: number
  account_id: number
  name: string
  type: string
  size: number
  description: string
  created_at: string
}

interface GuestLoginResponse {
  success: boolean
  data?: GuestData
  error?: string
}

interface ApiErrorResponse {
  error?: string
}

function App() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [data, setData] = useState<GuestData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data: response } = await axios.post<GuestLoginResponse>('/api/guest/login', {
        login,
        password,
      })
      if (response.success && response.data) {
        setData(response.data)
      } else {
        setError(response.error ?? 'Invalid credentials')
      }
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        setError(error.response?.data?.error ?? 'Connection error')
      } else {
        setError('Connection error')
      }
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
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-600" />
                <Text fw={700} size="lg">
                  Truist
                </Text>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="mx-auto max-w-7xl px-4 py-6">
            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
              <h1 className="mb-2 text-2xl font-semibold">Welcome, {data.master.holder_name}</h1>
              <p className="text-gray-500">
                {data.master.account_name.trim() !== ''
                  ? data.master.account_name
                  : 'Checking Account'}
              </p>

              {/* Balance Card */}
              <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <Text size="sm" className="opacity-80">
                  Available Balance
                </Text>
                <Text size="3rem" fw={700} className="mt-1">
                  $
                  {Number(data.master.balance).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </div>

              {/* Account Details */}
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase">
                    Account Number
                  </Text>
                  <Text fw={500}>
                    {data.master.account_number.trim() !== '' ? data.master.account_number : '-'}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase">
                    Routing Number
                  </Text>
                  <Text fw={500}>
                    {data.master.routing_number.trim() !== '' ? data.master.routing_number : '-'}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase">
                    Email
                  </Text>
                  <Text fw={500} size="sm">
                    {data.master.email.trim() !== '' ? data.master.email : '-'}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase">
                    Phone
                  </Text>
                  <Text fw={500}>{data.master.phone.trim() !== '' ? data.master.phone : '-'}</Text>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
              {data.transfers.length > 0 ? (
                <div className="space-y-3">
                  {data.transfers.slice(0, 10).map((transfer) => (
                    <div
                      key={transfer.id}
                      className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0"
                    >
                      <div>
                        <Text fw={500}>
                          {transfer.description.trim() !== ''
                            ? transfer.description
                            : 'Transaction'}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {transfer.transaction_date}
                        </Text>
                      </div>
                      <Text
                        fw={600}
                        className={transfer.amount >= 0 ? 'text-green-600' : 'text-red-600'}
                      >
                        {transfer.amount >= 0 ? '+' : ''}${transfer.amount.toFixed(2)}
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Paper shadow="xl" p="xl" w={420} className="rounded-xl bg-white">
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <Text size="xl" fw={700}>
                    Truist
                  </Text>
                  <Text c="dimmed" size="xs">
                    Guest Access
                  </Text>
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
