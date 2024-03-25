"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps, useState } from "react"
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout"

export default function Component() {
    const router = useRouter()

      const [processing, setProcessing] = useState(false);
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
    
      const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setProcessing(true);
        // Add your logic for form submission here
        
        const data = {
          email: email,
          password: password,
          username: email,
          confirmPassword: confirmPassword
        }

        console.log('Form submitted:', data);
        
        try {
          let newData = fetch('/api/auth/applicant/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          let response = await (await newData).json()
          if(response.message === "ok"){
            setTimeout(() => {
            
           
              console.log("response", response);
              
              setTimeout(() => {
               router.push('/ApplicantLogin')
              }
              , 600)
                 setProcessing(false);
            }, 4000);
          }
         if(response.status === 400){
            setTimeout(() => {
              toast.error(`${response.message}`, {
                style: {
                  border: '1px solid #713200',
                  padding: '16px',
                  color: '#713200',
                },
                iconTheme: {
                  primary: '#713200',
                  secondary: '#FFFAEE',
                },
              });
            }, 1000);
          }
        }
        
      
        catch(err:any){
          console.log(err)
          toast.error(`${err.message}`, {
            style: {
              border: '1px solid #713200',
              padding: '16px',
              color: '#713200',
            },
            iconTheme: {
              primary: '#713200',
              secondary: '#FFFAEE',
            },
          });
        }
        setProcessing(false);
      }
      

  
    
  return (
    <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen  dark:bg-gray-900">
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">Sign Up</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="you@example.com" required type="email"  onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" required type="password"  onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" required type="password"  onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <Button
         disabled={processing} 
        className="w-full" type="submit">
          {processing ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Processing</span>
            </div>
          ) : (
            'Sign Up'
          )}
        </Button>
   <div 
    className="flex items-center justify-center space-x-2"
   />
        <div  className="my-7">
        Already have an account? 
        <div className="flex flex-row gap-x-2 ">
        <a href="/AdminLogin" className="  underline-offset-auto underline">
            continue to Admin
        </a>
        <a href="/ApplicantLogin" className="  underline-offset-auto underline">
            continue to Applicant
        </a>
        </div>
      </div>

      </form>
      {/* ... rest of the code ... */}
    
    </div>
  </div> 
    </Layout>
 
  )
}

function ChromeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  )
}