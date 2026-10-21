 
import { signOut } from "@/auth"
import { Button } from "../ui/button"
 
export async function SignOut() {
  return (
    <form action={async (formData) => {
            await signOut()
        }}
        >
        <Button type="submit">Sign out</Button>
    </form>
  )
}