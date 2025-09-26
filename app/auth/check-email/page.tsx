import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">
            We've sent you a confirmation email. Please check your inbox and click the link to activate your account.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
