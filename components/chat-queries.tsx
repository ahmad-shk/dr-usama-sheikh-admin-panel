"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { chatAPI } from "@/lib/chatApi"
import { FaWhatsapp } from "react-icons/fa"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ChatQuery {
  _id: string
  name: string
  phone: string
  createdAt: string
  status?: string
}


interface ChatQueriesProps {
  chats?: ChatQuery[]
  loading?: boolean
  error?: string
}

const ChatQueries: React.FC<ChatQueriesProps> = ({ chats = [], loading = false, error = "" }) => {
  const [localChats, setLocalChats] = useState<ChatQuery[]>(chats)
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({})
  useEffect(() => { setLocalChats(chats) }, [chats])
  const pendingCount = localChats.filter((c) => c.status === "pending").length
  const sortedChats = [...localChats].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const getStatusOptions = (currentStatus: string | undefined) => {
    const allStatuses: Array<"pending" | "completed"> = ["pending", "completed"];
    return allStatuses.filter((status) => status !== currentStatus);
  }

  const handleStatusChange = async (chatId: string, newStatus: "pending" | "completed") => {
    setLoadingStates((prev) => ({ ...prev, [chatId]: true }))
    try {
      // Map 'completed' to 'closed' for backend
      const backendStatus = newStatus === "completed" ? "closed" : newStatus;
      const updated = await chatAPI.updateChatStatus(chatId, backendStatus)
      // Map 'closed' back to 'completed' for UI
      setLocalChats((prev) => prev.map((c) => c._id === chatId ? { ...c, status: updated.status === "closed" ? "completed" : updated.status } : c))
    } catch (err) {
      // Optionally show error toast
    } finally {
      setLoadingStates((prev) => ({ ...prev, [chatId]: false }))
    }
  }

  if (error) {
    return (
      <Alert className="mb-4 border-red-200 bg-red-50">
        <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
      </Alert>
    )
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading chat queries...</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-green-100 to-blue-100 rounded-t-lg border-b flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-green-700 flex items-center gap-2">
          <FaWhatsapp className="h-7 w-7 text-green-600" /> Chat Queries
        </CardTitle>
        {pendingCount > 0 && (
          <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white animate-pulse">
            {pendingCount} Pending
          </span>
        )}
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-sm">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-green-700 uppercase tracking-wider w-1 text-right">WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {sortedChats.map((chat) => (
                <tr key={chat._id} className="bg-white even:bg-green-50 hover:bg-green-100 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{chat.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">{chat.phone}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{new Date(chat.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2 min-w-[6rem]">
                          {loadingStates[chat._id] ? (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          ) : chat.status === "pending" || chat.status === "completed" ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                              ${chat.status === "pending" ? "bg-red-100 text-red-700" : ""}
                              ${chat.status === "completed" ? "bg-green-100 text-green-700" : ""}
                            `}>
                              {chat.status === "pending" && "Pending"}
                              {chat.status === "completed" && "Completed"}
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">N/A</span>
                          )}
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {getStatusOptions(chat.status).map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(chat._id, status as any)}
                            className="capitalize"
                          >
                            {status.replace("-", " ")}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap align-middle">
                    <div className="flex justify-end">
                      <a
                        href={`https://wa.me/${chat.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="lg" variant="default" className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md">
                          <FaWhatsapp className="h-6 w-6" />
                          <span className="font-semibold text-base">WhatsApp</span>
                        </Button>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="block md:hidden space-y-4">
          {sortedChats.map((chat) => (
            <div key={chat._id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border border-green-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-green-700">{chat.name}</span>
                <span className="text-xs text-gray-500">{new Date(chat.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{chat.phone}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 flex items-center gap-2"
                    >
                      {loadingStates[chat._id] ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      ) : chat.status === "pending" || chat.status === "completed" ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${chat.status === "pending" ? "bg-red-100 text-red-700" : ""}
                          ${chat.status === "completed" ? "bg-green-100 text-green-700" : ""}
                        `}>
                          {chat.status === "pending" && "Pending"}
                          {chat.status === "completed" && "Completed"}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">N/A</span>
                      )}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {getStatusOptions(chat.status).map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(chat._id, status as any)}
                        className="capitalize"
                      >
                        {status.replace("-", " ")}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex justify-end mt-2">
                <a
                  href={`https://wa.me/${chat.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="default" className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md w-full justify-center">
                    <FaWhatsapp className="h-6 w-6" />
                    <span className="font-semibold text-base">WhatsApp</span>
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ChatQueries;
