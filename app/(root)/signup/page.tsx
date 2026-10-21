import SignUpForm from '@/components/forms/sign-up-form'
import React from 'react'

const page = () => {
  return (
    <div>
      <SignUpForm showGoogle={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} />
    </div>
  )
}

export default page
