"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchQueriesAction, updateQueryStatusAction, deleteQueryAction } from "@/store/querySlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown, Trash2, Phone, User, MessageSquare, Calendar, Loader2, MessageCircle } from "lucide-react"

export default function PatientQueries() {
  const dispatch = useAppDispatch()
  const { queries, loading, error } = useAppSelector((state) => state.queries)
  const { toast } = useToast()
  const [filter, setFilter] = useState<"all" | "pending" | "answered" | "closed">("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [queryToDelete, setQueryToDelete] = useState<string | null>(null)
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    dispatch(fetchQueriesAction())
  }, [dispatch])

  const handleStatusChange = async (queryId: string, newStatus: "pending" | "answered" | "closed") => {
    setLoadingStates((prev) => ({ ...prev, [queryId]: true }))
    try {
      await dispatch(updateQueryStatusAction({ id: queryId, status: newStatus })).unwrap()
      toast({
        title: "Status Updated",
        description: `Query status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update query status",
        variant: "destructive",
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, [queryId]: false }))
    }
  }

  const handleDeleteQuery = async () => {
    if (!queryToDelete) return

    try {
      await dispatch(deleteQueryAction(queryToDelete)).unwrap()
      toast({
        title: "Query Deleted",
        description: "Patient query has been deleted successfully",
      })
      setDeleteDialogOpen(false)
      setQueryToDelete(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete query",
        variant: "destructive",
      })
    }
  }

  const sendWhatsAppResponse = (phone: string, name: string, department: string) => {
    let formattedPhone = phone.replace(/\D/g, "")
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "92" + formattedPhone.substring(1)
    } else if (!formattedPhone.startsWith("92")) {
      formattedPhone = "92" + formattedPhone
    }

    const message = `Hello ${name}, Thank you for contacting our dental clinic regarding ${department.replace("-", " ")}. We have received your query and our team will get back to you shortly with the information you requested. Best regards, Dr Usama Sheikh Admin`

    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "answered":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "closed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusOptions = (currentStatus: string) => {
    const allStatuses = ["pending", "answered", "closed"]
    return allStatuses.filter((status) => status !== currentStatus)
  }

  const filteredQueries = queries
    .filter((query) => {
      if (filter === "all") return true
      return query.status === filter
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const pendingCount = queries.filter((q) => q.status === "pending").length
  const answeredCount = queries.filter((q) => q.status === "answered").length
  const closedCount = queries.filter((q) => q.status === "closed").length

  if (loading && queries.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading queries...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} className="text-sm">
          All Queries ({queries.length})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
          className="text-sm"
        >
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filter === "answered" ? "default" : "outline"}
          onClick={() => setFilter("answered")}
          className="text-sm"
        >
          Answered ({answeredCount})
        </Button>
        <Button
          variant={filter === "closed" ? "default" : "outline"}
          onClick={() => setFilter("closed")}
          className="text-sm"
        >
          Closed ({closedCount})
        </Button>
      </div>

      {/* Queries List */}
      <div className="space-y-4">
        {filteredQueries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No queries found</p>
            </CardContent>
          </Card>
        ) : (
          filteredQueries.map((query) => (
            <Card key={query._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{query.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Phone className="h-3 w-3" />
                        <span>{query.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(query.status)}>
                      {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQueryToDelete(query._id)
                        setDeleteDialogOpen(true)
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Department</p>
                  <Badge variant="outline" className="capitalize">
                    {query.department.replace("-", " ")}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Message</p>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{query.message}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                    <span>{new Date(query.createdAt).toLocaleTimeString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendWhatsAppResponse(query.phone, query.name, query.department)}
                      className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={loadingStates[query._id]}
                          className="w-full sm:w-auto bg-transparent"
                        >
                          {loadingStates[query._id] ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Change Status
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {getStatusOptions(query.status).map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(query._id, status as any)}
                            className="capitalize"
                          >
                            {status.replace("-", " ")}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Query</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this patient query? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuery}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
