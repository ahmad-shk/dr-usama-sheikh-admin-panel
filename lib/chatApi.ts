import { API_BASE_URL } from "./api"

export const chatAPI = {
  async updateChatStatus(id: string, status: "pending" | "answered" | "closed") {
    const response = await fetch(`${API_BASE_URL}/api/chats/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },
}
